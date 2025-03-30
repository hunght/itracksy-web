-- Enable the pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Remove the existing cron job if it exists
SELECT cron.unschedule('send-email-campaigns');

-- Enable the http extension for HTTP requests
CREATE EXTENSION IF NOT EXISTS http;

-- Create a function to send data to the API
CREATE OR REPLACE FUNCTION send_campaign_data_to_api()
RETURNS VOID AS $$
BEGIN
    PERFORM http_post(
        'https://itracksy.com/api/send-campaign',
        'application/json',
        '{}'  -- Add any data you need to send here
    );
END;
$$ LANGUAGE plpgsql;

-- Create a cron job that runs every hour
SELECT cron.schedule(
  'send-email-campaigns',
  '0 * * * *', -- Run every hour
  'SELECT send_campaign_data_to_api()'
);
