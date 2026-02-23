import type { APIRoute } from "astro";
import { z } from "zod";
import { db } from "@/lib/auth";

const UpdateRoleSchema = z.object({
	role: z.enum(["user", "admin"]),
	userId: z.string(),
});

export const POST: APIRoute = async ({ request, locals }) => {
	try {
		const body = await request.json();
		const parseResult = UpdateRoleSchema.safeParse(body);

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

		const { userId, role } = parseResult.data;

		// Prevent admin from removing their own admin role
		if (userId === locals.user?.id && role !== "admin") {
			return new Response(
				JSON.stringify({ error: "Cannot remove your own admin role" }),
				{
					headers: { "Content-Type": "application/json" },
					status: 400,
				},
			);
		}

		// Update user role
		db(locals.runtime.env);
		await db.user.update({
			data: { role },
			where: { id: userId },
		});

		return new Response(JSON.stringify({ success: true }), {
			headers: { "Content-Type": "application/json" },
			status: 200,
		});
	} catch (error) {
		console.error("Error updating role:", error);
		return new Response(JSON.stringify({ error: "Failed to update role" }), {
			headers: { "Content-Type": "application/json" },
			status: 500,
		});
	}
};
