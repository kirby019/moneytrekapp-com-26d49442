
-- Schedule weekly report generation every Monday at midnight UTC
SELECT cron.schedule(
  'weekly-report-generation',
  '0 0 * * 1',
  $$
  SELECT net.http_post(
    url := 'https://sbumhvobevmqciyyvgty.supabase.co/functions/v1/weekly-report',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNidW1odm9iZXZtcWNpeXl2Z3R5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3NDcwMTcsImV4cCI6MjA5MDMyMzAxN30.fyvok14qiozSck6KBnlC3iwYWXB50yOa61s5PrgXbEQ"}'::jsonb,
    body := '{}'::jsonb
  ) AS request_id;
  $$
);

-- Schedule daily exchange rate sync at 6 AM UTC
SELECT cron.schedule(
  'daily-exchange-rate-sync',
  '0 6 * * *',
  $$
  SELECT net.http_post(
    url := 'https://sbumhvobevmqciyyvgty.supabase.co/functions/v1/exchange-rate-sync',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNidW1odm9iZXZtcWNpeXl2Z3R5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3NDcwMTcsImV4cCI6MjA5MDMyMzAxN30.fyvok14qiozSck6KBnlC3iwYWXB50yOa61s5PrgXbEQ"}'::jsonb,
    body := '{}'::jsonb
  ) AS request_id;
  $$
);
