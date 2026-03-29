import { Card, CardContent } from "@/components/ui/card";
import { TrendingDown, DollarSign, CheckCircle2 } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { useWeeklyReports } from "@/hooks/useWeeklyReports";
import { usePayments } from "@/hooks/usePayments";
import { useDebts } from "@/hooks/useDebts";
import { useProfile } from "@/hooks/useProfile";
import { useExchangeRates, convertCurrency } from "@/hooks/useExchangeRates";
import { formatCurrency } from "@/lib/currency";
import UpgradePrompt from "@/components/UpgradePrompt";
import { useFeatureAccess } from "@/hooks/useSubscription";
import { useCelebrations } from "@/hooks/useCelebrations";
import { useEffect, useRef } from "react";

export default function WeeklyReview() {
  const { hasAccess } = useFeatureAccess("weeklyReports");
  const { data: reports } = useWeeklyReports();
  const { data: payments } = usePayments();
  const { data: debts } = useDebts();
  const { data: profile } = useProfile();
  const { data: rates } = useExchangeRates();
  const defaultCurrency = (profile as any)?.default_currency ?? "USD";
  const { celebrateWeeklyReview } = useCelebrations();
  const hasShownReviewToast = useRef(false);

  // Show encouragement toast when viewing weekly review with payments
  useEffect(() => {
    if (hasAccess && payments && payments.length > 0 && !hasShownReviewToast.current) {
      hasShownReviewToast.current = true;
      celebrateWeeklyReview();
    }
  }, [hasAccess, payments, celebrateWeeklyReview]);

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

  // Convert weekly payment totals to default currency
  const weekTotal = thisWeekPayments.reduce((s, p) => {
    // Payments inherit debt currency — look up the debt
    const debt = debts?.find(d => d.id === p.debt_id);
    const cur = (debt as any)?.currency ?? defaultCurrency;
    return s + convertCurrency(p.amount ?? 0, cur, defaultCurrency, rates);
  }, 0);

  const totalBalance = debts?.reduce((s, d) => {
    const cur = (d as any).currency ?? defaultCurrency;
    return s + convertCurrency(d.current_balance ?? 0, cur, defaultCurrency, rates);
  }, 0) ?? 0;

  const report = reports?.[0];

  if (!hasAccess) {
    return (
      <AppLayout>
        <div className="max-w-2xl mx-auto">
          <h1 className="font-heading text-2xl font-bold mb-6">Weekly Review</h1>
          <UpgradePrompt message="Weekly reports are a Pro feature. Upgrade to get automated weekly summaries." />
        </div>
      </AppLayout>
    );
  }

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
              <p className="text-sm text-muted-foreground">No payments this week yet. Keep going!</p>
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

        <Card>
          <CardContent className="p-6">
            <h2 className="font-heading font-semibold mb-2">Motivation</h2>
            <p className="text-muted-foreground text-sm italic">"The secret of getting ahead is getting started." — Mark Twain</p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
