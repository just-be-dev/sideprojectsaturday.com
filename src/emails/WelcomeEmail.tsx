import {
	Body,
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

interface WelcomeEmailProps {
	username: string;
	userId?: string;
}

export default function WelcomeEmail({ username, userId }: WelcomeEmailProps) {
	const unsubscribeUrl = userId
		? `https://sideprojectsaturday.com/unsubscribe/${userId}`
		: undefined;
	return (
		<Html>
			<Head />
			<Preview>🎉 Welcome to Side Project Saturday!</Preview>
			<Body style={main}>
				<Container style={container}>
					<Section style={header}>
						<Heading style={h1}>☀️ Side Project Saturday</Heading>
						<Text style={subtitle}>Brooklyn's Creative Morning Meetup</Text>
					</Section>
					<Section style={content}>
						<Heading style={h2}>Welcome to the community, {username}!</Heading>
						<Text style={text}>
							We're thrilled to have you join our Saturday morning community of
							builders, creators, and dreamers in Brooklyn. You're now part of
							something special!
						</Text>
						<Section style={scheduleDetails}>
							<Text style={detailsHeader}>📅 How It Works</Text>
							<Text style={detailsText}>
								🗓️ <strong>When:</strong> Saturdays from 9:00 AM - 12:00 PM
								<br />📧 <strong>Invites:</strong> Event invites go out the
								Wednesday before
								<br />💻 <strong>What to bring:</strong> Your laptop, ideas &
								good vibes!
								<br />🤝 <strong>What to expect:</strong> A welcoming space to
								work on your projects alongside fellow creators
							</Text>
						</Section>
						<Text style={nextSteps}>
							🚀 <strong>What's next?</strong> Keep an eye on your inbox for our
							next event invite! We'll let you know all the details including
							the exact date and location.
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
					<Text style={unsubscribeText}>
						{unsubscribeUrl ? (
							<>
								You can update your preferences or{" "}
								<Link href={unsubscribeUrl} style={unsubscribeLink}>
									unsubscribe
								</Link>{" "}
								anytime.
							</>
						) : (
							"You can update your preferences or unsubscribe anytime from your dashboard."
						)}
					</Text>
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

const scheduleDetails = {
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

const nextSteps = {
	backgroundColor: "#dcfce7",
	border: "2px solid #16a34a",
	borderRadius: "12px",
	color: "#166534",
	fontSize: "16px",
	lineHeight: "24px",
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
