# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Side Project Saturday - A web application for managing weekly side project meetups in Brooklyn, NY. Built with Astro SSR on Cloudflare Workers edge runtime.

## Essential Commands

```bash
# Development
mise dev                    # Start development server at localhost:4433
mise build                  # Build for production
mise preview               # Preview production build locally
mise fmt                   # Format code with Biome

# Email Development
mise emails                # Preview email templates with react-email

# Database
mise migrate:create migration_name  # Create new migration
mise migrate:dev           # Apply migrations locally
mise migrate:prod          # Apply migrations to production
mise gen:better-auth       # Generate better-auth types

# Deployment
mise deploy                # Deploy to Cloudflare via Alchemy
mise destroy               # Destroy Cloudflare resources
mise logs                  # View production logs
mise open:deployment       # Open Cloudflare dashboard
```

## Architecture Overview

### Technology Stack
- **Framework**: Astro with SSR enabled for Cloudflare Workers
- **Styling**: Tailwind CSS v4 (new Vite plugin) + DaisyUI
- **Auth**: better-auth with magic link authentication (passwordless)
- **Database**: SQLite via Cloudflare D1 with Prisma ORM
- **Email**: Resend for sending emails
- **Email Templates**: React Email with custom branded templates
- **React**: v19 (using latest React features)
- **Automation**: Cloudflare Workflows & Queues for event management
- **IoT**: SwitchBot API for physical door control
- **Deployment**: Alchemy deployment system
- **Tooling**: mise for task management, Biome for formatting, TypeScript

### Key Architectural Decisions

1. **Edge-First Architecture**: Everything runs on Cloudflare Workers edge runtime. Database access uses Prisma's D1 adapter for edge compatibility.

2. **Event-Driven Architecture**:
   - Cloudflare Workflows manage the event lifecycle automatically
   - Cloudflare Queues handle async user event processing
   - Cron jobs trigger weekly event management tasks

3. **Authentication Flow**:
   - Magic link only (no passwords)
   - Server actions in `src/actions/index.ts` handle auth mutations
   - Auth state managed via middleware in `src/middleware.ts`
   - Sessions stored in D1 database

4. **Server-Side Rendering**: Astro configured with `output: 'server'` and Cloudflare adapter. All pages are SSR'd at the edge.

5. **Form Handling**: Uses Astro Actions (server-side form handlers) for mutations. Actions are defined in `src/actions/` and called from components.

6. **Physical-Digital Integration**: SwitchBot API integration enables remote door control during active events.

### Database Schema

The app uses Prisma with these main tables:
- `user`: Core user data with `subscribed` and `rsvped` boolean fields
- `session`: Active user sessions
- `account`: OAuth provider accounts (for future expansion)
- `verification`: Magic link verification tokens
- `event`: Scheduled events with:
  - `id`, `eventDate`, `status` (scheduled/inprogress/canceled/completed)
  - `createdAt`, `updatedAt`
- `break`: Scheduled breaks with:
  - `id`, `startDate`, `endDate`, `reason`
  - `createdAt`, `updatedAt`

Database migrations are managed by Prisma but require manual SQL application to D1.

### Development Workflow

1. **Environment Variables**:
   - `AUTH_SECRET`: Authentication secret
   - `RESEND_API_KEY`: Resend API key
   - `RESEND_AUDIENCE_ID`: Resend audience for broadcasts
   - `SWITCHBOT_TOKEN`, `SWITCHBOT_KEY`, `SWITCHBOT_DEVICE_ID`: Door control
   - `ADMIN_EMAIL`: Admin notifications
   - `DB`: D1 database binding
2. **Code Style**: Biome enforces tabs, double quotes, and consistent formatting
3. **No Test Framework**: Currently no automated testing setup

### Important Patterns

- **Auth Check Pattern**: Use `Astro.locals.user` in pages/components to check auth state
- **Server Actions**: All mutations go through actions in `src/actions/`
- **Database Access**: Always use Prisma client from `src/lib/auth.ts` which is configured for D1
- **Email Templates**: Templates in `src/emails/`:
  - `MagicLinkEmail.tsx`: Authentication magic links
  - `VerificationEmail.tsx`: New user email verification
  - `EventInviteEmail.tsx`: Event invitation emails
  - `EventTodayEmail.tsx`: Morning-of event reminders
  - `RsvpConfirmationEmail.tsx`: RSVP confirmation
  - `WelcomeEmail.tsx`: Welcome message for new users
