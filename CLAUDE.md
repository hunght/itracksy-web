# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Overview

iTracksy Web is a Next.js marketing website and admin dashboard for the iTracksy productivity app. It includes:

- Marketing pages (landing, pricing, download, blog)
- Admin dashboard for managing leads, campaigns, and inbox
- Email campaign management with Resend integration
- Feedback collection and email threading

## Development Commands

```bash
# Development
npm run dev              # Start Next.js dev server (port 3000)
npm run dev-email        # Start React Email preview (port 3001)

# Build
npm run build            # Production build
npm run start            # Start production server

# Linting
npm run lint             # Run ESLint
npm run knip             # Find unused dependencies/exports

# Supabase (requires SUPABASE_ACCESS_TOKEN in .env.local)
npm run supabase:types   # Generate TypeScript types from schema
npm run supabase:push    # Push local migrations to remote database
npm run supabase:pull    # Pull remote schema changes
npm run supabase:sync    # Pull schema + regenerate types
npm run supabase:link    # Link to remote Supabase project
npm run supabase:start   # Start local Supabase
npm run supabase:reset   # Reset local database
```

## Supabase Configuration

### Access Token Setup

The project uses a Supabase access token stored in `.env.local`:

```env
SUPABASE_ACCESS_TOKEN=sbp_xxxxx...
```

This token is required for:

- Pushing migrations to remote database
- Generating TypeScript types from remote schema
- Linking to the Supabase project

### Project Details

- **Project ID**: `onrbhccgncgewwcpvzxs`
- **Types output**: `lib/supabase.ts`

### Running Supabase Commands

Always source the token script before running Supabase CLI commands directly:

```bash
# Option 1: Use npm scripts (recommended)
npm run supabase:push    # Automatically loads token

# Option 2: Manual commands
source ./set_supabase_token.sh
supabase db push --linked
```

### Migration Workflow

1. Create migration file in `supabase/migrations/` with timestamp prefix:

   ```
   YYYYMMDDHHMMSS_description.sql
   # Example: 20260110000000_add_column.sql
   ```

2. Push to remote:

   ```bash
   npm run supabase:push
   ```

3. Regenerate types:

   ```bash
   npm run supabase:types
   ```

4. If migration version mismatch error:
   ```bash
   source ./set_supabase_token.sh
   supabase migration repair --status reverted <version>
   ```

## Architecture

### Tech Stack

- **Framework**: Next.js 16 with Turbopack
- **Database**: Supabase (PostgreSQL)
- **Email**: Resend (sending + inbound webhooks)
- **Styling**: Tailwind CSS + shadcn/ui
- **State**: React Query + Jotai

### Key Directories

```
app/
├── admin/              # Admin dashboard pages
│   ├── inbox/          # Unified email inbox
│   ├── leads/          # Lead management
│   └── marketing-campaigns/  # Campaign management
├── api/                # API routes
│   ├── feedback/       # Feedback submission + replies
│   ├── send-campaign/  # Campaign email sending
│   └── webhooks/       # Resend webhooks (inbound email)
├── (marketing)/        # Public marketing pages
lib/
├── supabase.ts         # Generated Supabase types
├── supabase/           # Supabase client utilities
supabase/
├── migrations/         # SQL migration files
emails/                 # React Email templates
```

### Database Tables

| Table                 | Description                 |
| --------------------- | --------------------------- |
| `leads`               | Contact form submissions    |
| `feedback`            | User feedback submissions   |
| `email_threads`       | Email conversation history  |
| `marketing_campaigns` | Campaign definitions        |
| `campaign_leads`      | Campaign-lead relationships |

### Email Threading

Inbound emails are processed via Resend webhook (`/api/webhooks/inbound-email`):

- Links to feedback via email matching
- Links to campaigns via lead lookup
- Groups conversations by email + normalized subject

## Code Style

- Use TypeScript with strict typing
- Prefer functional components with hooks
- Use React Query for data fetching
- Use shadcn/ui components from `@/components/ui/`
- Path alias: `@/` maps to project root
