import type { APIRoute } from "astro";
import { createAuth, db } from "../../lib/auth";
import { getRsvpEventCutoff } from "../../lib/date-utils";
import { sendRsvpConfirmation } from "../../lib/email-utils";

export const POST: APIRoute = async ({ request, locals }) => {
	try {
		const auth = createAuth(locals.runtime.env);
		// Get current user session
		const session = await auth.api.getSession({
			headers: request.headers,
		});

		if (!session?.user?.id) {
			return new Response("Unauthorized", { status: 401 });
		}

		// Get form data
		const formData = await request.formData();
		const rsvped = formData.get("rsvped") === "true";

		// Get the database instance with proper env
		const {runtime} = locals;
		if (!runtime?.env) {
			return new Response("Database environment not available", {
				status: 500,
			});
		}

		// Initialize the database with runtime env
		db(runtime.env);

		// Update user RSVP status in database
		await db.user.update({
			data: { rsvped },
			where: { id: session.user.id },
		});

		// Send RSVP confirmation email when user RSVPs (not when canceling)
		if (rsvped) {
			try {
				// Get the appropriate event based on current time
				const eventCutoff = getRsvpEventCutoff();
				const nextEvent = await db.event.findFirst({
					orderBy: {
						eventDate: "asc",
					},
					where: {
						eventDate: {
							gte: eventCutoff,
						},
						status: {
							in: ["scheduled", "inprogress"],
						},
					},
				});

				if (nextEvent) {
					await sendRsvpConfirmation({
						baseUrl:
							runtime.env.BETTER_AUTH_BASE_URL ||
							"https://sideprojectsaturday.com",
						eventDate: new Date(nextEvent.eventDate),
						userEmail: session.user.email,
						userId: session.user.id,
						userName: session.user.name || undefined,
					});
				}
			} catch (emailError) {
				console.error("Failed to send RSVP confirmation email:", emailError);
				// Don't fail the RSVP if email fails
			}
		}

		// Generate HTML response directly
		const statusText = rsvped ? "✅ You're RSVP'd!" : "❌ Not RSVP'd";
		const buttonText = rsvped ? "Cancel RSVP" : "RSVP Now";
		const nextValue = rsvped ? "false" : "true";

		const html = `
      <div id="rsvp-section" class="bg-green-50 border border-green-200 rounded-md p-3">
        <div class="text-sm font-medium text-green-800 mb-2">
          Next Event RSVP
        </div>
        <div class="flex items-center justify-between">
          <span class="text-green-700 text-sm">
            ${statusText}
          </span>
          <form
            hx-post="/api/rsvp-toggle"
            hx-target="#rsvp-section"
            hx-swap="outerHTML"
          >
            <input
              type="hidden"
              name="rsvped"
              value="${nextValue}"
            />
            <button
              type="submit"
              class="text-xs text-green-600 hover:text-green-800 font-medium underline cursor-pointer"
            >
              ${buttonText}
            </button>
          </form>
        </div>
      </div>
    `;

		return new Response(html.trim(), {
			headers: { "Content-Type": "text/html" },
		});
	} catch (error) {
		console.error("RSVP toggle error:", error);
		return new Response("Failed to update RSVP status", { status: 500 });
	}
};
