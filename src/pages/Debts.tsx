import { useState } from "react";
import { CreditCard, Plus, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { useDebts } from "@/hooks/useDebts";
import { useProfile } from "@/hooks/useProfile";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/currency";
import EditDebtDialog from "@/components/EditDebtDialog";
import ConfirmDialog from "@/components/ConfirmDialog";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function Debts() {
  const { data: debts, isLoading } = useDebts();
  const { data: profile } = useProfile();
  const defaultCurrency = (profile as any)?.default_currency ?? "USD";
  const queryClient = useQueryClient();

  const [editDebt, setEditDebt] = useState<any>(null);
  const [deleteDebt, setDeleteDebt] = useState<any>(null);
  const [deleting, setDeleting] = useState(false);

  const active = debts?.filter(d => d.status !== "paid").length ?? 0;
  const paid = debts?.filter(d => d.status === "paid").length ?? 0;

  const handleDelete = async () => {
    if (!deleteDebt) return;
    setDeleting(true);
    try {
      const { error } = await supabase.from("debts").delete().eq("id", deleteDebt.id);
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ["debts"] });
      toast.success("Debt deleted");
      setDeleteDebt(null);
    } catch (e: any) {
      toast.error(e.message || "Failed to delete");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-heading text-2xl font-bold">All Debts</h1>
            <p className="text-sm text-muted-foreground mt-1">{active} active, {paid} paid off</p>
          </div>
          <Button asChild><Link to="/add-debt"><Plus className="w-4 h-4 mr-2" />Add Debt</Link></Button>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-28 w-full rounded-xl" />)}
          </div>
        ) : debts && debts.length > 0 ? (
          <div className="space-y-3">
            {debts.map(debt => {
              const orig = debt.original_amount ?? 0;
              const bal = debt.current_balance ?? 0;
              const progress = orig > 0 ? Math.round(((orig - bal) / orig) * 100) : 0;
              const isPaid = debt.status === "paid";
              const cur = (debt as any).currency ?? defaultCurrency;
              return (
                <Card key={debt.id} className={isPaid ? "opacity-60" : ""}>
                  <CardContent className="p-4 sm:p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0 hidden sm:flex">
                        <CreditCard className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold truncate">{debt.debt_name}</p>
                          {isPaid && <Badge variant="secondary" className="bg-success/10 text-success text-xs">Paid Off!</Badge>}
                        </div>
                        {(debt as any).debt_type && (
                          <p className="text-xs text-muted-foreground mb-0.5">{(debt as any).debt_type}</p>
                        )}
                        <p className="text-xs text-muted-foreground">{debt.interest_rate ?? 0}% APR · {cur}</p>
                        <div className="mt-2">
                          <Progress value={progress} className="h-2" />
                        </div>
                        <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                          <span>{isPaid ? "Fully paid" : `${formatCurrency(bal, cur)} of ${formatCurrency(orig, cur)}`}</span>
                          <span>{progress}%</span>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <Button size="icon" variant="ghost" onClick={() => setEditDebt(debt)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => setDeleteDebt(debt)} className="text-destructive hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        {!isPaid && (
                          <Button size="sm" asChild>
                            <Link to="/record-payment">Pay</Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground mb-4">No debts added yet.</p>
              <Button asChild><Link to="/add-debt"><Plus className="w-4 h-4 mr-2" />Add Your First Debt</Link></Button>
            </CardContent>
          </Card>
        )}
      </div>

      <EditDebtDialog debt={editDebt} open={!!editDebt} onOpenChange={(o) => !o && setEditDebt(null)} />
      <ConfirmDialog
        open={!!deleteDebt}
        onOpenChange={(o) => !o && setDeleteDebt(null)}
        title="Delete Debt"
        description={`Are you sure you want to delete "${deleteDebt?.debt_name}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </AppLayout>
  );
}
