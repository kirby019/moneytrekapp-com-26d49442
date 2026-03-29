import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { ArrowRight, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/currency";

interface Debt {
  id: string;
  debt_name: string | null;
  original_amount: number | null;
  current_balance: number | null;
  interest_rate: number | null;
  currency?: string | null;
  status: string | null;
}

interface Props {
  debts: Debt[] | undefined;
  defaultCurrency: string;
  isLoading: boolean;
}

export default function DashboardDebts({ debts, defaultCurrency, isLoading }: Props) {
  return (
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
  );
}
