ALTER TABLE public.subscriptions
  ADD COLUMN IF NOT EXISTS billing_cycle text DEFAULT 'monthly',
  ADD COLUMN IF NOT EXISTS stripe_customer_id text,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id text,
  ADD COLUMN IF NOT EXISTS current_period_end timestamp with time zone;