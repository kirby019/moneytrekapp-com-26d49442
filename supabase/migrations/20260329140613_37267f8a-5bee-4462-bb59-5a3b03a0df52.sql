-- Ensure subscriptions stays read-only for authenticated users while satisfying security scanners
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Keep/replace the SELECT policy so users can only read their own subscription
DROP POLICY IF EXISTS "Users can view own subscriptions" ON public.subscriptions;
CREATE POLICY "Users can view own subscriptions"
ON public.subscriptions
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Add explicit deny policies for client-side writes
DROP POLICY IF EXISTS "Users cannot insert subscriptions" ON public.subscriptions;
CREATE POLICY "Users cannot insert subscriptions"
ON public.subscriptions
FOR INSERT
TO authenticated
WITH CHECK (false);

DROP POLICY IF EXISTS "Users cannot update subscriptions" ON public.subscriptions;
CREATE POLICY "Users cannot update subscriptions"
ON public.subscriptions
FOR UPDATE
TO authenticated
USING (false)
WITH CHECK (false);

DROP POLICY IF EXISTS "Users cannot delete subscriptions" ON public.subscriptions;
CREATE POLICY "Users cannot delete subscriptions"
ON public.subscriptions
FOR DELETE
TO authenticated
USING (false);