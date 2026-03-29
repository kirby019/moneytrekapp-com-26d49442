import { motion } from "framer-motion";
import { TrendingDown, DollarSign, CreditCard, Target, ArrowRight, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { useDebts } from "@/hooks/useDebts";
import { useProfile } from "@/hooks/useProfile";
import { useExchangeRates, convertCurrency } from "@/hooks/useExchangeRates";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/currency";

export default function Dashboard() {
  const { data: debts, isLoading } = useDebts();
  const { data: profile } = useProfile();
  const { data: rates } = useExchangeRates();

  const defaultCurrency = (profile as any)?.default_currency ?? "USD";
  const activeDebts = debts?.filter((d) => d.status !== "paid") ?? [];

  // Convert all amounts to default currency for totals
  const totalOriginal = debts?.reduce((s, d) => {
    const cur = (d as any).currency ?? defaultCurrency;
    return s + convertCurrency(d.original_amount ?? 0, cur, defaultCurrency, rates);
  }, 0) ?? 0;

  const totalBalance = debts?.reduce((s, d) => {
    const cur = (d as any).currency ?? defaultCurrency;
    return s + convertCurrency(d.current_balance ?? 0, cur, defaultCurrency, rates);
  }, 0) ?? 0;

  const totalPaid = totalOriginal - totalBalance;
  const overallProgress = totalOriginal > 0 ? Math.round((totalPaid / totalOriginal) * 100) : 0;

  const totalMinPayment = debts?.reduce((s, d) => {
    const cur = (d as any).currency ?? defaultCurrency;
    return s + convertCurrency(d.minimum_payment ?? 0, cur, defaultCurrency, rates);
  }, 0) ?? 0;

  const paidOffCount = debts?.filter((d) => d.status === "paid").length ?? 0;
  const firstName = profile?.full_name?.split(" ")[0] ?? "there";

  const stats = [
    { label: "Total Debt", value: formatCurrency(totalBalance, defaultCurrency), icon: CreditCard, change: `${activeDebts.length} active` },
    { label: "Monthly Payment", value: formatCurrency(totalMinPayment, defaultCurrency), icon: DollarSign, change: "Minimums total" },
    { label: "Debts Remaining", value: `${activeDebts.length}`, icon: TrendingDown, change: paidOffCount > 0 ? `${paidOffCount} paid off!` : "Keep going!" },
    { label: "Progress", value: `${overallProgress}%`, icon: Target, change: `${formatCurrency(totalPaid, defaultCurrency)} eliminated` },
  ];

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl lg:text-3xl font-bold">Welcome back, {firstName}! 👋</h1>
            <p className="text-muted-foreground text-sm mt-1">Here's your debt payoff overview.</p>
          </div>
          <Button asChild>
            <Link to="/add-debt"><Plus className="w-4 h-4 mr-2" /> Add Debt</Link>
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl text-primary-foreground" style={{ background: "var(--gradient-hero)" }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-primary-foreground/70 text-sm font-medium">Overall Progress</p>
              <p className="text-4xl font-heading font-extrabold mt-1">{overallProgress}% Paid Off</p>
              <p className="text-primary-foreground/60 text-sm mt-1">
                {formatCurrency(totalPaid, defaultCurrency)} of {formatCurrency(totalOriginal, defaultCurrency)} eliminated
              </p>
            </div>
            <div className="w-full md:w-64">
              <div className="h-3 rounded-full bg-primary-foreground/20 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-accent"
                  initial={{ width: 0 }}
                  animate={{ width: `${overallProgress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <s.icon className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <p className="text-2xl font-heading font-bold">{isLoading ? <Skeleton className="h-7 w-20" /> : s.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
                  <p className="text-xs text-success font-medium mt-2">{s.change}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-xl font-semibold">Your Debts</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/debts">View all <ArrowRight className="ml-1 w-3 h-3" /></Link>
            </Button>
          </div>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}
            </div>
          ) : debts && debts.length > 0 ? (
            <div className="space-y-3">
              {debts.slice(0, 5).map((debt, i) => {
                const orig = debt.original_amount ?? 0;
                const bal = debt.current_balance ?? 0;
                const progress = orig > 0 ? Math.round(((orig - bal) / orig) * 100) : 0;
                const cur = (debt as any).currency ?? defaultCurrency;
                return (
                  <motion.div key={debt.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-semibold truncate">{debt.debt_name}</p>
                            <span className="text-xs text-muted-foreground">{debt.interest_rate ?? 0}% APR</span>
                          </div>
                          <div className="mt-2">
                            <Progress value={progress} className="h-2" />
                          </div>
                          <div className="flex justify-between mt-1.5 text-xs text-muted-foreground">
                            <span>{formatCurrency(bal, cur)} remaining</span>
                            <span>{progress}%</span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <Link to="/debts">Details</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground mb-4">No debts yet. Add your first debt to start tracking!</p>
                <Button asChild><Link to="/add-debt"><Plus className="w-4 h-4 mr-2" />Add Your First Debt</Link></Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
