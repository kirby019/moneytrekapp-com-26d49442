import { useMemo } from "react";
import { addMonths } from "date-fns";

interface DebtInput {
  current_balance: number | null;
  interest_rate: number | null;
  minimum_payment: number | null;
  status: string | null;
}

/**
 * Calculate months to pay off a single debt with interest.
 * Uses: n = -ln(1 - r*B/P) / ln(1+r)
 * where r = monthly rate, B = balance, P = monthly payment
 * Falls back to simple B/P if payment doesn't cover interest.
 */
function monthsToPayoff(balance: number, annualRate: number, payment: number): number {
  if (balance <= 0 || payment <= 0) return 0;
  if (annualRate <= 0) return Math.ceil(balance / payment);

  const r = annualRate / 100 / 12;
  const interestOnly = r * balance;

  // If payment doesn't cover interest, use 30 years as max
  if (payment <= interestOnly) return 360;

  const n = -Math.log(1 - (r * balance) / payment) / Math.log(1 + r);
  return Math.ceil(n);
}

export function useDebtFreeDate(debts: DebtInput[] | undefined) {
  return useMemo(() => {
    if (!debts || debts.length === 0) return { debtFreeDate: null, monthsRemaining: 0, totalMinPayment: 0 };

    const activeDebts = debts.filter(d => d.status !== "paid");
    if (activeDebts.length === 0) return { debtFreeDate: new Date(), monthsRemaining: 0, totalMinPayment: 0 };

    const totalMinPayment = activeDebts.reduce((s, d) => s + (d.minimum_payment ?? 0), 0);

    // Calculate max months across all debts (each paid independently)
    let maxMonths = 0;
    for (const debt of activeDebts) {
      const bal = debt.current_balance ?? 0;
      const rate = debt.interest_rate ?? 0;
      const pmt = debt.minimum_payment ?? 0;
      const m = monthsToPayoff(bal, rate, pmt);
      if (m > maxMonths) maxMonths = m;
    }

    const debtFreeDate = maxMonths > 0 ? addMonths(new Date(), maxMonths) : null;

    return { debtFreeDate, monthsRemaining: maxMonths, totalMinPayment };
  }, [debts]);
}
