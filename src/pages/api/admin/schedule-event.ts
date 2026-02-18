import type { APIRoute } from "astro";
import { z } from "zod";
import { db } from "@/lib/auth";

const ScheduleEventSchema = z.object({
	eventDate: z.string().transform((str) => new Date(str)),
});

export const POST: APIRoute = async ({ request, locals }) => {
	try {
		const contentType = request.headers.get("content-type");
		let body: unknown;

		if (contentType?.includes("application/json")) {
			body = await request.json();
		} else {
			const formData = await request.formData();
			body = Object.fromEntries(formData);
		}

		const parseResult = ScheduleEventSchema.safeParse(body);

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

		const { eventDate } = parseResult.data;

		db(locals.runtime.env);

		// Check if event already exists for this date
		const existingEvent = await db.event.findFirst({
			where: { eventDate },
		});

		if (existingEvent) {
			return new Response(
				JSON.stringify({ error: "Event already scheduled for this date" }),
				{
					headers: { "Content-Type": "application/json" },
					status: 400,
				},
			);
		}

		// Check if date falls within a break period
		const breaks = await db.break.findMany({
			where: {
				endDate: { gte: eventDate },
				startDate: { lte: eventDate },
			},
		});

		if (breaks.length > 0) {
			return new Response(
				JSON.stringify({
					error: "Cannot schedule event during a break period",
				}),
				{
					headers: { "Content-Type": "application/json" },
					status: 400,
				},
			);
		}

		// Create the event
		const event = await db.event.create({
			data: {
				eventDate,
				status: "scheduled",
			},
		});

		return new Response(JSON.stringify({ event, success: true }), {
			headers: { "Content-Type": "application/json" },
			status: 200,
		});
	} catch (error) {
		console.error("Error scheduling event:", error);
		return new Response(JSON.stringify({ error: "Failed to schedule event" }), {
			headers: { "Content-Type": "application/json" },
			status: 500,
		});
	}
};
