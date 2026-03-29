
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS journey_start_date date DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS journey_starting_debt numeric DEFAULT NULL;
