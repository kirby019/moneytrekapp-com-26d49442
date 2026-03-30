import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDemo } from "@/contexts/DemoContext";
import DemoBanner from "@/components/DemoBanner";
import DashboardHero from "@/components/dashboard/DashboardHero";
import DashboardStats from "@/components/dashboard/DashboardStats";
import DashboardDebts from "@/components/dashboard/DashboardDebts";
import DashboardNextSteps from "@/components/dashboard/DashboardNextSteps";
import AppLayout from "@/components/AppLayout";
import { DEMO_DEBTS, getDemoStats } from "@/lib/demoData";

export default function DemoDashboard() {
  const { isDemo, enterDemo } = useDemo();
  const navigate = useNavigate();

  // Auto-enter demo mode when visiting this page
  useEffect(() => {
    if (!isDemo) enterDemo();
  }, [isDemo, enterDemo]);

  const stats = getDemoStats();

  const nextDebt = {
    debt_name: DEMO_DEBTS[0].debt_name,
    current_balance: DEMO_DEBTS[0].current_balance,
    currency: "USD",
  };

  return (
    <>
      <DemoBanner />
      <AppLayout>
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="font-heading text-2xl lg:text-3xl font-bold">
                Welcome, Demo User! 👋
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                This is sample data showing how MoneyTrek works.
              </p>
            </div>
          </div>

          <DashboardHero
            overallProgress={stats.overallProgress}
            totalPaid={stats.totalPaid}
            totalOriginal={stats.totalOriginal}
            currency={stats.currency}
          />

          <DashboardStats
            totalBalance={stats.totalBalance}
            totalMinPayment={stats.totalMinPayment}
            activeCount={stats.activeCount}
            paidOffCount={stats.paidOffCount}
            overallProgress={stats.overallProgress}
            totalPaid={stats.totalPaid}
            journeyProgress={stats.journeyProgress}
            currentStreak={stats.currentStreak}
            debtFreeDate={stats.debtFreeDate}
            currency={stats.currency}
            isLoading={false}
          />

          <DashboardNextSteps
            nextDebt={nextDebt}
            nextMilestonePercent={50}
            journeyProgress={stats.journeyProgress}
            monthlyFreedom={stats.totalMinPayment}
            currency={stats.currency}
            isFree={false}
          />

          <DashboardDebts
            debts={DEMO_DEBTS as any}
            defaultCurrency={stats.currency}
            isLoading={false}
          />
        </div>
      </AppLayout>
    </>
  );
}
