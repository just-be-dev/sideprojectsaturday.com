import type { APIRoute } from "astro";
import { createAuth, db } from "@/lib/auth";
import resend from "@/lib/resend";

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
		const subscribed = formData.get("subscribed") === "true";

		// Get the database instance with proper env
		const {runtime} = locals;
		if (!runtime?.env) {
			return new Response("Database environment not available", {
				status: 500,
			});
		}

		// Initialize the database with runtime env
		db(runtime.env);

		// Update user subscription preference in database
		await db.user.update({
			data: { subscribed },
			where: { id: session.user.id },
		});

		// Update Resend contact subscription status
		try {
			await resend.contacts.update({
				audienceId: runtime.env.RESEND_AUDIENCE_ID,
				email: session.user.email,
				unsubscribed: !subscribed,
			});
		} catch (error) {
			console.error("Failed to update Resend contact:", error);
			// Don't fail the request if Resend update fails
		}

		// Return updated subscription section HTML
		const statusText = subscribed
			? "📧 Subscribed to future events"
			: "🔕 Unsubscribed from future events";
		const buttonText = subscribed ? "Unsubscribe" : "Subscribe";
		const nextValue = subscribed ? "false" : "true";

		// Generate HTML response directly
		const html = `
      <div id="subscription-section" class="bg-purple-50 border border-purple-200 rounded-md p-3">
        <div class="text-sm font-medium text-purple-800 mb-2">
          Event Notifications
        </div>
        <div class="flex items-center justify-between">
          <span class="text-purple-700 text-sm">
            ${statusText}
          </span>
          <form
            hx-post="/api/subscription-toggle"
            hx-target="#subscription-section"
            hx-swap="outerHTML"
          >
            <input
              type="hidden"
              name="subscribed"
              value="${nextValue}"
            />
            <button
              type="submit"
              class="text-xs text-purple-600 hover:text-purple-800 font-medium underline cursor-pointer"
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
		console.error("Subscription toggle error:", error);
		return new Response("Failed to update subscription preference", {
			status: 500,
		});
	}
};
