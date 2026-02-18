import type { APIRoute } from "astro";
import { z } from "zod";
import { db } from "@/lib/auth";

const ScheduleBreakSchema = z.object({
	endDate: z.string().transform((str) => new Date(str)),
	reason: z.string().optional(),
	startDate: z.string().transform((str) => new Date(str)),
});

export const POST: APIRoute = async ({ request, locals }) => {
	try {
		const body = await request.json();
		const parseResult = ScheduleBreakSchema.safeParse(body);

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

		const { startDate, endDate, reason } = parseResult.data;

		// Validate date range
		if (startDate >= endDate) {
			return new Response(
				JSON.stringify({ error: "Start date must be before end date" }),
				{
					headers: { "Content-Type": "application/json" },
					status: 400,
				},
			);
		}

		db(locals.runtime.env);

		// Check for overlapping breaks
		const overlappingBreaks = await db.break.findMany({
			where: {
				OR: [
					{
						endDate: { gte: startDate },
						startDate: { lte: endDate },
					},
				],
			},
		});

		if (overlappingBreaks.length > 0) {
			return new Response(
				JSON.stringify({ error: "Break period overlaps with existing break" }),
				{
					headers: { "Content-Type": "application/json" },
					status: 400,
				},
			);
		}

		// Cancel any events within the break period
		await db.event.updateMany({
			data: {
				status: "canceled",
			},
			where: {
				eventDate: {
					gte: startDate,
					lte: endDate,
				},
				status: "scheduled",
			},
		});

		// Create the break
		const breakPeriod = await db.break.create({
			data: {
				endDate,
				reason,
				startDate,
			},
		});

		return new Response(JSON.stringify({ break: breakPeriod, success: true }), {
			headers: { "Content-Type": "application/json" },
			status: 200,
		});
	} catch (error) {
		console.error("Error scheduling break:", error);
		return new Response(JSON.stringify({ error: "Failed to schedule break" }), {
			headers: { "Content-Type": "application/json" },
			status: 500,
		});
	}
};
