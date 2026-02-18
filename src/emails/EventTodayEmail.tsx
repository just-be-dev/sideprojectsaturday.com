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

interface EventTodayEmailProps {
	recipientName?: string;
	eventTime: string;
	eventLocation: string;
	buzzInLink: string;
	cancelLink: string;
	userId?: string;
}

export default function EventTodayEmail({
	recipientName,
	eventTime,
	eventLocation,
	buzzInLink,
	cancelLink,
	userId,
}: EventTodayEmailProps) {
	const unsubscribeUrl = userId
		? `https://sideprojectsaturday.com/unsubscribe/${userId}`
		: undefined;
	return (
		<Html>
			<Head />
			<Preview>🚀 Side Project Saturday is TODAY! See you soon!</Preview>
			<Body style={main}>
				<Container style={container}>
					<Section style={header}>
						<Heading style={h1}>☀️ Side Project Saturday</Heading>
						<Text style={subtitle}>Brooklyn's Creative Morning Meetup</Text>
					</Section>
					<Section style={content}>
						<Heading style={h2}>
							{recipientName
								? `${recipientName}, it's happening TODAY!`
								: "It's happening TODAY!"}
						</Heading>
						<Text style={text}>
							Can't wait to see you this morning! Here's what you need to know:
						</Text>

						<Section style={todayDetails}>
							<Text style={todayHeader}>🎉 TODAY'S MEETUP</Text>
							<Text style={todayText}>
								🕘 <strong>Time:</strong> {eventTime}
								<br />📍 <strong>Location:</strong> {eventLocation}
								<br />🚪 <strong>Getting in:</strong> Use the buzz-in link below
								<br />💻 <strong>Don't forget:</strong> Your laptop & charger!
							</Text>
						</Section>

						<Section style={buttonContainer}>
							<Button style={button} href={buzzInLink}>
								🚪 Buzz Me In!
							</Button>
						</Section>

						<Section style={arrivalInfo}>
							<Text style={arrivalHeader}>📱 Arrival Instructions</Text>
							<Text style={arrivalText}>
								When you arrive at the building, click the "Buzz Me In" button
								above from your phone to unlock the door (if that doesn't work,
								press the buzzer by the door for 503). We're on the{" "}
								<strong>5th floor</strong> - you can take the stairs or
								elevator.
								<br />
								<br />☕ <strong>Coffee tip:</strong> Stop by{" "}
								<Link
									href="https://maps.app.goo.gl/LV5ikTZKLBmMrm9r8"
									style={coffeeLink}
								>
									Compilation Coffee
								</Link>{" "}
								on the corner before coming up - they make excellent coffee and
								it's a great way to caffeinate before the session!
							</Text>
						</Section>

						<Section style={cancelSection}>
							<Text style={cancelHeader}>Can't make it after all?</Text>
							<Text style={cancelText}>
								Plans change, we get it! If you can't join us today, please
								cancel your RSVP so we can update our headcount.
							</Text>
							<Link href={cancelLink} style={cancelLinkStyles}>
								Cancel my RSVP
							</Link>
						</Section>

						<Text style={seeYouSoon}>
							☕ See you in a few hours! Can't wait to see what you'll build!
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

const todayDetails = {
	backgroundColor: "#fef3c7",
	border: "2px solid #f59e0b",
	borderRadius: "12px",
	margin: "0 0 24px 0",
	padding: "20px",
};

const todayHeader = {
	color: "#92400e",
	fontSize: "18px",
	fontWeight: "700",
	margin: "0 0 12px 0",
	textAlign: "center" as const,
};

const todayText = {
	color: "#92400e",
	fontSize: "16px",
	lineHeight: "24px",
	margin: "0",
	textAlign: "left" as const,
};

const buttonContainer = {
	margin: "0 0 32px 0",
	textAlign: "center" as const,
};

const button = {
	background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
	borderRadius: "12px",
	boxShadow: "0 6px 20px rgba(16, 185, 129, 0.4)",
	color: "#ffffff",
	cursor: "pointer",
	display: "inline-block",
	fontSize: "18px",
	fontWeight: "700",
	padding: "16px 32px",
	textDecoration: "none",
	transition: "all 0.3s ease",
};

const arrivalInfo = {
	backgroundColor: "#e0f2fe",
	border: "2px solid #0ea5e9",
	borderRadius: "12px",
	margin: "0 0 24px 0",
	padding: "20px",
};

const arrivalHeader = {
	color: "#075985",
	fontSize: "18px",
	fontWeight: "700",
	margin: "0 0 12px 0",
	textAlign: "center" as const,
};

const arrivalText = {
	color: "#075985",
	fontSize: "16px",
	lineHeight: "24px",
	margin: "0",
	textAlign: "center" as const,
};

const cancelSection = {
	backgroundColor: "#f3f4f6",
	border: "1px solid #d1d5db",
	borderRadius: "12px",
	margin: "0 0 24px 0",
	padding: "20px",
	textAlign: "center" as const,
};

const cancelHeader = {
	color: "#374151",
	fontSize: "16px",
	fontWeight: "700",
	margin: "0 0 8px 0",
};

const cancelText = {
	color: "#6b7280",
	fontSize: "14px",
	lineHeight: "20px",
	margin: "0 0 12px 0",
};

const cancelLinkStyles = {
	color: "#ef4444",
	cursor: "pointer",
	fontSize: "14px",
	fontWeight: "600",
	textDecoration: "underline",
};

const seeYouSoon = {
	backgroundColor: "#f0fdf4",
	border: "1px solid #86efac",
	borderRadius: "8px",
	color: "#166534",
	fontSize: "16px",
	fontWeight: "600",
	margin: "0",
	padding: "16px",
	textAlign: "center" as const,
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

const coffeeLink = {
	color: "#0ea5e9",
	fontWeight: "600",
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
