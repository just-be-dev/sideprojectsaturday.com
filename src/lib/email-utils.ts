import { createHash } from "node:crypto";
import RsvpConfirmationEmail from "@/emails/RsvpConfirmationEmail";
import { generateCalendarEvent } from "@/lib/calendar";
import resend from "@/lib/resend";

interface SendRsvpConfirmationParams {
	userEmail: string;
	userName?: string;
	userId: string;
	eventDate: Date;
	baseUrl: string;
}

export async function sendRsvpConfirmation({
	userEmail,
	userName,
	userId,
	eventDate,
	baseUrl,
}: SendRsvpConfirmationParams) {
	const calendar = generateCalendarEvent(eventDate);

	// Create idempotency key based on user, event date, and action
	const idempotencyKey = createHash("sha256")
		.update(
			`rsvp-confirmation-${userId}-${eventDate.toISOString().split("T")[0]}`,
		)
		.digest("hex")
		.substring(0, 32);

	const eventDateStr = eventDate.toLocaleDateString("en-US", {
		day: "numeric",
		month: "long",
		weekday: "long",
		year: "numeric",
	});

	try {
		const result = await resend.emails.send({
			attachments: [
				{
					content: Buffer.from(calendar.icsContent).toString("base64"),
					contentType: "text/calendar",
					filename: "side-project-saturday.ics",
				},
			],
			from: "Side Project Saturday <events@sideprojectsaturday.com>",
			headers: {
				"X-Idempotency-Key": idempotencyKey,
			},
			react: RsvpConfirmationEmail({
				calendarLink: calendar.googleCalendarUrl,
				cancelLink: `${baseUrl}/rsvp/cancel`,
				eventDate: eventDateStr,
				eventTime: "9:00 AM - 12:00 PM",
				recipientName: userName,
				userId: userId,
			}),
			subject: `✅ You're confirmed for Side Project Saturday - ${eventDateStr}`,
			to: userEmail,
		});

		return { emailId: result.data?.id, success: true };
	} catch (error) {
		console.error("Failed to send RSVP confirmation:", error);
		return { error, success: false };
	}
}
