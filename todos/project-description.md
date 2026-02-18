# Project: Side Project Saturday

A web application for managing weekly Saturday morning meetups (9am-12pm) for builders, creators, and dreamers in Brooklyn, NY. Features automated event management, magic link authentication, RSVP system, email automation, and IoT door control integration.

## Features

- **Automated Event Management**: Weekly events automatically created, announced, and managed through Cloudflare Workflows
- **Smart Door Access System**: SwitchBot integration for remote building door control during active events  
- **Magic Link Authentication**: Passwordless authentication with better-auth and secure session management
- **RSVP System**: Event registration with confirmation emails and real-time attendee tracking
- **Email Automation**: Event invitations, reminders, confirmations, and welcome emails via Resend
- **Admin Dashboard**: Complete event and user management interface with bulk operations
- **Subscription Management**: Email notification preferences with Resend audience sync
- **Physical-Digital Integration**: IoT building access control tied to event status

## Tech Stack

- **Framework**: Astro v5 with SSR on Cloudflare Workers edge runtime
- **Frontend**: React v19, Tailwind CSS v4, DaisyUI
- **Database**: SQLite via Cloudflare D1 with Prisma ORM
- **Authentication**: better-auth with magic link system
- **Email**: Resend API with React Email templates
- **Cloud**: Cloudflare Workers, D1, KV, Queues, Workflows
- **Deployment**: Alchemy deployment system
- **Tools**: mise (task runner), bun, TypeScript, Biome (linting/formatting)
- **IoT**: SwitchBot API for door control

## Structure

- `src/pages/` - File-based routing with admin dashboard at `/admin`
- `src/components/` - Reusable Astro components (RSVP components in `/rsvp/`)
- `src/actions/` - Astro server actions for form handling and mutations
- `src/emails/` - React Email templates for all communications
- `src/services/` - Background workers and Cloudflare Workflows
- `src/lib/` - Core utilities and authentication configuration
- `prisma/` - Database schema and D1 migrations

## Architecture

- **Edge-First**: Everything runs on Cloudflare Workers globally
- **Event-Driven**: Workflows automate weekly event lifecycle
- **Serverless**: Multi-worker architecture with queues for async processing
- **Type-Safe**: Full TypeScript with Prisma ORM
- **Real-time**: HTMX for seamless user interactions

## Commands

- **Dev**: `mise dev` (localhost:4433)
- **Build**: `mise build`
- **Typecheck**: `mise typecheck`
- **Format**: `mise fmt`
- **Database**: `mise migrate:dev` (local), `mise migrate:prod` (production)
- **Email Preview**: `mise emails`
- **Deploy**: `mise deploy`
- **Logs**: `mise logs`

## Testing

Currently no automated testing framework configured. Testing is manual through:
- Development server preview
- Email template preview via react-email
- Production deployment testing
- Admin dashboard functionality verification

## Editor

- Open folder: `zed`