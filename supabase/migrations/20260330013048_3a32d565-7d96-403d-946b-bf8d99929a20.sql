
-- Revoke SELECT on Stripe billing columns from authenticated role
REVOKE SELECT (stripe_customer_id, stripe_subscription_id) ON public.subscriptions FROM authenticated;
REVOKE SELECT (stripe_customer_id, stripe_subscription_id) ON public.subscriptions FROM anon;
