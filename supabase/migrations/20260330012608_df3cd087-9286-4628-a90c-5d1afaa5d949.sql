
-- Fix the view to use SECURITY INVOKER (inherits querying user's RLS)
ALTER VIEW public.subscriptions_safe SET (security_invoker = on);
