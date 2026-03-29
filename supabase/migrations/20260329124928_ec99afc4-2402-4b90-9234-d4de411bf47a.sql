
-- Add trial and founding member columns to subscriptions
ALTER TABLE public.subscriptions 
  ADD COLUMN IF NOT EXISTS is_trial boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_founding_member boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS trial_ends_at timestamp with time zone;

-- Create a trigger function to auto-create a 14-day Pro trial for new users
CREATE OR REPLACE FUNCTION public.create_trial_subscription()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.subscriptions (user_id, plan, status, is_trial, trial_ends_at, start_date, billing_cycle, is_founding_member)
  VALUES (
    NEW.id,
    'pro',
    'active',
    true,
    (now() + interval '14 days'),
    CURRENT_DATE,
    'monthly',
    true
  );
  RETURN NEW;
END;
$$;

-- Attach trigger to auth.users on signup
DROP TRIGGER IF EXISTS on_auth_user_created_trial ON auth.users;
CREATE TRIGGER on_auth_user_created_trial
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.create_trial_subscription();
