-- Enable the pg_cron extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Create a cron job that runs every hour
SELECT cron.schedule(
  'send-email-campaigns',
  '0 * * * *', -- Run every hour
  $$
  SELECT net.http_post(
    url := 'https://itracksy.com/api/send-campaign',
    headers := '{"Content-Type": "application/json"}'::jsonb
  ) AS request_id;
  $$
);
