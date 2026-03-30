
-- Recreate subscriptions_safe view with built-in user scoping and WITHOUT security_invoker
-- so it uses owner permissions (bypassing RLS on the underlying table)
-- while the WHERE clause ensures users only see their own rows
CREATE OR REPLACE VIEW public.subscriptions_safe
WITH (security_invoker = off)
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
FROM public.subscriptions
WHERE user_id = auth.uid();

-- Revoke direct SELECT on subscriptions table from authenticated and anon
-- so clients must go through the safe view
REVOKE SELECT ON public.subscriptions FROM authenticated;
REVOKE SELECT ON public.subscriptions FROM anon;

-- Ensure SELECT is granted on the safe view
GRANT SELECT ON public.subscriptions_safe TO authenticated;
