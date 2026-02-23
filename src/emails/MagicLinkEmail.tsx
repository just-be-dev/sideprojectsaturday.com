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

interface MagicLinkEmailProps {
	magicLink: string;
}

export default function MagicLinkEmail({ magicLink }: MagicLinkEmailProps) {
	return (
		<Html>
			<Head />
			<Preview>☀️ Your magic link for Side Project Saturday is here!</Preview>
			<Body style={main}>
				<Container style={container}>
					<Section style={header}>
						<Heading style={h1}>☀️ Side Project Saturday</Heading>
						<Text style={subtitle}>Brooklyn's Creative Morning Meetup</Text>
					</Section>
					<Section style={content}>
						<Heading style={h2}>Ready to build something awesome?</Heading>
						<Text style={text}>
							Your magic link is here! Click below to join our Saturday morning
							community of builders, creators, and dreamers in Brooklyn.
						</Text>
						<Section style={buttonContainer}>
							<Button style={button} href={magicLink}>
								🚀 Join Side Project Saturday
							</Button>
						</Section>
						<Section style={eventDetails}>
							<Text style={detailsHeader}>📅 Next Meetup Details</Text>
							<Text style={detailsText}>
								🕘 <strong>Time:</strong> 9:00 AM - 12:00 PM
								<br />📍 <strong>Location:</strong> 325 Gold Street, Brooklyn,
								NY
								<br />💻 <strong>Bring:</strong> Your laptop, ideas & good
								vibes!
							</Text>
						</Section>
						<Text style={expiry}>
							⏰ This magic link expires in 5 minutes for security.
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

const buttonContainer = {
	margin: "0 0 32px 0",
	textAlign: "center" as const,
};

const button = {
	background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
	borderRadius: "12px",
	boxShadow: "0 6px 20px rgba(251, 191, 36, 0.4)",
	color: "#ffffff",
	display: "inline-block",
	fontSize: "18px",
	fontWeight: "700",
	padding: "16px 32px",
	textDecoration: "none",
	transition: "all 0.3s ease",
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
	textAlign: "center" as const,
};

const expiry = {
	backgroundColor: "#fee2e2",
	border: "1px solid #fca5a5",
	borderRadius: "8px",
	color: "#991b1b",
	fontSize: "14px",
	margin: "0",
	padding: "12px",
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
