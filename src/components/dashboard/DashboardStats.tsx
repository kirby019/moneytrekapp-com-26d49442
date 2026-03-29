import { motion } from "framer-motion";
import { TrendingDown, DollarSign, CreditCard, Target, Flame, Trophy, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/currency";
import { format } from "date-fns";

interface Props {
  totalBalance: number;
  totalMinPayment: number;
  activeCount: number;
  paidOffCount: number;
  overallProgress: number;
  totalPaid: number;
  journeyProgress: number;
  currentStreak: number;
  debtFreeDate: Date | null;
  currency: string;
  isLoading: boolean;
}

export default function DashboardStats({
  totalBalance, totalMinPayment, activeCount, paidOffCount,
  overallProgress, totalPaid, journeyProgress, currentStreak,
  debtFreeDate, currency, isLoading,
}: Props) {
  const stats = [
    { label: "Total Debt", value: formatCurrency(totalBalance, currency), icon: CreditCard, sub: `${activeCount} active` },
    { label: "Monthly Payment", value: formatCurrency(totalMinPayment, currency), icon: DollarSign, sub: "Minimums total" },
    { label: "Financial Progress", value: `${overallProgress}%`, icon: Target, sub: `${formatCurrency(totalPaid, currency)} paid` },
    { label: "Journey Progress", value: `${journeyProgress}%`, icon: TrendingDown, sub: paidOffCount > 0 ? `${paidOffCount} paid off` : "Keep going!" },
    { label: "Current Streak", value: `${currentStreak}`, icon: Flame, sub: currentStreak > 0 ? `${currentStreak} day${currentStreak !== 1 ? "s" : ""} active` : "Record a payment!" },
    { label: "Debt-Free Date", value: debtFreeDate ? format(debtFreeDate, "MMM yyyy") : "—", icon: Calendar, sub: debtFreeDate ? "Projected" : "Add debts" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      {stats.map((s, i) => (
        <motion.div key={s.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <s.icon className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className="text-xl font-heading font-bold">{isLoading ? <Skeleton className="h-6 w-16" /> : s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
              <p className="text-xs text-success font-medium mt-1">{s.sub}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
