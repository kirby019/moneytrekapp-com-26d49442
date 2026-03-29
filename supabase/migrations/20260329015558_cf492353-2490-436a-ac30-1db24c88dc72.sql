
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS default_currency text DEFAULT 'USD';
ALTER TABLE public.debts ADD COLUMN IF NOT EXISTS currency text DEFAULT 'USD';
