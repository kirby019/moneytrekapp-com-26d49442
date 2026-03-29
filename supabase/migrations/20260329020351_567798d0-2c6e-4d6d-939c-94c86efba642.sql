
CREATE TABLE public.exchange_rates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  base_currency text NOT NULL,
  target_currency text NOT NULL,
  rate numeric NOT NULL,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (base_currency, target_currency)
);

ALTER TABLE public.exchange_rates ENABLE ROW LEVEL SECURITY;

-- Exchange rates are public read, only service role can write
CREATE POLICY "Anyone can read exchange rates" ON public.exchange_rates FOR SELECT TO authenticated USING (true);
