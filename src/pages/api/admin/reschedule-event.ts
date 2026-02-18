import type { APIRoute } from "astro";
import { z } from "zod";
import { db } from "@/lib/auth";

const RescheduleEventSchema = z.object({
	eventId: z.string(),
});

export const POST: APIRoute = async ({ request, locals }) => {
	try {
		const body = await request.json();
		const parseResult = RescheduleEventSchema.safeParse(body);

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

		// Get the event to check it exists and is canceled
		const event = await db.event.findUnique({
			where: { id: eventId },
		});

		if (!event) {
			return new Response(JSON.stringify({ error: "Event not found" }), {
				headers: { "Content-Type": "application/json" },
				status: 404,
			});
		}

		if (event.status !== "canceled") {
			return new Response(JSON.stringify({ error: "Event is not canceled" }), {
				headers: { "Content-Type": "application/json" },
				status: 400,
			});
		}

		// Check if date falls within a break period
		const breaks = await db.break.findMany({
			where: {
				endDate: { gte: event.eventDate },
				startDate: { lte: event.eventDate },
			},
		});

		if (breaks.length > 0) {
			return new Response(
				JSON.stringify({
					error: "Cannot reschedule event during a break period",
				}),
				{
					headers: { "Content-Type": "application/json" },
					status: 400,
				},
			);
		}

		// Update event status back to scheduled
		const updatedEvent = await db.event.update({
			data: { status: "scheduled" },
			where: { id: eventId },
		});

		return new Response(
			JSON.stringify({ event: updatedEvent, success: true }),
			{
				headers: { "Content-Type": "application/json" },
				status: 200,
			},
		);
	} catch (error) {
		console.error("Error rescheduling event:", error);
		return new Response(
			JSON.stringify({ error: "Failed to reschedule event" }),
			{
				headers: { "Content-Type": "application/json" },
				status: 500,
			},
		);
	}
};
