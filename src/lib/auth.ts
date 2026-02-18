import { PrismaClient } from "@generated/prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin, magicLink } from "better-auth/plugins";
import MagicLinkEmail from "@/emails/MagicLinkEmail";
import VerificationEmail from "@/emails/VerificationEmail";
import type { UserEventMessage } from "@/services/user-event-consumer";
import resend from "./resend";
import { lazyInvokable } from "./utils";

export const db = lazyInvokable((env: Env) => {
	const client = new PrismaClient({
		// @ts-expect-error - Prisma adapter is added at runtime
		adapter: new PrismaD1(env.DB),
	});

	// Seed development data when client is first created
	if (import.meta.env.DEV) {
		import("./seed").then(({ seedDevelopmentData }) => {
			seedDevelopmentData(client);
		});
	}

	return client;
});

// Helper function to queue user events
export const queueUserEvent = (env: Env, message: UserEventMessage) => env.USER_EVENT_QUEUE.send(message);

// KV adapter for better-auth secondary storage
const createKVAdapter = (kv: KVNamespace) => ({
	async delete(key: string): Promise<void> {
		await kv.delete(key);
	},
	async get(key: string): Promise<string | null> {
		return await kv.get(key);
	},
	async set(key: string, value: string, ttl?: number): Promise<void> {
		const options = ttl ? { expirationTtl: ttl } : undefined;
		await kv.put(key, value, options);
	},
});

// Function to create auth with environment context
export const createAuth = (env?: Env) =>
	betterAuth({
		basePath: "/auth",
		baseURL: process.env.BETTER_AUTH_BASE_URL ?? "http://localhost:4433",
		database: prismaAdapter(db, {
			provider: "sqlite",
		}),
		emailVerification: {
			autoSignInAfterVerification: true,
			expiresIn: 60 * 60 * 5,
			async onEmailVerification(user, _request) {
				// Queue the contact creation and welcome email instead of doing it directly
				if (env) {
					try {
						await queueUserEvent(env, {
							email: user.email,
							name: user.name || undefined,
							sendWelcomeEmail: true,
							type: "user_create",
						});
					} catch (error) {
						// Log error but don't fail the verification process
						console.error("Failed to queue user event:", error);
					}
				}
			},
			sendOnSignUp: true,
			async sendVerificationEmail({ user, url }) {
				await resend.emails.send({
					from: "noreply@sideprojectsaturday.com",
					react: VerificationEmail({
						username: user.name,
						verificationUrl: url,
					}),
					subject: "Verify your email address",
					to: user.email,
				});
			}, // 5 hours
		},
		plugins: [
			admin(),
			magicLink({
				async sendMagicLink({ email, url }) {
					if (process.env.NODE_ENV === "development") {
						console.log("magic link:", url);
					}
					await resend.emails.send({
						from: "noreply@sideprojectsaturday.com",
						react: MagicLinkEmail({ magicLink: url }),
						subject: "Sign in to Side Project Saturday",
						to: email,
					});
				},
			}),
		],
		secondaryStorage: env?.KV ? createKVAdapter(env.KV) : undefined,
	});

// Default auth instance for compatibility
export const auth = createAuth();
