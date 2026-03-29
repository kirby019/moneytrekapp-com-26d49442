
-- Fix streaks: add id primary key and created_at
ALTER TABLE public.streaks ADD COLUMN IF NOT EXISTS id uuid DEFAULT gen_random_uuid();
ALTER TABLE public.streaks ADD CONSTRAINT streaks_pkey PRIMARY KEY (id);
ALTER TABLE public.streaks ADD COLUMN IF NOT EXISTS created_at timestamp with time zone DEFAULT now();

-- Add created_at to tables missing it
ALTER TABLE public.milestones ADD COLUMN IF NOT EXISTS created_at timestamp with time zone DEFAULT now();
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS created_at timestamp with time zone DEFAULT now();
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS created_at timestamp with time zone DEFAULT now();
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS created_at timestamp with time zone DEFAULT now();
ALTER TABLE public.weekly_reports ADD COLUMN IF NOT EXISTS created_at timestamp with time zone DEFAULT now();

-- Fix debts RLS: drop overly-permissive public-role ALL policy, tighten per-command to authenticated
DROP POLICY IF EXISTS "users own debts" ON public.debts;
DROP POLICY IF EXISTS "Users can view own debts" ON public.debts;
DROP POLICY IF EXISTS "Users can insert own debts" ON public.debts;
DROP POLICY IF EXISTS "Users can update own debts" ON public.debts;
DROP POLICY IF EXISTS "Users can delete own debts" ON public.debts;

CREATE POLICY "Users can view own debts" ON public.debts FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own debts" ON public.debts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own debts" ON public.debts FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own debts" ON public.debts FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Remove duplicate ALL policies from other tables
DROP POLICY IF EXISTS "users own milestones" ON public.milestones;
DROP POLICY IF EXISTS "users own notifications" ON public.notifications;
DROP POLICY IF EXISTS "users own payments" ON public.payments;
DROP POLICY IF EXISTS "users own streaks" ON public.streaks;
DROP POLICY IF EXISTS "users own subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "users own weekly_reports" ON public.weekly_reports;
