import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, TrendingUp, Wallet, Home, Plus, Zap, Calculator, PiggyBank } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { useDebts } from "@/hooks/useDebts";
import { useLocalizedCurrency } from "@/hooks/useLocalizedPrice";
import { useDebtFreeDate } from "@/hooks/useDebtFreeDate";
import { Skeleton } from "@/components/ui/skeleton";
import { format, addMonths } from "date-fns";
import CharacterGuide from "@/components/CharacterGuide";
import TalkingCharacter from "@/components/TalkingCharacter";
import { cn } from "@/lib/utils";

function calcMonths(balance: number, annualRate: number, monthlyPayment: number): number {
  if (balance <= 0 || monthlyPayment <= 0) return 0;
  if (annualRate <= 0) return Math.ceil(balance / monthlyPayment);
  const r = annualRate / 100 / 12;
  if (monthlyPayment <= r * balance) return 360;
  const n = -Math.log(1 - (r * balance) / monthlyPayment) / Math.log(1 + r);
  return Math.ceil(n);
}

function calcFutureValue(monthly: number, annualRate: number, years: number): number {
  const r = annualRate / 100 / 12;
  const n = years * 12;
  if (r === 0) return monthly * n;
  return monthly * ((Math.pow(1 + r, n) - 1) / r);
}

