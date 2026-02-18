import type { APIRoute } from "astro";
import { z } from "zod";
import { db } from "@/lib/auth";
import resend from "@/lib/resend";

const UpdateUserFieldSchema = z.object({
	userId: z.string(),
	field: z.enum(["rsvped", "subscribed"]),
	value: z.boolean(),
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
			// Convert boolean strings to actual booleans
			if (body.value === "true") body.value = true;
			if (body.value === "false") body.value = false;
		}

		const parseResult = UpdateUserFieldSchema.safeParse(body);

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

		const { userId, field, value } = parseResult.data;

		// Update user field
		db(locals.runtime.env);

		// Get user data for Resend synchronization if updating subscription
		let userEmail = null;
		if (field === "subscribed") {
			const user = await db.user.findUnique({
				where: { id: userId },
				select: { email: true },
			});
			if (!user) {
				return new Response(JSON.stringify({ error: "User not found" }), {
					status: 404,
					headers: { "Content-Type": "application/json" },
				});
			}
			userEmail = user.email;
		}

		await db.user.update({
			where: { id: userId },
			data: { [field]: value },
		});

		// If updating subscription status, also update Resend contact
		if (field === "subscribed" && userEmail) {
			try {
				await resend.contacts.update({
					email: userEmail,
					audienceId: locals.runtime.env.RESEND_AUDIENCE_ID,
					unsubscribed: !value,
				});
			} catch (error) {
				console.error("Failed to update Resend contact:", error);
				// Don't fail the request if Resend update fails, but log the error
			}
		}

		return new Response(JSON.stringify({ success: true }), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	} catch (error) {
		console.error("Error updating user field:", error);
		return new Response(
			JSON.stringify({ error: "Failed to update user field" }),
			{
				status: 500,
				headers: { "Content-Type": "application/json" },
			},
		);
	}
};
