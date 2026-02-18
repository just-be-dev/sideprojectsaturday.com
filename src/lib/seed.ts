import type { PrismaClient } from "@generated/prisma/client";

export const seedUsers = [
	{
		email: "admin@example.com",
		emailVerified: true,
		name: "Admin User",
		role: "admin",
		rsvped: false,
		subscribed: true,
	},
	{
		email: "user1@example.com",
		emailVerified: true,
		name: "John Doe",
		rsvped: true,
		subscribed: true,
	},
	{
		email: "user2@example.com",
		emailVerified: true,
		name: "Jane Smith",
		rsvped: false,
		subscribed: true,
	},
	{
		email: "user3@example.com",
		emailVerified: true,
		name: "Bob Wilson",
		rsvped: false,
		subscribed: false,
	},
	{
		banReason: "Inappropriate behavior",
		banned: true,
		email: "banned@example.com",
		emailVerified: true,
		name: "Banned User",
		rsvped: false,
		subscribed: false,
	},
];

export async function seedDevelopmentData(client: PrismaClient) {
	try {
		console.log("🌱 Seeding development users...");

		for (const userData of seedUsers) {
			const existingUser = await client.user.findUnique({
				where: { email: userData.email },
			});

			if (existingUser) {
				continue;
			}

			const user = await client.user.create({
				data: userData,
			});

			console.log(`  ✅ Created user: ${user.email} (${user.name})`);
		}

		console.log("🎉 Development seeding completed!");
	} catch (error) {
		console.error("Development seeding failed:", error);
		// Don't fail the app, just log the error
	}
}
