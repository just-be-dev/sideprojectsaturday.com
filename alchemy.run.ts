import alchemy from "alchemy";
import {
	Astro,
	D1Database,
	KVNamespace,
	Queue,
	Worker,
	Workflow,
	WranglerJson,
} from "alchemy/cloudflare";
import type { UserEventMessage } from "@/services/user-event-consumer";

const app = await alchemy("sideprojectsaturday", {
	password: process.env.ALCHEMY_SECRET as string,
});

export const db = await D1Database("sps-db", {
	migrationsDir: "prisma/migrations",
});

export const kv = await KVNamespace("sps-kv");

export const userEventQueue = await Queue<UserEventMessage>("sps-user-event");

export const eventWorkflow = new Workflow("event-management", {
	className: "EventManagementWorkflow",
});

export const userEventWorker = await Worker("user-event-worker", {
	bindings: {
		DB: db,
		KV: kv,
		RESEND_API_KEY: alchemy.secret(process.env.RESEND_API_KEY as string),
		RESEND_AUDIENCE_ID: alchemy.secret(
			process.env.RESEND_AUDIENCE_ID as string,
		),
	},
	compatibilityFlags: ["nodejs_compat_v2"],
	entrypoint: "./src/services/user-event-consumer.ts",
	eventSources: [
		{
			queue: userEventQueue,
			settings: {
				batchSize: 1,
				maxConcurrency: 1,
				retryDelay: 15,
			},
		},
	],
});

export const eventWorker = await Worker("event-worker", {
	bindings: {
		BETTER_AUTH_BASE_URL: process.env.PROD_URL as string,
		DB: db,
		EVENT_WORKFLOW: eventWorkflow,
		KV: kv,
		RESEND_API_KEY: alchemy.secret(process.env.RESEND_API_KEY as string),
		RESEND_AUDIENCE_ID: alchemy.secret(
			process.env.RESEND_AUDIENCE_ID as string,
		),
	},
	compatibilityFlags: ["nodejs_compat_v2"],
	crons: ["0 14 * * 1"],
	entrypoint: "./src/services/event-management.tsx", // 2 PM UTC = 9 AM EST / 10 AM EDT on Mondays
});

export const worker = await Astro("sideprojectsaturday", {
	bindings: {
		ADMIN_EMAIL: alchemy.secret(process.env.ADMIN_EMAIL as string),
		BETTER_AUTH_BASE_URL: process.env.PROD_URL as string,
		DB: db,
		KV: kv,
		RESEND_API_KEY: alchemy.secret(process.env.RESEND_API_KEY as string),
		RESEND_AUDIENCE_ID: alchemy.secret(
			process.env.RESEND_AUDIENCE_ID as string,
		),
		SWITCHBOT_DEVICE_ID: alchemy.secret(
			process.env.SWITCHBOT_DEVICE_ID as string,
		),
		SWITCHBOT_KEY: alchemy.secret(process.env.SWITCHBOT_KEY as string),
		SWITCHBOT_TOKEN: alchemy.secret(process.env.SWITCHBOT_TOKEN as string),
		USER_EVENT_QUEUE: userEventQueue,
	},
	command: "astro build",
	compatibilityFlags: [
		"nodejs_compat_v2",
		"nodejs_compat_populate_process_env",
	],
});

await WranglerJson("wrangler.jsonc", {
	transform: {
		wrangler(config) {
			config.queues = {
				consumers: [],
				producers: [
					{
						binding: "USER_EVENT_QUEUE",
						queue: userEventQueue.name,
					},
				],
			};
			return config;
		},
	},
	worker,
});

console.log({
	url: worker.url,
});

await app.finalize();