export default function Future() {
  const { data: debts, isLoading } = useDebts();
  const { format: fmt } = useLocalizedCurrency();
  const { debtFreeDate, monthsRemaining, totalMinPayment } = useDebtFreeDate(debts as any);

  const [extraPayment, setExtraPayment] = useState(0);
  const [investAmount, setInvestAmount] = useState<number | "">("");
  const [investRate, setInvestRate] = useState(7);
  const [investYears, setInvestYears] = useState(10);

  const stats = useMemo(() => {
    if (!debts || debts.length === 0 || totalMinPayment <= 0) return null;
    const annualSavings = totalMinPayment * 12;
    const monthlyRate = 0.07 / 12;
    const months = 120;
    const futureValue = totalMinPayment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
    return { totalMinPayment, annualSavings, futureValue };
  }, [debts, totalMinPayment]);

  // Extra payment what-if
  const whatIfExtra = useMemo(() => {
    if (!debts) return null;
    const active = debts.filter(d => d.status !== "paid" && (d.current_balance ?? 0) > 0);
    if (active.length === 0) return null;

    const totalBalance = active.reduce((s, d) => s + (d.current_balance ?? 0), 0);
    const totalMin = active.reduce((s, d) => s + (d.minimum_payment ?? 0), 0);
    const weightedRate = totalBalance > 0
      ? active.reduce((s, d) => s + (d.interest_rate ?? 0) * (d.current_balance ?? 0), 0) / totalBalance
      : 0;

    const monthsBase = calcMonths(totalBalance, weightedRate, totalMin);
    const monthsNew = calcMonths(totalBalance, weightedRate, totalMin + extraPayment);
    const monthsSaved = Math.max(0, monthsBase - monthsNew);
    const interestBase = Math.max(0, totalMin * monthsBase - totalBalance);
    const interestNew = Math.max(0, (totalMin + extraPayment) * monthsNew - totalBalance);
    const interestSaved = Math.max(0, interestBase - interestNew);
    const newDate = monthsNew > 0 ? addMonths(new Date(), monthsNew) : null;

    return { monthsBase, monthsNew, monthsSaved, interestSaved, newDate };
  }, [debts, extraPayment]);

  // Investment projector
  const investResult = useMemo(() => {
    const monthly = Number(investAmount) || (stats?.totalMinPayment ?? 0);
    const fv = calcFutureValue(monthly, investRate, investYears);
    const contributed = monthly * investYears * 12;
    return { fv, contributed, growth: fv - contributed, monthly };
  }, [investAmount, investRate, investYears, stats]);

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
          <h1 className="font-heading text-2xl font-bold">Your Financial Future</h1>
          <p className="text-sm text-muted-foreground mt-1">See what's possible — and play with the numbers.</p>
        </div>

        {isLoading ? (
          <Skeleton className="h-40 w-full rounded-2xl" />
        ) : !debts || debts.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center space-y-4">
              <TalkingCharacter
                character="goalRocket"
                context="empty"
                animation="pulse"
                size="xl"
                bubblePosition="top"
                className="mx-auto"
              />
              <div>
                <p className="font-heading font-semibold">See your future</p>
                <p className="text-sm text-muted-foreground mt-1">Add your debts to see projections of your debt-free future.</p>
              </div>
              <Button asChild>
                <Link to="/add-debt"><Plus className="w-4 h-4 mr-2" />Add Your First Debt</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Debt-free date hero */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 rounded-2xl text-center text-primary-foreground relative overflow-hidden"
              style={{ background: "var(--gradient-hero)" }}
            >
              <Sparkles className="w-10 h-10 text-accent mx-auto mb-4" />
              <h2 className="font-heading text-3xl font-extrabold mb-2">
                {debtFreeDate ? format(debtFreeDate, "MMMM yyyy") : "Keep making payments!"}
              </h2>
              <p className="text-primary-foreground/70">Your projected debt-free date</p>
              <div className="absolute bottom-2 right-4 opacity-80">
                <CharacterGuide character="goalRocket" context="future" animation="float" />
              </div>
            </motion.div>

            {/* Projection cards */}
            <div className="space-y-4">
              {projections.map((p, i) => (
                <motion.div key={p.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                  <Card>
                    <CardContent className="p-5 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <p.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-muted-foreground">{p.label}</p>
                        <p className="text-xl font-heading font-bold truncate">{p.value}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{p.desc}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* What-If Calculators */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Calculator className="w-4 h-4 text-primary" />
                <h2 className="font-heading font-bold text-lg">What-If Calculators</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-4">Adjust the numbers to see how small changes make a big difference.</p>

              <div className="grid grid-cols-1 gap-4">

                {/* Extra Payment Calculator */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-500" />
                      Extra Payment
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">What if you paid extra each month?</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="extra-payment">Extra monthly payment</Label>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground text-sm">$</span>
                        <Input
                          id="extra-payment"
                          type="number"
                          min={0}
                          placeholder="0"
                          value={extraPayment || ""}
                          onChange={e => setExtraPayment(Math.max(0, Number(e.target.value) || 0))}
                          className="max-w-[160px]"
                        />
                        <span className="text-sm text-muted-foreground">/month</span>
                      </div>
                    </div>

                    {whatIfExtra && extraPayment > 0 ? (
                      <div className="space-y-2 pt-1">
                        <div className={cn(
                          "rounded-lg p-3 space-y-2",
                          whatIfExtra.monthsSaved > 0 ? "bg-green-50 border border-green-200" : "bg-muted/40"
                        )}>
                          {whatIfExtra.monthsSaved > 0 ? (
                            <>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Months saved</span>
                                <span className="font-bold text-green-600">
                                  ⚡ {whatIfExtra.monthsSaved} {whatIfExtra.monthsSaved === 1 ? "month" : "months"} faster
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Interest saved</span>
                                <span className="font-bold text-green-600">
                                  💰 {fmt(whatIfExtra.interestSaved)}
                                </span>
                              </div>
                              {whatIfExtra.newDate && (
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">New debt-free date</span>
                                  <span className="font-semibold">
                                    📅 {format(whatIfExtra.newDate, "MMM yyyy")}
                                  </span>
                                </div>
                              )}
                            </>
                          ) : (
                            <p className="text-sm text-muted-foreground text-center">
                              Already at maximum speed with this payment.
                            </p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        Enter an amount above to see how much sooner you'd be debt-free.
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Investment Projector */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      Investment Projector
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">What could your money grow to?</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="invest-amount">Monthly amount</Label>
                        <div className="flex items-center gap-1">
                          <span className="text-muted-foreground text-sm">$</span>
                          <Input
                            id="invest-amount"
                            type="number"
                            min={0}
                            placeholder={String(Math.round(stats?.totalMinPayment ?? 500))}
                            value={investAmount}
                            onChange={e => setInvestAmount(e.target.value === "" ? "" : Math.max(0, Number(e.target.value)))}
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="invest-rate">Annual return</Label>
                        <div className="flex items-center gap-1">
                          <Input
                            id="invest-rate"
                            type="number"
                            min={0}
                            max={30}
                            step={0.5}
                            value={investRate}
                            onChange={e => setInvestRate(Math.max(0, Math.min(30, Number(e.target.value) || 0)))}
                          />
                          <span className="text-muted-foreground text-sm">%</span>
                        </div>
                      </div>
                    </div>

                    {/* Years selector */}
                    <div className="space-y-1.5">
                      <Label>Time horizon</Label>
                      <div className="flex gap-2">
                        {[5, 10, 20, 30].map(y => (
                          <Button
                            key={y}
                            size="sm"
                            variant={investYears === y ? "default" : "outline"}
                            className="flex-1"
                            onClick={() => setInvestYears(y)}
                          >
                            {y}yr
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Results */}
                    <div className="rounded-lg bg-green-50 border border-green-200 p-3 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Future value</span>
                        <span className="font-heading font-bold text-green-600 text-base">
                          📈 {fmt(investResult.fv)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Total contributed</span>
                        <span className="font-medium">💵 {fmt(investResult.contributed)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Investment growth</span>
                        <span className="font-medium text-green-600">🌱 +{fmt(Math.max(0, investResult.growth))}</span>
                      </div>
                      <p className="text-xs text-muted-foreground pt-1">
                        Based on {fmt(investResult.monthly)}/mo at {investRate}% annual return over {investYears} years.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Motivational footer */}
            <Card>
              <CardContent className="p-5 flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-heading font-semibold text-lg">Start saving for your dreams!</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Once you're debt-free, redirect your payments into savings and investments.
                  </p>
                </div>
                <div className="shrink-0">
                  <CharacterGuide character="savingsPig" context="savings" animation="bounce" />
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </AppLayout>
  );
}
