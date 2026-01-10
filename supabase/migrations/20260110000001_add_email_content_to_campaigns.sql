-- Add email_content column to marketing_campaigns for storing markdown email content
ALTER TABLE marketing_campaigns ADD COLUMN IF NOT EXISTS email_content TEXT;
