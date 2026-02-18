import type { APIRoute } from "astro";
import { db } from "@/lib/auth";

export const POST: APIRoute = async ({ request, locals }) => {
	try {
		const { content, enabled } = (await request.json()) as {
			content: string;
			enabled: boolean | string;
		};

		// Convert string "true"/"false" to boolean if needed
		const enabledBool =
			typeof enabled === "string" ? enabled === "true" : enabled;

		if (typeof content !== "string" || typeof enabledBool !== "boolean") {
			return new Response(JSON.stringify({ error: "Invalid request data" }), {
				headers: { "Content-Type": "application/json" },
				status: 400,
			});
		}

		// Initialize db with runtime env
		db(locals.runtime.env);

		// Check if banner config exists
		const existingConfig = await db.bannerConfig.findFirst({
			orderBy: {
				updatedAt: "desc",
			},
		});

		if (existingConfig) {
			// Update existing config
			await db.bannerConfig.update({
				data: {
					content,
					enabled: enabledBool,
					updatedAt: new Date(),
				},
				where: { id: existingConfig.id },
			});
		} else {
			// Create new config
			await db.bannerConfig.create({
				data: {
					content,
					enabled: enabledBool,
				},
			});
		}

		return new Response(JSON.stringify({ success: true }), {
			headers: { "Content-Type": "application/json" },
			status: 200,
		});
	} catch (error) {
		console.error("Failed to update banner:", error);
		return new Response(JSON.stringify({ error: "Failed to update banner" }), {
			headers: { "Content-Type": "application/json" },
			status: 500,
		});
	}
};
