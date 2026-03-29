
CREATE OR REPLACE FUNCTION public.update_debt_balance_on_payment()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_balance numeric;
BEGIN
  -- Subtract payment amount from debt balance
  UPDATE public.debts
  SET current_balance = GREATEST(current_balance - NEW.amount, 0)
  WHERE id = NEW.debt_id
  RETURNING current_balance INTO new_balance;

  -- If balance is zero, mark as paid
  IF new_balance IS NOT NULL AND new_balance <= 0 THEN
    UPDATE public.debts
    SET status = 'paid', paid_off_date = CURRENT_DATE
    WHERE id = NEW.debt_id;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_payment_inserted
  AFTER INSERT ON public.payments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_debt_balance_on_payment();
