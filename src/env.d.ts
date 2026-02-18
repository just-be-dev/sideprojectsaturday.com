/// <reference types="astro/client" />
/// <reference types="@cloudflare/workers-types" />

import type { eventWorker, worker } from "../alchemy.run";

export type WorkerEnv = worker.Env;
export type WorkflowEnv = eventWorker.Env;

declare module "cloudflare:workers" {
	namespace Cloudflare {
		export interface Env extends WorkerEnv {
			db: PrismaConfig;
		}
	}
}

declare global {
	export interface Env extends WorkerEnv {}
	namespace App {
		interface Locals {
			runtime: {
				env: WorkerEnv;
			};
			user: (import("better-auth").User & { role: "admin" | "user" }) | null;
			session: import("better-auth").Session | null;
		}
	}
}
