import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus, DollarSign, Target, Trophy, Sparkles, Crown } from "lucide-react";
import { formatCurrency } from "@/lib/currency";
import { MILESTONE_CELEBRATIONS } from "@/lib/celebrations";

interface Props {
  nextDebt: { debt_name: string | null; current_balance: number | null; currency: string } | null;
  nextMilestonePercent: number | null;
  journeyProgress: number;
  monthlyFreedom: number;
  currency: string;
  isFree: boolean;
}

export default function DashboardNextSteps({ nextDebt, nextMilestonePercent, journeyProgress, monthlyFreedom, currency, isFree }: Props) {
  return (
    <div className="space-y-4">
      <h2 className="font-heading text-xl font-semibold">What's Next</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {/* Quick actions */}
        <Card>
          <CardContent className="p-5 space-y-3">
            <p className="text-sm font-semibold text-muted-foreground">Quick Actions</p>
            <div className="flex gap-2">
              <Button size="sm" asChild className="flex-1">
                <Link to="/record-payment"><DollarSign className="w-3 h-3 mr-1" />Record Payment</Link>
              </Button>
              <Button size="sm" variant="outline" asChild className="flex-1">
                <Link to="/add-debt"><Plus className="w-3 h-3 mr-1" />Add Debt</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recommended next debt */}
        {nextDebt && (
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-primary" />
                <p className="text-sm font-semibold text-muted-foreground">Focus On</p>
              </div>
              <p className="font-semibold truncate">{nextDebt.debt_name}</p>
              <p className="text-xs text-muted-foreground">{formatCurrency(nextDebt.current_balance ?? 0, nextDebt.currency)} remaining</p>
              <Button size="sm" variant="link" asChild className="px-0 mt-1">
                <Link to="/strategy">View Strategy →</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Next milestone */}
        {nextMilestonePercent !== null && (
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-4 h-4 text-accent" />
                <p className="text-sm font-semibold text-muted-foreground">Next Milestone</p>
              </div>
              <p className="font-semibold">{nextMilestonePercent}% Journey Progress</p>
              <p className="text-xs text-muted-foreground">{nextMilestonePercent - journeyProgress}% to go</p>
            </CardContent>
          </Card>
        )}

        {/* Future projection */}
        {monthlyFreedom > 0 && (
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <p className="text-sm font-semibold text-muted-foreground">After Debt Freedom</p>
              </div>
              <p className="font-semibold">{formatCurrency(monthlyFreedom, currency)}/mo</p>
              <p className="text-xs text-muted-foreground">Monthly savings potential</p>
              <Button size="sm" variant="link" asChild className="px-0 mt-1">
                <Link to="/future">See your future →</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Upgrade nudge */}
      {isFree && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="border-accent/30 bg-accent/5">
            <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                <Crown className="w-5 h-5 text-accent" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm">Unlock weekly reports, analytics & more</p>
                <p className="text-xs text-muted-foreground mt-0.5">Upgrade to Pro for advanced charts, CSV export, and financial goals.</p>
              </div>
              <Button size="sm" asChild>
                <Link to="/subscription">Upgrade</Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
