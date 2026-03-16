import type { APIRoute } from "astro";
import { z } from "zod";
import { db } from "@/lib/auth";

const DeleteUserSchema = z.object({
	userId: z.string(),
});

export const POST: APIRoute = async ({ request, locals }) => {
	try {
		const body = await request.json();
		const parseResult = DeleteUserSchema.safeParse(body);

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

		const { userId } = parseResult.data;

		// Prevent admin from deleting their own account
		if (userId === locals.user?.id) {
			return new Response(
				JSON.stringify({ error: "Cannot delete your own account" }),
				{
					status: 400,
					headers: { "Content-Type": "application/json" },
				},
			);
		}

		// Delete user
		db(locals.runtime.env);
		await db.user.delete({
			where: { id: userId },
		});

		return new Response(JSON.stringify({ success: true }), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	} catch (error) {
		console.error("Error deleting user:", error);
		return new Response(JSON.stringify({ error: "Failed to delete user" }), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		});
	}
};