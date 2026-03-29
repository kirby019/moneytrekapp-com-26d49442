import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import AppLayout from "@/components/AppLayout";
import { useDebts } from "@/hooks/useDebts";
import { usePayments } from "@/hooks/usePayments";
import { useProfile } from "@/hooks/useProfile";
import { formatCurrency } from "@/lib/currency";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { format, parseISO, startOfMonth } from "date-fns";
import UpgradePrompt from "@/components/UpgradePrompt";
import { useFeatureAccess } from "@/hooks/useSubscription";

export default function Analytics() {
  const { hasAccess } = useFeatureAccess("advancedAnalytics");
  const { data: debts, isLoading: debtsLoading } = useDebts();
  const { data: payments, isLoading: paymentsLoading } = usePayments();
  const { data: profile } = useProfile();
  const defaultCurrency = (profile as any)?.default_currency ?? "USD";
  const isLoading = debtsLoading || paymentsLoading;

  const totalOriginal = useMemo(() => debts?.reduce((s, d) => s + (d.original_amount ?? 0), 0) ?? 0, [debts]);

  // Payments per month
  const monthlyData = useMemo(() => {
    if (!payments || payments.length === 0) return [];
    const map = new Map<string, number>();
    payments.forEach(p => {
      if (!p.payment_date) return;
      const month = format(startOfMonth(parseISO(p.payment_date)), "yyyy-MM");
      map.set(month, (map.get(month) ?? 0) + (p.amount ?? 0));
    });
    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, amount]) => ({ month: format(parseISO(month + "-01"), "MMM yyyy"), amount }));
  }, [payments]);

  // Cumulative paid over time
  const cumulativeData = useMemo(() => {
    if (!payments || payments.length === 0) return [];
    const sorted = [...payments].filter(p => p.payment_date).sort((a, b) => a.payment_date!.localeCompare(b.payment_date!));
    let cumPaid = 0;
    return sorted.map(p => {
      cumPaid += p.amount ?? 0;
      const remainingDebt = Math.max(totalOriginal - cumPaid, 0);
      const progress = totalOriginal > 0 ? Math.round((cumPaid / totalOriginal) * 100) : 0;
      return {
        date: format(parseISO(p.payment_date!), "MMM d"),
        totalPaid: cumPaid,
        remainingDebt,
        progress,
      };
    });
  }, [payments, totalOriginal]);

  const totalPaid = cumulativeData.length > 0 ? cumulativeData[cumulativeData.length - 1].totalPaid : 0;
  const currentProgress = totalOriginal > 0 ? Math.round((totalPaid / totalOriginal) * 100) : 0;

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="font-heading text-2xl font-bold">Analytics</h1>

        {/* Summary cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Debt", value: formatCurrency(totalOriginal, defaultCurrency) },
            { label: "Total Paid", value: formatCurrency(totalPaid, defaultCurrency) },
            { label: "Remaining", value: formatCurrency(totalOriginal - totalPaid, defaultCurrency) },
            { label: "Progress", value: `${currentProgress}%` },
          ].map(s => (
            <Card key={s.label}>
              <CardContent className="p-4">
                {isLoading ? <Skeleton className="h-8 w-20" /> : <p className="text-2xl font-heading font-bold">{s.value}</p>}
                <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-64 w-full rounded-xl" />
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Payments per month */}
            <Card>
              <CardContent className="p-5">
                <h3 className="font-heading font-semibold mb-4">Payments Per Month</h3>
                {monthlyData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} className="fill-muted-foreground" />
                      <YAxis tick={{ fontSize: 11 }} className="fill-muted-foreground" />
                      <Tooltip formatter={(v: number) => formatCurrency(v, defaultCurrency)} />
                      <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : <p className="text-muted-foreground text-sm py-12 text-center">No payment data yet</p>}
              </CardContent>
            </Card>

            {/* Total paid over time */}
            <Card>
              <CardContent className="p-5">
                <h3 className="font-heading font-semibold mb-4">Total Paid Over Time</h3>
                {cumulativeData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={cumulativeData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="date" tick={{ fontSize: 11 }} className="fill-muted-foreground" />
                      <YAxis tick={{ fontSize: 11 }} className="fill-muted-foreground" />
                      <Tooltip formatter={(v: number) => formatCurrency(v, defaultCurrency)} />
                      <Area type="monotone" dataKey="totalPaid" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.15} />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : <p className="text-muted-foreground text-sm py-12 text-center">No payment data yet</p>}
              </CardContent>
            </Card>

            {/* Remaining debt over time */}
            <Card>
              <CardContent className="p-5">
                <h3 className="font-heading font-semibold mb-4">Remaining Debt Over Time</h3>
                {cumulativeData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={cumulativeData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="date" tick={{ fontSize: 11 }} className="fill-muted-foreground" />
                      <YAxis tick={{ fontSize: 11 }} className="fill-muted-foreground" />
                      <Tooltip formatter={(v: number) => formatCurrency(v, defaultCurrency)} />
                      <Area type="monotone" dataKey="remainingDebt" stroke="hsl(var(--destructive))" fill="hsl(var(--destructive))" fillOpacity={0.1} />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : <p className="text-muted-foreground text-sm py-12 text-center">No payment data yet</p>}
              </CardContent>
            </Card>

            {/* Progress over time */}
            <Card>
              <CardContent className="p-5">
                <h3 className="font-heading font-semibold mb-4">Progress Over Time</h3>
                {cumulativeData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={cumulativeData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="date" tick={{ fontSize: 11 }} className="fill-muted-foreground" />
                      <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} className="fill-muted-foreground" />
                      <Tooltip formatter={(v: number) => `${v}%`} />
                      <Line type="monotone" dataKey="progress" stroke="hsl(var(--accent))" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : <p className="text-muted-foreground text-sm py-12 text-center">No payment data yet</p>}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