- **Admin Protection**: Admin routes check `user.role === 'admin'` before allowing access
- **Event Status Checks**: Door buzzer and other event features check `event.status === 'inprogress'`

## Deployment

The app deploys to Cloudflare using Alchemy deployment system configured in `alchemy.run.ts`:

### Resources
- **D1 Database**: `sps-db` with automatic migrations from `prisma/migrations`
- **KV Namespace**: `sps-kv` for caching and temporary storage
- **Queue**: `sps-user-event` for async user event processing
- **Workflow**: `event-management` for event scheduling automation

### Workers
1. **Main Worker** (Astro SSR):
   - Handles all web traffic and API endpoints
   - Bindings: DB, KV, all env vars, USER_EVENT_QUEUE
   - Uses `nodejs_compat_v2` for React Email support

2. **User Event Worker**:
   - Processes user events from queue asynchronously
   - Handles Resend audience sync and user updates
   - Bindings: DB, KV, RESEND_API_KEY

3. **Event Worker**:
   - Manages event scheduling via workflows
   - Runs on cron: "0 14 * * 1" (Mondays at 9 AM EST/10 AM EDT)
   - Creates weekly events and manages their lifecycle

### Edge Compatibility
- React DOM configured to use `react-dom/server.edge` in production
- All workers use `nodejs_compat_v2` compatibility flag

## Development Notes

1. **React v19 + Edge Runtime**: Uses `react-dom/server.edge` alias in `astro.config.mjs` to prevent MessageChannel errors
2. **TypeScript Configuration**: JSX configured with `"jsx": "react-jsx"` to avoid explicit React imports
3. **Email Development**: Use `mise emails` to preview templates during development
4. **Database Changes**: Always create migrations with `mise migrate:create` and apply with `mise migrate:dev`
5. **Authentication**: All auth flows go through better-auth magic links - no password authentication
6. **Styling**: Uses Tailwind v4 with the new Vite plugin for improved performance
7. **Event Management**: Events are automatically managed by workflows - no manual intervention needed
8. **Door Access**: Test door buzzer functionality during active events only (status = 'inprogress')

## Code Organization and Best Practices

- **Import Paths**: Prefer prefixing esm import paths with `@` which points to the src directory instead of deeply nested relative imports. So `@/lib/auth` instead of `../../lib/auth`
- **Component Organization**: RSVP-related components go in `src/components/rsvp/`
- **API Routes**: Admin API endpoints go in `src/pages/api/admin/`
- **Service Layer**: Workflows and queue handlers go in `src/services/`

## Utility Patterns

- **Date Calculations**: If you need to calculate a date, add that logic in @src/lib/date-utils.ts. Make sure you check it first to see if what you need already exists.
- **Admin Checks**: Always verify `user.role === 'admin'` for admin features
- **Event Status**: Check `event.status` for feature availability (e.g., door buzzer)

## Package Management Notes

- **Package Installation**: Use bun to install dependencies

## Feature-Specific Implementation Details

### Event Management Workflow
The `EventManagementWorkflow` in `src/services/event-management-workflow.ts` handles:
1. **Monday**: Creates new event for upcoming Saturday
2. **Wednesday**: Sends invitations via Resend broadcast
3. **Saturday 7AM**: Sends "event today" reminders
4. **Saturday 9AM**: Marks event as in-progress, unlocks door
5. **Saturday 12PM**: Completes event, locks door, resets RSVPs

### Door Buzzer Integration
- Endpoint: `/api/buzz`
- Page: `/buzz`
- Only works during active events (status = 'inprogress')
- Uses SwitchBot API to remotely unlock building door
- 30-second unlock duration with visual countdown

### User Event Queue
- Queue name: `sps-user-event`
- Handles async processing of user updates
- Syncs users with Resend audience for email broadcasts
- Processes subscription status changes

### Admin Dashboard Features
- Event scheduling, rescheduling, and cancellation
- Break scheduling for holiday periods
- User management with role updates
- Bulk user import functionality
- Real-time RSVP tracking
