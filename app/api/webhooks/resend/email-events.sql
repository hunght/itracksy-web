-- SQL script to create email_events table in Supabase
-- Run this in the Supabase SQL editor to create the table

-- Create email_events table to store all email tracking events
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

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS email_events_recipient_email_idx ON public.email_events (recipient_email);
CREATE INDEX IF NOT EXISTS email_events_event_type_idx ON public.email_events (event_type);
CREATE INDEX IF NOT EXISTS email_events_email_type_idx ON public.email_events (email_type);

-- Add RLS policies
ALTER TABLE public.email_events ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view their own email events
CREATE POLICY "Users can view their own email events" 
  ON public.email_events 
  FOR SELECT 
  USING (auth.uid()::text = recipient_email);

-- Allow service role to insert and update records
CREATE POLICY "Service role can manage all email events" 
  ON public.email_events 
  FOR ALL 
  TO service_role 
  USING (true);

-- Comment on table and columns
COMMENT ON TABLE public.email_events IS 'Stores email tracking events from Resend webhooks';
COMMENT ON COLUMN public.email_events.email_id IS 'Unique ID of the email from Resend';
COMMENT ON COLUMN public.email_events.recipient_email IS 'Email address of the recipient';
COMMENT ON COLUMN public.email_events.event_type IS 'Type of event (sent, delivered, opened, clicked, bounced, etc.)';
COMMENT ON COLUMN public.email_events.subject IS 'Subject of the email';
COMMENT ON COLUMN public.email_events.email_type IS 'Type of email (welcome, beta_invite, etc.)';
COMMENT ON COLUMN public.email_events.metadata IS 'Additional metadata about the event (click URL, user agent, etc.)';
