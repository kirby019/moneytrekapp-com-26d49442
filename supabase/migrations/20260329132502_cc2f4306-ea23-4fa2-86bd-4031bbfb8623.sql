
-- Backfill trial for existing users who don't have a subscription yet
INSERT INTO public.subscriptions (user_id, plan, status, is_trial, trial_ends_at, start_date, billing_cycle, is_founding_member)
SELECT u.id, 'pro', 'active', true, now() + interval '7 days', CURRENT_DATE, 'monthly', true
FROM auth.users u
LEFT JOIN public.subscriptions s ON s.user_id = u.id
WHERE s.id IS NULL;
