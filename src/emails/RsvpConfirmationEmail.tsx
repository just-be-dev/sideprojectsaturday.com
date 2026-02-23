import {
	Body,
	Button,
	Container,
	Head,
	Heading,
	Hr,
	Html,
	Link,
	Preview,
	Section,
	Text,
} from "@react-email/components";

interface RsvpConfirmationEmailProps {
	recipientName?: string;
	eventDate: string;
	eventTime: string;
	cancelLink: string;
	calendarLink?: string;
	userId?: string;
}

export default function RsvpConfirmationEmail({
	recipientName,
	eventDate,
	eventTime,
	cancelLink,
	calendarLink,
	userId,
}: RsvpConfirmationEmailProps) {
	const unsubscribeUrl = userId
		? `https://sideprojectsaturday.com/unsubscribe/${userId}`
		: undefined;

	return (
		<Html>
			<Head />
			<Preview>
				✅ You're confirmed for Side Project Saturday - {eventDate}!
			</Preview>
			<Body style={main}>
				<Container style={container}>
					<Section style={header}>
						<Heading style={h1}>☀️ Side Project Saturday</Heading>
						<Text style={subtitle}>Brooklyn's Creative Morning Meetup</Text>
					</Section>
					<Section style={content}>
						<div style={confirmationIcon}>✅</div>
						<Heading style={h2}>
							{recipientName
								? `${recipientName}, you're all set!`
								: "You're all set!"}
						</Heading>
						<Text style={text}>
							Your RSVP for this Saturday's Side Project Saturday has been
							confirmed. We can't wait to see what you'll build!
						</Text>

						<Section style={eventDetails}>
							<Text style={detailsHeader}>📅 Event Details</Text>
							<Text style={detailsText}>
								🗓️ <strong>Date:</strong> {eventDate}
								<br />🕘 <strong>Time:</strong> {eventTime}
								<br />📍 <strong>Location:</strong> 325 Gold Street, Brooklyn,
								NY
								<br />🏢 <strong>Floor:</strong> 5th Floor
							</Text>
						</Section>

						{calendarLink && (
							<Section style={buttonContainer}>
								<Button style={button} href={calendarLink}>
									📅 Add to Calendar
								</Button>
							</Section>
						)}

						<Section style={reminders}>
							<Text style={remindersHeader}>🎒 What to Bring</Text>
							<Text style={remindersText}>
								• Your laptop & charger
								<br />• Current project or idea to work on
								<br />• Coffee or your preferred morning beverage
								<br />• Good vibes and willingness to connect!
							</Text>
						</Section>

						<Section style={dayOfInfo}>
							<Text style={dayOfHeader}>📱 Day of the Event</Text>
							<Text style={dayOfText}>
								• We'll send you a reminder email Saturday morning
								<br />• That email will include a link to buzz into the building
								<br />• Doors open at 9 AM sharp!
							</Text>
						</Section>

						<Text style={cantMakeIt}>
							Plans changed? No worries! You can{" "}
							<Link href={cancelLink} style={cancelLinkStyle}>
								cancel your RSVP here
							</Link>
							.
						</Text>
					</Section>
					<Hr style={hr} />
					<Text style={footer}>
						Side Project Saturday - Where Brooklyn builds together 🏗️
					</Text>
					<Text style={hostedBy}>
						Hosted by{" "}
						<Link href="https://just-be.dev" style={hostedByLink}>
							just-be.dev
						</Link>
					</Text>
					{unsubscribeUrl && (
						<Text style={unsubscribeText}>
							Don't want to receive event emails?{" "}
							<Link href={unsubscribeUrl} style={unsubscribeLink}>
								Unsubscribe
							</Link>
						</Text>
					)}
				</Container>
			</Body>
		</Html>
	);
}

const main = {
	backgroundColor: "#fff8e7",
	backgroundImage:
		"linear-gradient(135deg, #fff8e7 0%, #ffeaa7 20%, #ffb347 35%, #87ceeb 60%, #4fc3f7 80%, #0288d1 100%)",
	fontFamily: "system-ui, -apple-system, sans-serif",
	minHeight: "100vh",
};

const container = {
	backdropFilter: "blur(10px)",
	backgroundColor: "rgba(255,255,255,0.95)",
	border: "1px solid rgba(255,255,255,0.3)",
	borderRadius: "12px",
	boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
	margin: "0 auto",
	marginBottom: "0",
	maxWidth: "600px",
	padding: "0",
};

