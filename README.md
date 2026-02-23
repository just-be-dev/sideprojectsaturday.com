# Side Project Saturday

The site for Side Project Saturday, a weekly meetup for builders in Brooklyn.

## About

Side Project Saturday is a weekly Saturday morning meetup (9am-12pm) where builders, creators, and dreamers gather in Brooklyn to work on their side projects. This application handles event registration, user authentication, automated event management, physical door access, and communication for the community.

### Key Features

- **Automated Event Management**: Weekly events are automatically created, announced, and managed through Cloudflare Workflows
- **Smart Door Access**: Integrated door buzzer system allows authenticated users to remotely unlock the building during active events
- **Magic Link Authentication**: Passwordless authentication for a seamless user experience
- **RSVP System**: Users can RSVP for events and receive confirmation emails
- **Admin Dashboard**: Complete event and user management interface
- **Email Automation**: Automated event invitations, reminders, and confirmations

## Tech Stack

- **Framework**: Astro v5 with SSR enabled for Cloudflare Workers
- **Styling**: Tailwind CSS v4 + DaisyUI v5
- **Auth**: better-auth with magic link authentication (passwordless)
- **Database**: SQLite via Cloudflare D1 with Prisma ORM
- **Email**: Resend API with React Email templates
- **Automation**: Cloudflare Workflows & Queues for event management
- **IoT Integration**: SwitchBot API for physical door control
- **Deployment**: Alchemy deployment system on Cloudflare

## Getting Started

This project uses [mise](https://mise.jdx.dev/) for task management and tooling. All commands should be run using mise tasks.

### Prerequisites

1. Install [mise](https://mise.jdx.dev/getting-started.html)
2. Clone this repository
3. Run `mise install` to install required tools

### Environment Variables

Create a `.env` file with:

```
RESEND_API_KEY=your_resend_api_key
RESEND_AUDIENCE_ID=your_resend_audience_id
AUTH_SECRET=your_auth_secret
BETTER_AUTH_BASE_URL=http://localhost:4433  # for development
PROD_URL=https://your-production-url.com    # for production
SWITCHBOT_TOKEN=your_switchbot_token        # for door buzzer
SWITCHBOT_KEY=your_switchbot_key
SWITCHBOT_DEVICE_ID=your_device_id
ADMIN_EMAIL=admin@example.com               # for admin notifications
```

### Development Commands

| Command        | Description                                  |
| -------------- | -------------------------------------------- |
| `mise dev`     | Start development server at `localhost:4433` |
| `mise build`   | Build for production                         |
| `mise preview` | Preview production build locally             |
| `mise fmt`     | Format code with Biome                       |
| `mise emails`  | Preview email templates                      |

### Database Commands

| Command                              | Description                             |
| ------------------------------------ | --------------------------------------- |
| `mise migrate:create your_migration` | Create new database migration           |
| `mise migrate:dev`                   | Apply migrations to local database      |
| `mise migrate:prod`                  | Apply migrations to production database |
| `mise gen:better-auth`               | Generate better-auth types              |

### Deployment Commands

| Command                | Description                  |
| ---------------------- | ---------------------------- |
| `mise deploy`          | Deploy to Cloudflare         |
| `mise destroy`         | Destroy Cloudflare resources |
| `mise logs`            | View production logs         |
| `mise open:deployment` | Open Cloudflare dashboard    |

## Project Structure

```
/
├── prisma/                 # Database schema and migrations
├── public/                 # Static assets
├── src/
│   ├── actions/           # Server-side form handlers
│   ├── components/        # Reusable UI components
│   │   └── rsvp/         # RSVP-related components
│   ├── emails/            # React Email templates
│   ├── lib/               # Utilities and configuration
│   ├── pages/             # Astro pages and API routes
│   │   ├── admin/        # Admin dashboard pages
│   │   ├── api/          # API endpoints
│   │   │   └── admin/    # Admin API endpoints
│   │   └── rsvp/         # RSVP pages
│   ├── services/          # Workflows and queue handlers
│   └── middleware.ts      # Authentication middleware
├── alchemy.run.ts         # Deployment configuration
└── mise.toml             # Task runner configuration
```

## Contributing

### Making Changes

1. Create a new branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Format code: `mise fmt`
4. Test locally: `mise dev`
5. Commit your changes
6. Push and create a pull request

### Database Changes

1. Update `prisma/schema.prisma`
2. Create migration: `mise migrate:create describe_your_change`
3. Apply locally: `mise migrate:dev`
4. Test your changes
5. Commit both schema and migration files

### Email Template Development

1. Edit templates in `src/emails/`
2. Preview changes: `mise emails`
3. Test with real email: use the magic link flow in development

### Features Guide

#### Authentication

The app uses passwordless authentication via magic links:

- Users enter their email at `/login`
- Magic link is sent via Resend
- Clicking the link signs them in
- New users are automatically registered

#### Event Management

Events are automatically managed through Cloudflare Workflows:

- **Monday**: New event created for upcoming Saturday
- **Wednesday**: Event invitations sent to all subscribed users
- **Saturday 7AM**: "Event today" reminders sent to RSVPd users
- **Saturday 9AM**: Event marked as in-progress, door unlocked
- **Saturday 12PM**: Event completed, door locked, RSVPs reset

#### Door Access

Authenticated users can remotely unlock the building door:

- Navigate to `/buzz` during an active event
- Click the buzz button to unlock the door
- Door remains unlocked for 30 seconds
- Only works when event status is "inprogress"

#### Admin Features

Admins have access to a full management dashboard at `/admin`:

- View and manage all users
- Schedule, reschedule, or cancel events
- Schedule breaks (no events during specified periods)
- Import users in bulk
- View RSVPd users for each event
- Update user roles and subscription status

### Deployment

Deployment is handled by Alchemy and targets Cloudflare:

- `mise deploy` deploys the current code
- Database migrations must be run separately: `mise migrate:prod`
- Environment variables are managed in Cloudflare dashboard

## Architecture Notes

- **Edge-First**: Everything runs on Cloudflare Workers
- **SSR**: All pages are server-side rendered
- **Event-Driven**: Uses Cloudflare Workflows & Queues for automation
- **Magic Links Only**: No passwords, just email-based authentication
- **D1 Database**: SQLite database running on Cloudflare's edge
- **Email Integration**: Resend handles all email delivery with React Email templates
- **Physical-Digital Bridge**: SwitchBot API integration for door control
- **Async Processing**: User events processed through Cloudflare Queues

### Database Schema

The application uses these main database tables:

- **user**: Core user data with subscription and RSVP status
- **session**: Active user sessions for authentication
- **account**: OAuth provider accounts (for future expansion)
- **verification**: Magic link verification tokens
- **event**: Scheduled events with status tracking
- **break**: Scheduled breaks when no events occur

## Need Help?

- Check the [CLAUDE.md](./CLAUDE.md) file for detailed project guidance
- Review the mise tasks: `mise tasks`
- Check Astro docs: [astro.build](https://astro.build)
- Review better-auth docs: [better-auth.com](https://better-auth.com)
