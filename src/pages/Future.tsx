import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, TrendingUp, Wallet, Home, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { useDebts } from "@/hooks/useDebts";
import { useLocalizedCurrency } from "@/hooks/useLocalizedPrice";
import { useDebtFreeDate } from "@/hooks/useDebtFreeDate";
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import CharacterGuide from "@/components/CharacterGuide";
import TalkingCharacter from "@/components/TalkingCharacter";

export default function Future() {
  const { data: debts, isLoading } = useDebts();
  const { format: fmt } = useLocalizedCurrency();
  const { debtFreeDate, totalMinPayment } = useDebtFreeDate(debts as any);

  const stats = useMemo(() => {
    if (!debts || debts.length === 0 || totalMinPayment <= 0) return null;

    const annualSavings = totalMinPayment * 12;
    const monthlyRate = 0.07 / 12;
    const months = 120;
    const futureValue = totalMinPayment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);

    return { totalMinPayment, annualSavings, futureValue };
  }, [debts, totalMinPayment]);

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

            {/* Savings Pig guide at the bottom */}
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