const header = {
	background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
	borderRadius: "12px 12px 0 0",
	padding: "32px 48px",
	textAlign: "center" as const,
};

const h1 = {
	color: "#ffffff",
	fontSize: "32px",
	fontWeight: "800",
	lineHeight: "40px",
	margin: "0 0 8px 0",
	textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
};

const subtitle = {
	color: "#ffffff",
	fontSize: "16px",
	fontWeight: "500",
	margin: "0",
	textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
};

const content = {
	padding: "32px 48px",
};

const confirmationIcon = {
	fontSize: "64px",
	marginBottom: "16px",
	textAlign: "center" as const,
};

const h2 = {
	color: "#1f2937",
	fontSize: "24px",
	fontWeight: "700",
	lineHeight: "32px",
	margin: "0 0 16px 0",
	textAlign: "center" as const,
};

const text = {
	color: "#4b5563",
	fontSize: "16px",
	lineHeight: "26px",
	margin: "0 0 24px 0",
	textAlign: "center" as const,
};

const buttonContainer = {
	margin: "0 0 24px 0",
	textAlign: "center" as const,
};

const button = {
	background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
	borderRadius: "12px",
	boxShadow: "0 6px 20px rgba(16, 185, 129, 0.4)",
	color: "#ffffff",
	display: "inline-block",
	fontSize: "16px",
	fontWeight: "700",
	padding: "14px 28px",
	textDecoration: "none",
};

const eventDetails = {
	backgroundColor: "#fef3c7",
	border: "2px solid #fbbf24",
	borderRadius: "12px",
	margin: "0 0 24px 0",
	padding: "20px",
};

const detailsHeader = {
	color: "#92400e",
	fontSize: "18px",
	fontWeight: "700",
	margin: "0 0 12px 0",
	textAlign: "center" as const,
};

const detailsText = {
	color: "#92400e",
	fontSize: "16px",
	lineHeight: "24px",
	margin: "0",
	textAlign: "left" as const,
};

const reminders = {
	backgroundColor: "#e0f2fe",
	border: "2px solid #0ea5e9",
	borderRadius: "12px",
	margin: "0 0 24px 0",
	padding: "20px",
};

const remindersHeader = {
	color: "#075985",
	fontSize: "18px",
	fontWeight: "700",
	margin: "0 0 12px 0",
	textAlign: "center" as const,
};

const remindersText = {
	color: "#075985",
	fontSize: "16px",
	lineHeight: "24px",
	margin: "0",
	textAlign: "left" as const,
};

const dayOfInfo = {
	backgroundColor: "#f0fdf4",
	border: "2px solid #86efac",
	borderRadius: "12px",
	margin: "0 0 24px 0",
	padding: "20px",
};

const dayOfHeader = {
	color: "#166534",
	fontSize: "18px",
	fontWeight: "700",
	margin: "0 0 12px 0",
	textAlign: "center" as const,
};

const dayOfText = {
	color: "#166534",
	fontSize: "16px",
	lineHeight: "24px",
	margin: "0",
	textAlign: "left" as const,
};

const cantMakeIt = {
	color: "#6b7280",
	fontSize: "14px",
	lineHeight: "20px",
	margin: "0",
	textAlign: "center" as const,
};

const cancelLinkStyle = {
	color: "#ef4444",
	fontWeight: "600",
	textDecoration: "underline",
};

const hr = {
	borderColor: "#fbbf24",
	margin: "32px 48px",
	opacity: 0.3,
};

const footer = {
	color: "#6b7280",
	fontSize: "14px",
	fontWeight: "600",
	lineHeight: "20px",
	margin: "0 0 8px 0",
	padding: "0 48px",
	textAlign: "center" as const,
};

const unsubscribeText = {
	color: "#6b7280",
	fontSize: "12px",
	lineHeight: "18px",
	margin: "0",
	padding: "0 48px 32px 48px",
	textAlign: "center" as const,
};

const unsubscribeLink = {
	color: "#6b7280",
	textDecoration: "underline",
};

const hostedBy = {
	color: "#9ca3af",
	fontSize: "12px",
	lineHeight: "18px",
	margin: "0 0 16px 0",
	padding: "0 48px",
	textAlign: "center" as const,
};

const hostedByLink = {
	color: "#9ca3af",
	textDecoration: "underline",
};
