import { createHmac } from "node:crypto";
import type { APIRoute } from "astro";
import { db } from "@/lib/auth";
import { isWithinEventHours } from "@/lib/date-utils";

export const POST: APIRoute = async ({ locals }) => {
	try {
		const {runtime} = locals;

		// Initialize database
		db(runtime.env);

		// Check if it's Saturday between 9am and 12pm EST/EDT
		if (!isWithinEventHours()) {
			return new Response(
				JSON.stringify({
					message:
						"The door can only be opened on Saturdays from 9 AM to 12 PM EST.",
					success: false,
				}),
				{
					headers: { "Content-Type": "application/json" },
					status: 403,
				},
			);
		}

		// Make SwitchBot request to open door
		const result = await switchbotRequest(
			`v1.1/devices/${process.env.SWITCHBOT_DEVICE_ID}/commands`,
			{
				body: JSON.stringify({
					command: "press",
					commandType: "command",
					parameter: "default",
				}),
				method: "POST",
			},
		);

		if (result.statusCode === 100) {
			return new Response(
				JSON.stringify({
					message: "Door opened successfully! Come on up to the 5th floor.",
					success: true,
				}),
				{
					headers: { "Content-Type": "application/json" },
					status: 200,
				},
			);
		} else {
			return new Response(
				JSON.stringify({
					message: "Failed to open door. Please try again or contact support.",
					success: false,
				}),
				{
					headers: { "Content-Type": "application/json" },
					status: 500,
				},
			);
		}
	} catch (error) {
		console.error("Buzz error:", error);
		return new Response(
			JSON.stringify({
				message: "An error occurred while trying to open the door.",
				success: false,
			}),
			{
				headers: { "Content-Type": "application/json" },
				status: 500,
			},
		);
	}
};

async function switchbotRequest(path: string, args: RequestInit) {
	const token = process.env.SWITCHBOT_TOKEN;
	const secret = process.env.SWITCHBOT_KEY;

	if (!token || !secret) {
		throw new Error("SwitchBot credentials not configured");
	}

	const t = Date.now();
	const nonce = Math.floor(Math.random() * 1000000);
	const sign = createHmac("sha256", secret)
		.update(Buffer.from(token + t + nonce, "utf-8"))
		.digest()
		.toString("base64");

	const response = await fetch(`https://api.switch-bot.com/${path}`, {
		headers: {
			Authorization: token,
			"Content-Type": "application/json",
			nonce: nonce.toString(),
			sign: sign,
			t: t.toString(),
		},
		...args,
	});

	return response.json();
}
