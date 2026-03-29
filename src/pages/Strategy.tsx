import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Target, TrendingDown, Zap, Loader2 } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { cn } from "@/lib/utils";
import { useDebts } from "@/hooks/useDebts";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { formatCurrency } from "@/lib/currency";
import { toast } from "sonner";

type StrategyId = "snowball" | "avalanche";

const strategyInfo = [
  {
    id: "snowball" as StrategyId,
    name: "Debt Snowball",
    icon: TrendingDown,
    desc: "Pay off smallest balances first for quick wins and motivation.",
    pros: ["Quick wins boost motivation", "Simpler to follow", "Psychological momentum"],
  },
  {
    id: "avalanche" as StrategyId,
    name: "Debt Avalanche",
    icon: Zap,
    desc: "Pay off highest interest rates first to save the most money.",
    pros: ["Saves most on interest", "Mathematically optimal", "Faster total payoff"],
  },
];

function sortDebts(debts: any[], strategy: StrategyId) {
  const active = debts.filter((d) => d.status !== "paid");
  if (strategy === "snowball") {
    return [...active].sort((a, b) => (a.current_balance ?? 0) - (b.current_balance ?? 0));
  }
  return [...active].sort((a, b) => (b.interest_rate ?? 0) - (a.interest_rate ?? 0));
}

export default function Strategy() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: debts, isLoading: debtsLoading } = useDebts();

  const { data: userRow } = useQuery({
    queryKey: ["user-strategy", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("users")
        .select("selected_strategy")
        .eq("id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const [selected, setSelected] = useState<StrategyId>("snowball");

  useEffect(() => {
    if (userRow?.selected_strategy === "avalanche" || userRow?.selected_strategy === "snowball") {
      setSelected(userRow.selected_strategy as StrategyId);
    }
  }, [userRow]);

  const saveMutation = useMutation({
    mutationFn: async (strategy: StrategyId) => {
      const { error } = await supabase
        .from("users")
        .upsert({ id: user!.id, selected_strategy: strategy }, { onConflict: "id" });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-strategy"] });
      toast.success("Strategy saved!");
    },
    onError: (e: any) => toast.error(e.message || "Failed to save strategy"),
  });

  const handleSelect = (id: StrategyId) => {
    setSelected(id);
    saveMutation.mutate(id);
  };

  const activeDebts = debts?.filter((d) => d.status !== "paid") ?? [];
  const sortedDebts = debts ? sortDebts(debts, selected) : [];

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-bold">Payoff Strategy</h1>
          <p className="text-sm text-muted-foreground mt-1">Choose the approach that works best for you.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {strategyInfo.map((s) => (
            <Card
              key={s.id}
              className={cn(
                "cursor-pointer transition-all",
                selected === s.id ? "ring-2 ring-primary shadow-md" : "hover:shadow-sm"
              )}
              onClick={() => handleSelect(s.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <s.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-heading font-semibold">{s.name}</p>
                    {selected === s.id && (
                      <Badge className="mt-1 bg-primary text-primary-foreground text-xs">
                        {saveMutation.isPending ? (
                          <Loader2 className="w-3 h-3 animate-spin mr-1" />
                        ) : null}
                        Active
                      </Badge>
                    )}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{s.desc}</p>
                <div className="space-y-1">
                  {s.pros.map((p) => (
                    <p key={p} className="text-xs text-muted-foreground flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-success flex-shrink-0" /> {p}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardContent className="p-6">
            <h2 className="font-heading font-semibold mb-4 flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" />
              Payoff Order ({strategyInfo.find((s) => s.id === selected)?.name})
            </h2>
            {debtsLoading ? (
              <div className="flex items-center gap-2 text-muted-foreground text-sm py-4">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading debts…
              </div>
            ) : sortedDebts.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">
                No active debts yet. Add a debt to see your recommended payoff order.
              </p>
            ) : (
              <div className="space-y-2">
                {sortedDebts.map((debt, i) => {
                  const cur = debt.currency ?? "USD";
                  const sortVal =
                    selected === "snowball"
                      ? formatCurrency(debt.current_balance ?? 0, cur)
                      : `${debt.interest_rate ?? 0}% APR`;
                  return (
                    <div key={debt.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                      <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                        {i + 1}
                      </span>
                      <span className="text-sm font-medium flex-1 truncate">{debt.debt_name}</span>
                      <span className="text-xs text-muted-foreground">{sortVal}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
