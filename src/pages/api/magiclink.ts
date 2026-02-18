import type { APIRoute } from "astro";
import { z } from "zod/v4";
import { createAuth } from "@/lib/auth";

const MagicLinkRequestSchema = z.object({
	callbackURL: z.enum(["/buzz", "/rsvp", "/rsvp/cancel"]).optional(),
	email: z.email("Invalid email address"),
});

export const POST: APIRoute = async ({ request, locals }) => {
	try {
		const body = await request.json();

		// Validate request body with Zod
		const result = MagicLinkRequestSchema.safeParse(body);

		if (!result.success) {
			const errors = result.error.issues.map((e) => e.message).join(", ");
			return new Response(`Validation error: ${errors}`, { status: 400 });
		}

		const { email, callbackURL } = result.data;

		const auth = createAuth(locals.runtime.env);
		// Send magic link using better-auth
		await auth.api.signInMagicLink({
			body: {
				callbackURL: callbackURL || "/",
				email,
			},
			headers: request.headers,
		});

		return new Response("Magic link sent successfully", { status: 200 });
	} catch (error) {
		console.error("Magic link error:", error);
		return new Response("Failed to send magic link", { status: 500 });
	}
};
