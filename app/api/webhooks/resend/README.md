# Resend Email Tracking System

This system implements email tracking functionality using Resend webhooks to store email event data (sent, delivered, opened, clicked, etc.) in the Supabase database.

## Features

- Tracks all email events (sent, delivered, opened, clicked, bounced, complained)
- Stores comprehensive event data in the `email_events` table
- Provides an API endpoint for retrieving email statistics

## Setup Instructions

### 1. Create the Email Events Table

Run the SQL script in `email-events.sql` in your Supabase SQL editor to create the necessary table and indexes.

### 2. Configure Resend Webhooks

1. Log in to your [Resend Dashboard](https://resend.com/dashboard)
2. Go to Settings > Webhooks
3. Add a new webhook with the following settings:
   - URL: `https://your-domain.com/api/webhooks/resend`
   - Events: Select all events you want to track (sent, delivered, opened, clicked, etc.)
   - Version: Latest
   - Secret: Generate a secret and store it securely

### 3. Update Environment Variables (Optional)

If you want to verify webhook signatures (recommended for production), add the webhook secret to your environment variables:

```
RESEND_WEBHOOK_SECRET=your_webhook_secret
```

## How It Works

1. When an email is sent through Resend, it includes tracking tags to identify the email type and recipient
2. Resend sends webhook events to our endpoint when the email is sent, delivered, opened, clicked, etc.
3. The webhook handler processes these events and stores them in the database
4. For beta invite emails, it also updates the `beta_invites` table with opened/clicked timestamps

## API Endpoints

### Email Webhook Handler

- **URL**: `/api/webhooks/resend`
- **Method**: POST
- **Description**: Receives and processes webhook events from Resend

### Email Statistics

- **URL**: `/api/email-stats`
- **Method**: GET
- **Query Parameters**:
  - `emailType`: Filter by email type (e.g., "beta_invite", "welcome")
  - `startDate`: Filter events after this date (ISO format)
  - `endDate`: Filter events before this date (ISO format)
- **Description**: Returns email statistics including event counts and rates

## Database Schema

### Email Events Table

```sql
CREATE TABLE IF NOT EXISTS public.email_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email_id TEXT NOT NULL,
  recipient_email TEXT NOT NULL,
  event_type TEXT NOT NULL,
  subject TEXT,
  email_type TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

## Usage Example

To send an email with tracking:

```typescript
await sendEmailWithRetry({
  to: recipientEmail,
  subject: 'Welcome to iTracksy!',
  react: WelcomeEmail({ userFirstName }),
  tags: [
    { name: 'email_type', value: 'welcome' },
    { name: 'recipient_email', value: recipientEmail },
  ],
});
```

To retrieve email statistics:

```typescript
// Get stats for all emails
const response = await fetch('/api/email-stats');
const stats = await response.json();

// Get stats for specific email type
const betaStats = await fetch('/api/email-stats?emailType=beta_invite');
```

download types supabase using https://supabase.com/dashboard/project/onrbhccgncgewwcpvzxs/api?page=tables-intro
