
-- 1. Drop the SELECT policy that lets authenticated users read subscriptions directly
DROP POLICY IF EXISTS "Users can view own subscriptions" ON public.subscriptions;

-- 2. Revoke all SELECT privileges on subscriptions from authenticated and anon
REVOKE ALL ON public.subscriptions FROM authenticated;
REVOKE ALL ON public.subscriptions FROM anon;

-- 3. Recreate subscriptions_safe view with security_invoker=off (uses owner permissions
--    to read from the now-locked subscriptions table) and built-in user scoping via WHERE clause
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

-- 4. Grant SELECT on the view only to authenticated users
GRANT SELECT ON public.subscriptions_safe TO authenticated;
