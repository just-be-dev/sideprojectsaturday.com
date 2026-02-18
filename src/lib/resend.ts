import { type CreateEmailOptions, Resend } from "resend";
import { lazy } from "./utils.ts";

// Mock Resend API for local development
const mockResend = {
	contacts: {
		create: async (data: unknown) => {
			console.log("📧 MOCK: Creating contact in Resend:", data);
			return { id: "mock-contact-id" };
		},
		get: async (data: unknown) => {
			console.log("📧 MOCK: Getting contact from Resend:", data);
			return { id: "mock-contact-id", unsubscribed: false };
		},
		remove: async (data: unknown) => {
			console.log("📧 MOCK: Removing contact from Resend:", data);
			return { success: true };
		},
		update: async (data: unknown) => {
			console.log("📧 MOCK: Updating contact in Resend:", data);
			return { id: "mock-contact-id" };
		},
	},
	emails: {
		send: async (data: CreateEmailOptions) => {
			console.log("📧 MOCK: Sending email via Resend:", {
				from: data.from,
				react: data.react ? "React component provided" : "No React component",
				subject: data.subject,
				to: data.to,
			});
			return { id: "mock-email-id" };
		},
	},
};

// Function to get Resend instance (mock in development, real in production)
export const getResend = (): Resend => {
	// Check for development environment
	const isDevelopment = process.env.NODE_ENV === "development";

	if (isDevelopment) {
		return mockResend as unknown as Resend;
	}

	// Return real Resend instance for production
	const apiKey = process.env.RESEND_API_KEY;
	return new Resend(apiKey);
};

// Legacy lazy export for backward compatibility
const resend = lazy(() => getResend());

export default resend;
