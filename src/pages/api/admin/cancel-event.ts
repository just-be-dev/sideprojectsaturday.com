import type { APIRoute } from "astro";
import { z } from "zod";
import { db } from "@/lib/auth";

const CancelEventSchema = z.object({
	eventId: z.string(),
});

export const POST: APIRoute = async ({ request, locals }) => {
	try {
		const body = await request.json();
		const parseResult = CancelEventSchema.safeParse(body);

		if (!parseResult.success) {
			return new Response(
				JSON.stringify({
					details: parseResult.error.flatten(),
					error: "Invalid request",
				}),
				{
					headers: { "Content-Type": "application/json" },
					status: 400,
				},
			);
		}

		const { eventId } = parseResult.data;

		db(locals.runtime.env);

		// Update event status to canceled
		const event = await db.event.update({
			data: { status: "canceled" },
			where: { id: eventId },
		});

		return new Response(JSON.stringify({ event, success: true }), {
			headers: { "Content-Type": "application/json" },
			status: 200,
		});
	} catch (error) {
		console.error("Error canceling event:", error);
		return new Response(JSON.stringify({ error: "Failed to cancel event" }), {
			headers: { "Content-Type": "application/json" },
			status: 500,
		});
	}
};
