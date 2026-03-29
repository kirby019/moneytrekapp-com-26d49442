ALTER TABLE public.debts DROP CONSTRAINT IF EXISTS debts_user_id_fkey;
ALTER TABLE public.milestones DROP CONSTRAINT IF EXISTS milestones_user_id_fkey;
ALTER TABLE public.notifications DROP CONSTRAINT IF EXISTS notifications_user_id_fkey;
ALTER TABLE public.payments DROP CONSTRAINT IF EXISTS payments_user_id_fkey;
ALTER TABLE public.streaks DROP CONSTRAINT IF EXISTS streaks_user_id_fkey;
ALTER TABLE public.weekly_reports DROP CONSTRAINT IF EXISTS weekly_reports_user_id_fkey;
ALTER TABLE public.subscriptions DROP CONSTRAINT IF EXISTS subscriptions_user_id_fkey;