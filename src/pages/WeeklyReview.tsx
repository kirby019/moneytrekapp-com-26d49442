import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingDown, DollarSign, CheckCircle2, Plus } from "lucide-react";
import { characters } from "@/lib/characters";
import { Link } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { useWeeklyReports } from "@/hooks/useWeeklyReports";
import { usePayments } from "@/hooks/usePayments";
import { useDebts } from "@/hooks/useDebts";
import { useProfile } from "@/hooks/useProfile";
import { useExchangeRates, convertCurrency } from "@/hooks/useExchangeRates";
import { formatCurrency } from "@/lib/currency";
import { useCelebrations } from "@/hooks/useCelebrations";
import { useUpdateStreak } from "@/hooks/useStreak";
import { useEffect, useRef, useMemo } from "react";

const MOTIVATION_QUOTES = [
  "Every payment you make is a step closer to freedom. Keep going — you're doing amazing!",
  "Small progress is still progress. Celebrate every win, no matter how small.",
  "You didn't come this far to only come this far. Your future self will thank you.",
  "Financial freedom isn't about how much you earn — it's about how you manage what you have.",
  "Consistency beats intensity. One payment at a time, you're building a better life.",
  "Imagine the relief of being debt-free. That feeling is getting closer every day.",
  "The best investment you can make is in your own peace of mind.",
  "You're not just paying off debt — you're building discipline, resilience, and confidence.",
  "Every dollar you pay down today is a dollar that stops working against you tomorrow.",
  "Your journey matters more than your pace. Stay the course — you've got this!",
  "Think of each payment as a gift to your future self. They'll be so grateful.",
  "Debt-free living isn't a dream — it's a destination. And you're already on the way.",
  "The hardest part was starting. You've already done that. Now just keep moving forward.",
  "Money grows when you stop feeding debt and start feeding your goals.",
  "Believe in the power of your own commitment. You chose this path for a reason.",
];

function getQuoteIndex(): number {
  const daysSinceEpoch = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
  return Math.floor(daysSinceEpoch / 2) % MOTIVATION_QUOTES.length;
}

function MotivationCard() {
  const quote = useMemo(() => MOTIVATION_QUOTES[getQuoteIndex()], []);
  return (
    <Card>
      <CardContent className="p-6 flex items-start gap-4">
        <img
          src={characters.streakFlame.src}
          alt={characters.streakFlame.alt}
          width={48}
          height={48}
          loading="lazy"
          className="w-12 h-12 object-contain flex-shrink-0"
        />
        <div>
          <h2 className="font-heading font-semibold mb-2">Motivation</h2>
          <p className="text-muted-foreground text-sm italic">"{quote}"</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function WeeklyReview() {
  const { data: reports } = useWeeklyReports();
  const { data: payments } = usePayments();
  const { data: debts } = useDebts();
  const { data: profile } = useProfile();
  const { data: rates } = useExchangeRates();
  const defaultCurrency = (profile as any)?.default_currency ?? "USD";
  const { celebrateWeeklyReview } = useCelebrations();
  const updateStreak = useUpdateStreak();
  const hasShownReviewToast = useRef(false);
  const weekReviewKey = useRef("");

  // Only celebrate once per unique week visit (not on every render)
  useEffect(() => {
    const weekKey = weekStart.toISOString().split("T")[0];
    if (payments && payments.length > 0 && !hasShownReviewToast.current && weekReviewKey.current !== weekKey) {
      hasShownReviewToast.current = true;
      weekReviewKey.current = weekKey;
      celebrateWeeklyReview();
      updateStreak.mutate();
    }
  }, [payments, celebrateWeeklyReview]); // eslint-disable-line react-hooks/exhaustive-deps

  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  const weekStartStr = weekStart.toLocaleDateString("en-US", { month: "long", day: "numeric" });
  const weekEndStr = now.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  const thisWeekPayments = payments?.filter(p => {
    if (!p.payment_date) return false;
    const pd = new Date(p.payment_date);
    return pd >= weekStart && pd <= now;
  }) ?? [];

  const weekTotal = thisWeekPayments.reduce((s, p) => {
    const debt = debts?.find(d => d.id === p.debt_id);
    const cur = (debt as any)?.currency ?? defaultCurrency;
    return s + convertCurrency(p.amount ?? 0, cur, defaultCurrency, rates);
  }, 0);

  const totalBalance = debts?.reduce((s, d) => {
    const cur = (d as any).currency ?? defaultCurrency;
    return s + convertCurrency(d.current_balance ?? 0, cur, defaultCurrency, rates);
  }, 0) ?? 0;

  const report = reports?.[0];

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-bold">Weekly Review</h1>
          <p className="text-sm text-muted-foreground mt-1">Week of {weekStartStr} — {weekEndStr}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-5 text-center">
              <DollarSign className="w-6 h-6 text-success mx-auto mb-2" />
              <p className="text-2xl font-heading font-bold">{formatCurrency(weekTotal, defaultCurrency)}</p>
              <p className="text-xs text-muted-foreground">Paid This Week</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 text-center">
              <TrendingDown className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-heading font-bold">{formatCurrency(totalBalance, defaultCurrency)}</p>
              <p className="text-xs text-muted-foreground">Total Remaining</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-6">
            <h2 className="font-heading font-semibold mb-4">This Week's Payments</h2>
            {thisWeekPayments.length > 0 ? (
              <div className="space-y-3">
                {thisWeekPayments.map(p => {
                  const debt = debts?.find(d => d.id === p.debt_id);
                  const cur = (debt as any)?.currency ?? defaultCurrency;
                  return (
                    <div key={p.id} className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-success mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">{(p as any).debts?.debt_name ?? "Payment"}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatCurrency(p.amount ?? 0, cur)} — {p.is_extra_payment ? "extra payment" : "minimum"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-sm text-muted-foreground mb-3">No payments this week yet.</p>
                <Button size="sm" asChild>
                  <Link to="/record-payment"><Plus className="w-3 h-3 mr-1" />Record Payment</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {report?.notes && (
          <Card>
            <CardContent className="p-6">
              <h2 className="font-heading font-semibold mb-2">Notes</h2>
              <p className="text-muted-foreground text-sm">{report.notes}</p>
            </CardContent>
          </Card>
        )}

        <MotivationCard />
      </div>
    </AppLayout>
  );
}
