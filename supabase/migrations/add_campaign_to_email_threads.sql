-- Add campaign_id and lead_id columns to email_threads for tracking campaign replies
ALTER TABLE email_threads ADD COLUMN IF NOT EXISTS campaign_id UUID REFERENCES marketing_campaigns(id) ON DELETE SET NULL;
ALTER TABLE email_threads ADD COLUMN IF NOT EXISTS lead_id UUID REFERENCES leads(id) ON DELETE SET NULL;

-- Create indexes for campaign queries
CREATE INDEX IF NOT EXISTS idx_email_threads_campaign_id ON email_threads(campaign_id);
CREATE INDEX IF NOT EXISTS idx_email_threads_lead_id ON email_threads(lead_id);
