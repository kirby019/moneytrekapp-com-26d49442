
-- Create a safe view that excludes Stripe billing identifiers
CREATE OR REPLACE VIEW public.subscriptions_safe AS
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

-- Grant access to the view for authenticated and anon roles
GRANT SELECT ON public.subscriptions_safe TO authenticated;
GRANT SELECT ON public.subscriptions_safe TO anon;
