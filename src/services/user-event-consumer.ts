import WelcomeEmail from "@/emails/WelcomeEmail";
import { getResend } from "@/lib/resend";

export interface UserCreateEvent {
	type: "user_create";
	email: string;
	name?: string;
	sendWelcomeEmail?: boolean;
}

export interface UserUpdateEvent {
	type: "user_update";
	email: string;
	name?: string;
	newEmail?: string;
	subscribed?: boolean;
}

export type UserEventMessage = UserCreateEvent | UserUpdateEvent;

export default {
	async queue(
		batch: MessageBatch<UserEventMessage>,
		env: Env,
		_ctx: ExecutionContext,
	): Promise<void> {
		// Use centralized Resend instance (mock in development, real in production)
		const resend = getResend(env);

		for (const message of batch.messages) {
			try {
				const { type } = message.body;

				switch (type) {
					case "user_create": {
						const { email, name, sendWelcomeEmail } =
							message.body as UserCreateEvent;

						// Add user to Resend audience
						await resend.contacts.create({
							audienceId: env.RESEND_AUDIENCE_ID,
							email,
							unsubscribed: false,
						});

						// If welcome email should be sent, send it
						if (sendWelcomeEmail) {
							await resend.emails.send({
								from: "noreply@sideprojectsaturday.com",
								react: WelcomeEmail({
									userId: "",
									username: name || email, // We don't have userId for user_create events
								}),
								subject: "Welcome to Side Project Saturday!",
								to: email,
							});
						}
						break;
					}

					case "user_update": {
						const { email, newEmail, subscribed } =
							message.body as UserUpdateEvent;

						try {
							if (newEmail) {
								// Email is changing - fetch existing contact, create new one, delete old one
								try {
									// Fetch existing contact details
									const existingContact = await resend.contacts.get({
										audienceId: env.RESEND_AUDIENCE_ID,
										email,
									});

									// Create new contact with merged details
									await resend.contacts.create({
										audienceId: env.RESEND_AUDIENCE_ID,
										email: newEmail,
										unsubscribed:
											subscribed !== undefined
												? !subscribed
												: existingContact.unsubscribed,
									});

									// Delete old contact
									await resend.contacts.remove({
										audienceId: env.RESEND_AUDIENCE_ID,
										email,
									});

									console.log(
										`Successfully updated contact from ${email} to ${newEmail}`,
									);
								} catch (error) {
									console.error(
										`Failed to update contact email from ${email} to ${newEmail}:`,
										error,
									);
									throw error;
								}
							} else if (subscribed !== undefined) {
								// Only update if there's something to update
								const updateData = {
									audienceId: env.RESEND_AUDIENCE_ID,
									email,
									unsubscribed: !subscribed,
								};

								await resend.contacts.update(updateData);
								console.log(`Successfully updated contact for ${email}`);
							} else {
								// Nothing to update
								console.log(`No updates needed for contact ${email}`);
							}
						} catch (error) {
							console.error("Failed to update contact in Resend:", error);
							throw error;
						}
						break;
					}
				}

				// Acknowledge successful processing
				message.ack();
			} catch (error) {
				console.error(`Failed to process message:`, error, message.body);
				// Let the message retry
				message.retry();
			}
		}
	},
};
