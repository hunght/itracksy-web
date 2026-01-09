-- Add replied_at column to feedback table (if not exists)
ALTER TABLE feedback ADD COLUMN IF NOT EXISTS replied_at TIMESTAMP WITH TIME ZONE;

-- Create email_threads table for storing email conversations
CREATE TABLE IF NOT EXISTS email_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Email metadata
  message_id TEXT UNIQUE,  -- Resend message ID or email Message-ID header
  from_email TEXT NOT NULL,
  from_name TEXT,
  to_email TEXT NOT NULL,
  subject TEXT,

  -- Email content
  body_text TEXT,
  body_html TEXT,

  -- Threading
  in_reply_to TEXT,  -- Message-ID of the email this is replying to
  "references" TEXT,   -- Full references header for threading

  -- Link to feedback
  feedback_id UUID REFERENCES feedback(id) ON DELETE SET NULL,

  -- Direction: 'inbound' (from user) or 'outbound' (from admin)
  direction TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')),

  -- Status
  is_read BOOLEAN DEFAULT FALSE,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  received_at TIMESTAMP WITH TIME ZONE  -- When Resend received it (for inbound)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_email_threads_feedback_id ON email_threads(feedback_id);
CREATE INDEX IF NOT EXISTS idx_email_threads_from_email ON email_threads(from_email);
CREATE INDEX IF NOT EXISTS idx_email_threads_created_at ON email_threads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_email_threads_direction ON email_threads(direction);
CREATE INDEX IF NOT EXISTS idx_email_threads_is_read ON email_threads(is_read);

-- Create a view for unread inbound emails count
CREATE OR REPLACE VIEW unread_emails_count AS
SELECT COUNT(*) as count
FROM email_threads
WHERE direction = 'inbound' AND is_read = FALSE;
