-- Drop the existing authenticated-only policy
DROP POLICY IF EXISTS "Anyone can read exchange rates" ON public.exchange_rates;

-- Create a new policy allowing anonymous (public) access
CREATE POLICY "Anyone can read exchange rates"
ON public.exchange_rates
FOR SELECT
TO anon, authenticated
USING (true);