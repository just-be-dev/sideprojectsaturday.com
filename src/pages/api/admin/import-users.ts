import type { APIRoute } from "astro";
import { z } from "zod";
import { db, queueUserEvent } from "@/lib/auth";

const ImportUsersSchema = z.object({
	csvData: z.string(),
});

interface ParsedUser {
	email: string;
	name?: string;
}

function parseCSV(csvData: string): ParsedUser[] {
	const lines = csvData.trim().split("\n");
	if (lines.length < 2) {
		throw new Error("CSV must have at least a header row and one data row");
	}

	const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());

	// Find email column (required)
	const emailIndex = headers.indexOf("email");
	if (emailIndex === -1) {
		throw new Error('CSV must have an "email" column');
	}

	// Find name column (optional)
	const nameIndex = headers.indexOf("name");

	const users: ParsedUser[] = [];

	for (let i = 1; i < lines.length; i++) {
		const values = lines[i].split(",").map((v) => v.trim());

		if (values.length < headers.length) {
			continue; // Skip incomplete rows
		}

		const email = values[emailIndex];
		if (!email || !email.includes("@")) {
			continue; // Skip invalid emails
		}

		const user: ParsedUser = { email };

		if (nameIndex !== -1 && values[nameIndex]) {
			user.name = values[nameIndex];
		}

		users.push(user);
	}

	return users;
}

export const POST: APIRoute = async ({ request, locals }) => {
	try {
		const body = await request.json();
		const parseResult = ImportUsersSchema.safeParse(body);

		if (!parseResult.success) {
			return new Response(
				JSON.stringify({
					error: "Invalid request",
					details: parseResult.error.flatten(),
				}),
				{
					status: 400,
					headers: { "Content-Type": "application/json" },
				},
			);
		}

		const { csvData } = parseResult.data;

		// Parse CSV
		let parsedUsers: ParsedUser[];
		try {
			parsedUsers = parseCSV(csvData);
		} catch (error) {
			return new Response(
				JSON.stringify({
					error: error instanceof Error ? error.message : "Failed to parse CSV",
				}),
				{
					status: 400,
					headers: { "Content-Type": "application/json" },
				},
			);
		}

		if (parsedUsers.length === 0) {
			return new Response(
				JSON.stringify({ error: "No valid users found in CSV" }),
				{
					status: 400,
					headers: { "Content-Type": "application/json" },
				},
			);
		}

		db(locals.runtime.env);

		const upsertResults = [];
		const BATCH_SIZE = 10; // Process in batches to avoid SQL variable limits

		for (let i = 0; i < parsedUsers.length; i += BATCH_SIZE) {
			const batch = parsedUsers.slice(i, i + BATCH_SIZE);
			const batchResults = await Promise.all(
				batch.map((user) =>
					db.user.upsert({
						where: { email: user.email },
						update: {
							name: user.name, // Update name if provided
							// Keep existing subscribed/rsvped/emailVerified values
						},
						create: {
							email: user.email,
							name: user.name,
							emailVerified: true, // Set as verified for batch imports
							subscribed: true,
							rsvped: false,
						},
					}),
				),
			);
			upsertResults.push(...batchResults);
		}

		// Queue all users for contact creation (without welcome emails) in batches
		// Note: This will queue both new and existing users, but that's okay for contact sync
		const QUEUE_BATCH_SIZE = 25; // Smaller batches for queue operations

		for (let i = 0; i < upsertResults.length; i += QUEUE_BATCH_SIZE) {
			const batch = upsertResults.slice(i, i + QUEUE_BATCH_SIZE);
			const queuePromises = batch.map((user) =>
				queueUserEvent(locals.runtime.env, {
					type: "user_create",
					email: user.email,
					name: user.name || undefined,
					sendWelcomeEmail: false, // Don't send welcome emails for batch imports
				}),
			);
			await Promise.all(queuePromises);
		}

		return new Response(
			JSON.stringify({
				success: true,
				processed: upsertResults.length,
				total: parsedUsers.length,
			}),
			{
				status: 200,
				headers: { "Content-Type": "application/json" },
			},
		);
	} catch (error) {
		console.error("Error importing users:", error);
		return new Response(JSON.stringify({ error: "Failed to import users" }), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		});
	}
};
