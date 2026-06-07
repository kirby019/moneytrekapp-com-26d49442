import { useState } from "react";
import { Landmark, Camera, Trash2, TrendingUp, TrendingDown, Minus, CreditCard, PiggyBank } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/currency";
import ConfirmDialog from "@/components/ConfirmDialog";
import { useProfile } from "@/hooks/useProfile";
import { useDebts } from "@/hooks/useDebts";
import { useSavingsAccounts } from "@/hooks/useSavings";
import { useNetWorthSnapshots, useTakeNetWorthSnapshot, useDeleteNetWorthSnapshot } from "@/hooks/useNetWorth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function NetWorth() {
  const { data: profile } = useProfile();
  const { data: debts, isLoading: debtsLoading } = useDebts();
  const { data: savings, isLoading: savingsLoading } = useSavingsAccounts();
  const { data: snapshots, isLoading: snapshotsLoading } = useNetWorthSnapshots();

  const takeSnapshot = useTakeNetWorthSnapshot();
  const deleteSnapshot = useDeleteNetWorthSnapshot();

  const defaultCurrency = (profile as any)?.default_currency ?? "USD";

  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [deleting, setDeleting] = useState(false);
  const [takingSnapshot, setTakingSnapshot] = useState(false);

  const isLoading = debtsLoading || savingsLoading;

  // Calculate live totals
  const totalAssets = savings?.reduce((s, a) => s + (a.balance ?? 0), 0) ?? 0;
  const totalLiabilities = debts
    ?.filter(d => d.status !== "paid")
    .reduce((s, d) => s + (d.current_balance ?? 0), 0) ?? 0;
  const netWorth = totalAssets - totalLiabilities;

  // Net worth trend (compare to most recent snapshot)
  const latestSnapshot = snapshots?.[0];
  const trendValue = latestSnapshot ? netWorth - latestSnapshot.net_worth : null;

  const handleTakeSnapshot = async () => {
    setTakingSnapshot(true);
    try {
      await takeSnapshot.mutateAsync({
        total_savings: totalAssets,
        total_debt: totalLiabilities,
        net_worth: netWorth,
      });
      toast.success("Net worth snapshot saved! 📸");
    } catch {
      toast.error("Failed to save snapshot. Please try again.");
    } finally {
      setTakingSnapshot(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteSnapshot.mutateAsync(deleteTarget.id);
      toast.success("Snapshot deleted");
      setDeleteTarget(null);
    } catch {
      toast.error("Failed to delete snapshot.");
    } finally {
      setDeleting(false);
    }
  };

  const netWorthColor = netWorth >= 0 ? "text-green-600" : "text-red-500";
  const netWorthBg = netWorth >= 0 ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200";

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-heading text-2xl font-bold">Net Worth</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Assets minus liabilities — your real financial picture
            </p>
          </div>
          <Button onClick={handleTakeSnapshot} disabled={takingSnapshot || isLoading} variant="outline">
            <Camera className="w-4 h-4 mr-2" />
            {takingSnapshot ? "Saving…" : "Save Snapshot"}
          </Button>
        </div>

        {/* Net Worth Card */}
        {isLoading ? (
          <Skeleton className="h-36 w-full rounded-xl" />
        ) : (
          <Card className={cn("border-2", netWorthBg)}>
            <CardContent className="p-6 text-center">
              <p className="text-sm text-muted-foreground mb-1">Current Net Worth</p>
              <p className={cn("font-heading text-4xl font-extrabold", netWorthColor)}>
                {netWorth >= 0 ? "" : "-"}{formatCurrency(Math.abs(netWorth), defaultCurrency)}
              </p>
              {trendValue !== null && (
                <div className="flex items-center justify-center gap-1.5 mt-2">
                  {trendValue > 0 ? (
                    <><TrendingUp className="w-4 h-4 text-green-600" /><span className="text-sm text-green-600 font-medium">+{formatCurrency(trendValue, defaultCurrency)} since last snapshot</span></>
                  ) : trendValue < 0 ? (
                    <><TrendingDown className="w-4 h-4 text-red-500" /><span className="text-sm text-red-500 font-medium">{formatCurrency(trendValue, defaultCurrency)} since last snapshot</span></>
                  ) : (
                    <><Minus className="w-4 h-4 text-muted-foreground" /><span className="text-sm text-muted-foreground">No change since last snapshot</span></>
                  )}
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-3">
                Save a snapshot to track your net worth over time
              </p>
            </CardContent>
          </Card>
        )}

        {/* Assets vs Liabilities */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Assets */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2 text-green-600">
                <PiggyBank className="w-4 h-4" />
                Total Assets
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="font-heading text-2xl font-bold text-green-600">
                {formatCurrency(totalAssets, defaultCurrency)}
              </p>
              {savingsLoading ? (
                <Skeleton className="h-16 w-full" />
              ) : savings && savings.length > 0 ? (
                <div className="space-y-2">
                  {savings.map(account => (
                    <div key={account.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground truncate">{account.account_name}</span>
                      <span className="font-medium ml-2 flex-shrink-0">{formatCurrency(account.balance, account.currency)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No savings accounts yet</p>
              )}
            </CardContent>
          </Card>

          {/* Liabilities */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2 text-red-500">
                <CreditCard className="w-4 h-4" />
                Total Liabilities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="font-heading text-2xl font-bold text-red-500">
                {formatCurrency(totalLiabilities, defaultCurrency)}
              </p>
              {debtsLoading ? (
                <Skeleton className="h-16 w-full" />
              ) : debts && debts.filter(d => d.status !== "paid").length > 0 ? (
                <div className="space-y-2">
                  {debts.filter(d => d.status !== "paid").map(debt => (
                    <div key={debt.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground truncate">{debt.debt_name}</span>
                      <span className="font-medium ml-2 flex-shrink-0">{formatCurrency(debt.current_balance ?? 0, (debt as any).currency ?? defaultCurrency)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {debts && debts.length > 0 ? "🎉 All debts paid off!" : "No debts added yet"}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Snapshot History */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Landmark className="w-4 h-4" />
              Snapshot History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {snapshotsLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-12 w-full" />)}
              </div>
            ) : snapshots && snapshots.length > 0 ? (
              <div className="space-y-2">
                {snapshots.map((snap, index) => {
                  const prev = snapshots[index + 1];
                  const change = prev ? snap.net_worth - prev.net_worth : null;
                  return (
                    <div key={snap.id} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="text-sm font-medium">
                            {new Date(snap.snapshot_date).toLocaleDateString(undefined, {
                              year: "numeric", month: "short", day: "numeric"
                            })}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Assets {formatCurrency(snap.total_savings, defaultCurrency)} · Debts {formatCurrency(snap.total_debt, defaultCurrency)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className={cn("font-semibold text-sm", snap.net_worth >= 0 ? "text-green-600" : "text-red-500")}>
                            {snap.net_worth >= 0 ? "" : "-"}{formatCurrency(Math.abs(snap.net_worth), defaultCurrency)}
                          </p>
                          {change !== null && (
                            <p className={cn("text-xs", change > 0 ? "text-green-600" : change < 0 ? "text-red-500" : "text-muted-foreground")}>
                              {change > 0 ? "▲" : change < 0 ? "▼" : "—"} {formatCurrency(Math.abs(change), defaultCurrency)}
                            </p>
                          )}
                        </div>
                        <Button
                          size="icon" variant="ghost"
                          className="text-muted-foreground hover:text-destructive flex-shrink-0"
                          onClick={() => setDeleteTarget(snap)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6 space-y-2">
                <p className="text-sm text-muted-foreground">No snapshots yet.</p>
                <p className="text-xs text-muted-foreground">
                  Click <strong>"Save Snapshot"</strong> above to record your net worth today. Do it monthly to track your progress!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={o => !o && setDeleteTarget(null)}
        title="Delete Snapshot"
        description={`Delete the snapshot from ${deleteTarget ? new Date(deleteTarget.snapshot_date).toLocaleDateString() : ""}? This cannot be undone.`}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </AppLayout>
  );
}
