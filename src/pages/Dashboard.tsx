import { useEffect, useRef, useMemo } from "react";
import { Plus, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { useDebts } from "@/hooks/useDebts";
import { useProfile } from "@/hooks/useProfile";
import { useExchangeRates, convertCurrency } from "@/hooks/useExchangeRates";
import { useSubscription } from "@/hooks/useSubscription";
import TrialBanner from "@/components/TrialBanner";
import FoundingMemberBadge from "@/components/FoundingMemberBadge";
import { useJourneyProgress } from "@/hooks/useJourneyProgress";
import { useMilestones } from "@/hooks/useMilestones";
import { useCelebrations } from "@/hooks/useCelebrations";
import { useStreak } from "@/hooks/useStreak";
import { useDebtFreeDate } from "@/hooks/useDebtFreeDate";
import { usePersistMilestone } from "@/hooks/usePersistMilestone";
import { MILESTONE_CELEBRATIONS } from "@/lib/celebrations";
import CelebrationModal from "@/components/CelebrationModal";
import DashboardHero from "@/components/dashboard/DashboardHero";
import DashboardStats from "@/components/dashboard/DashboardStats";
import DashboardDebts from "@/components/dashboard/DashboardDebts";
import DashboardNextSteps from "@/components/dashboard/DashboardNextSteps";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";

export default function Dashboard() {
  const { user } = useAuth();
  const { data: debts, isLoading } = useDebts();
  const { data: profile } = useProfile();
  const { data: rates } = useExchangeRates();
  const { isFree, isFoundingMember } = useSubscription();
  const { journeyProgress, hasJourneyData } = useJourneyProgress();
  const { data: milestones } = useMilestones();
  const { data: streak } = useStreak();
  const { celebration, closeCelebration, checkMilestoneCelebration } = useCelebrations();
  const persistMilestone = usePersistMilestone();
  const milestoneChecked = useRef(false);

  const { data: userRow } = useQuery({
    queryKey: ["user-strategy", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("users")
        .select("selected_strategy")
        .eq("id", user!.id)
        .maybeSingle();
      return data;
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (milestoneChecked.current || !hasJourneyData) return;
    milestoneChecked.current = true;
    const achievedPercents = milestones?.map(m => m.milestone_percent ?? 0) ?? [];
    const milestone = checkMilestoneCelebration(journeyProgress, achievedPercents);
    if (milestone) {
      persistMilestone.mutate(milestone.percent);
    }
  }, [journeyProgress, hasJourneyData, milestones, checkMilestoneCelebration, persistMilestone]);

  const defaultCurrency = (profile as any)?.default_currency ?? "USD";
  const activeDebts = debts?.filter((d) => d.status !== "paid") ?? [];

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

  const { debtFreeDate } = useDebtFreeDate(debts as any);

  const nextDebt = useMemo(() => {
    if (!activeDebts.length) return null;
    const strategy = userRow?.selected_strategy ?? "snowball";
    const sorted = [...activeDebts].sort((a, b) => {
      if (strategy === "avalanche") return (b.interest_rate ?? 0) - (a.interest_rate ?? 0);
      return (a.current_balance ?? 0) - (b.current_balance ?? 0);
    });
    const d = sorted[0];
    return { debt_name: d.debt_name, current_balance: d.current_balance, currency: (d as any).currency ?? defaultCurrency };
  }, [activeDebts, userRow?.selected_strategy, defaultCurrency]);

  const nextMilestonePercent = useMemo(() => {
    const achievedPercents = milestones?.map(m => m.milestone_percent ?? 0) ?? [];
    for (const m of MILESTONE_CELEBRATIONS) {
      if (!achievedPercents.includes(m.percent) && journeyProgress < m.percent) return m.percent;
    }
    return null;
  }, [milestones, journeyProgress]);

  const currentStreak = streak?.current_streak ?? 0;
  const hasDebts = debts && debts.length > 0;

  return (
    <>
      <AppLayout>
        <div className="max-w-6xl mx-auto space-y-8">
          <TrialBanner />
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="font-heading text-2xl lg:text-3xl font-bold flex items-center gap-2 flex-wrap">
                Welcome back, {firstName}! 👋
                {isFoundingMember && <FoundingMemberBadge />}
              </h1>
              <p className="text-muted-foreground text-sm mt-1">Here's your financial progress overview.</p>
            </div>
            <div className="flex gap-2">
              <Button asChild size="sm">
                <Link to="/record-payment"><DollarSign className="w-4 h-4 mr-1" />Record Payment</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link to="/add-debt"><Plus className="w-4 h-4 mr-1" />Add Debt</Link>
              </Button>
            </div>
          </div>

          {!isLoading && !hasDebts ? (
            <Card>
              <CardContent className="p-10 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                  <Plus className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h2 className="font-heading text-xl font-bold">Start Your Debt-Free Journey</h2>
                  <p className="text-muted-foreground text-sm mt-2 max-w-md mx-auto">
                    Add your first debt to see your dashboard come to life with progress tracking, projections, and milestones.
                  </p>
                </div>
                <Button asChild size="lg">
                  <Link to="/add-debt"><Plus className="w-4 h-4 mr-2" />Add Your First Debt</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <DashboardHero
                overallProgress={overallProgress}
                totalPaid={totalPaid}
                totalOriginal={totalOriginal}
                currency={defaultCurrency}
              />

              <DashboardStats
                totalBalance={totalBalance}
                totalMinPayment={totalMinPayment}
                activeCount={activeDebts.length}
                paidOffCount={paidOffCount}
                overallProgress={overallProgress}
                totalPaid={totalPaid}
                journeyProgress={journeyProgress}
                currentStreak={currentStreak}
                debtFreeDate={debtFreeDate}
                currency={defaultCurrency}
                isLoading={isLoading}
              />

              <DashboardNextSteps
                nextDebt={nextDebt}
                nextMilestonePercent={nextMilestonePercent}
                journeyProgress={journeyProgress}
                monthlyFreedom={totalMinPayment}
                currency={defaultCurrency}
                isFree={isFree}
              />

              <DashboardDebts
                debts={debts}
                defaultCurrency={defaultCurrency}
                isLoading={isLoading}
              />
            </>
          )}
        </div>
      </AppLayout>

      <CelebrationModal
        open={celebration.open}
        onOpenChange={closeCelebration}
        emoji={celebration.emoji}
        title={celebration.title}
        message={celebration.message}
        level={celebration.level}
      />
    </>
  );
}
