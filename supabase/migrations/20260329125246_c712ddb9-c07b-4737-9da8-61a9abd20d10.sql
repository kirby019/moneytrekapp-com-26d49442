
-- Update the trial trigger to use 7 days instead of 14
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
    (now() + interval '7 days'),
    CURRENT_DATE,
    'monthly',
    true
  );
  RETURN NEW;
END;
$$;
