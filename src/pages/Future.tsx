import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, TrendingUp, Wallet, Home } from "lucide-react";
import { motion } from "framer-motion";
import AppLayout from "@/components/AppLayout";
import { useDebts } from "@/hooks/useDebts";
import { useLocalizedCurrency } from "@/hooks/useLocalizedPrice";
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { addMonths, format } from "date-fns";

export default function Future() {
  const { data: debts, isLoading } = useDebts();
  const { format: fmt } = useLocalizedCurrency();

  const stats = useMemo(() => {
    if (!debts || debts.length === 0) return null;

    const activeDebts = debts.filter((d) => d.status !== "paid_off");
    const totalMinPayment = activeDebts.reduce((s, d) => s + (d.minimum_payment ?? 0), 0);
    const totalBalance = activeDebts.reduce((s, d) => s + (d.current_balance ?? 0), 0);

    // Estimate months to pay off (simplified: balance / monthly payment)
    const monthsToPayoff = totalMinPayment > 0 ? Math.ceil(totalBalance / totalMinPayment) : 0;
    const debtFreeDate = monthsToPayoff > 0 ? addMonths(new Date(), monthsToPayoff) : null;

    const annualSavings = totalMinPayment * 12;
    // 7% annual return compounded monthly for 10 years
    const monthlyRate = 0.07 / 12;
    const months = 120;
    const futureValue = totalMinPayment > 0
      ? totalMinPayment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate)
      : 0;

    return { totalMinPayment, annualSavings, futureValue, debtFreeDate };
  }, [debts]);

  const projections = stats
    ? [
        { icon: Wallet, label: "Monthly Savings", value: `${fmt(stats.totalMinPayment)}/mo`, desc: "Once debt-free, your payments become savings" },
        { icon: TrendingUp, label: "Annual Savings", value: fmt(stats.annualSavings), desc: "Invest this and watch it grow" },
        { icon: Home, label: "In 10 Years", value: `${fmt(stats.futureValue)}+`, desc: "Potential investment growth at 7% return" },
      ]
    : [];

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-bold">Your Debt-Free Future</h1>
          <p className="text-sm text-muted-foreground mt-1">See what's possible after you're debt free.</p>
        </div>

        {isLoading ? (
          <Skeleton className="h-40 w-full rounded-2xl" />
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 rounded-2xl text-center text-primary-foreground"
            style={{ background: "var(--gradient-hero)" }}
          >
            <Sparkles className="w-10 h-10 text-accent mx-auto mb-4" />
            <h2 className="font-heading text-3xl font-extrabold mb-2">
              {stats?.debtFreeDate ? format(stats.debtFreeDate, "MMMM yyyy") : "Add debts to see"}
            </h2>
            <p className="text-primary-foreground/70">Your projected debt-free date</p>
          </motion.div>
        )}

        <div className="space-y-4">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-xl" />)
            : projections.map((p, i) => (
                <motion.div key={p.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                  <Card>
                    <CardContent className="p-5 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <p.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">{p.label}</p>
                        <p className="text-xl font-heading font-bold">{p.value}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{p.desc}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
        </div>
      </div>
    </AppLayout>
  );
}
