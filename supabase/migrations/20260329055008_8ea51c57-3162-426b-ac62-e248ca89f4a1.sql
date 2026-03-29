
-- Trigger to restore debt balance when a payment is deleted
CREATE OR REPLACE FUNCTION public.restore_debt_balance_on_payment_delete()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Add the deleted payment amount back to the debt balance
  UPDATE public.debts
  SET current_balance = current_balance + OLD.amount,
      status = CASE WHEN status = 'paid' THEN 'active' ELSE status END,
      paid_off_date = CASE WHEN status = 'paid' THEN NULL ELSE paid_off_date END
  WHERE id = OLD.debt_id;

  RETURN OLD;
END;
$$;

CREATE TRIGGER on_payment_delete
  BEFORE DELETE ON public.payments
  FOR EACH ROW
  EXECUTE FUNCTION public.restore_debt_balance_on_payment_delete();

-- Also handle payment updates (amount changes)
CREATE OR REPLACE FUNCTION public.update_debt_balance_on_payment_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  new_balance numeric;
BEGIN
  -- Reverse old amount, apply new amount
  UPDATE public.debts
  SET current_balance = GREATEST(current_balance + OLD.amount - NEW.amount, 0)
  WHERE id = NEW.debt_id
  RETURNING current_balance INTO new_balance;

  -- Update status based on new balance
  IF new_balance IS NOT NULL AND new_balance <= 0 THEN
    UPDATE public.debts
    SET status = 'paid', paid_off_date = CURRENT_DATE
    WHERE id = NEW.debt_id;
  ELSE
    UPDATE public.debts
    SET status = 'active', paid_off_date = NULL
    WHERE id = NEW.debt_id AND status = 'paid';
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_payment_update
  BEFORE UPDATE ON public.payments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_debt_balance_on_payment_update();
