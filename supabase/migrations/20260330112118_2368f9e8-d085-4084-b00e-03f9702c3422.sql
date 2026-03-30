
-- Grant SELECT on only the safe columns of subscriptions to authenticated
-- (stripe_customer_id and stripe_subscription_id remain revoked from earlier migration)
GRANT SELECT (id, user_id, plan, status, billing_cycle, is_trial, trial_ends_at, is_founding_member, start_date, end_date, current_period_end, created_at) ON public.subscriptions TO authenticated;

-- Recreate view with security_invoker = on so underlying RLS applies
-- No need for WHERE clause since subscriptions RLS handles user scoping
CREATE OR REPLACE VIEW public.subscriptions_safe
WITH (security_invoker = on)
AS
SELECT
  id,
  user_id,
  plan,
  status,
  billing_cycle,
  is_trial,
  trial_ends_at,
  is_founding_member,
  start_date,
  end_date,
  current_period_end,
  created_at
FROM public.subscriptions;

-- Ensure SELECT is granted on the safe view
GRANT SELECT ON public.subscriptions_safe TO authenticated;
