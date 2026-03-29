import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, Download } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { usePayments } from "@/hooks/usePayments";
import { useProfile } from "@/hooks/useProfile";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/currency";
import EditPaymentDialog from "@/components/EditPaymentDialog";
import ConfirmDialog from "@/components/ConfirmDialog";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useFeatureAccess } from "@/hooks/useSubscription";
import { exportToCsv } from "@/lib/exportCsv";
import UpgradePrompt from "@/components/UpgradePrompt";

export default function PaymentHistory() {
  const { data: payments, isLoading } = usePayments();
  const { data: profile } = useProfile();
  const defaultCurrency = (profile as any)?.default_currency ?? "USD";
  const queryClient = useQueryClient();

  const { hasAccess: canExport } = useFeatureAccess("csvExport");
  const [editPayment, setEditPayment] = useState<any>(null);
  const [deletePayment, setDeletePayment] = useState<any>(null);
  const [deleting, setDeleting] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const handleExport = () => {
    if (!canExport) { setShowUpgrade(true); return; }
    if (!payments?.length) { toast.error("No payments to export"); return; }
    const headers = ["Date", "Debt", "Amount", "Type", "Notes"];
    const rows = payments.map(p => [
      p.payment_date ?? "",
      (p as any).debts?.debt_name ?? "Unknown",
      String(p.amount ?? 0),
      p.is_extra_payment ? "Extra" : "Minimum",
      p.notes ?? "",
    ]);
    exportToCsv("moneytrek-payments.csv", headers, rows);
    toast.success("Payments exported!");
  };

  const handleDelete = async () => {
    if (!deletePayment) return;
    setDeleting(true);
    try {
      const { error } = await supabase.from("payments").delete().eq("id", deletePayment.id);
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["debts"] });
      toast.success("Payment deleted");
      setDeletePayment(null);
    } catch (e: any) {
      toast.error(e.message || "Failed to delete");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-heading text-2xl font-bold">Payment History</h1>
            <p className="text-sm text-muted-foreground mt-1">{payments?.length ?? 0} payments recorded</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExport}><Download className="w-4 h-4 mr-2" />Export CSV</Button>
            <Button asChild><Link to="/record-payment"><Plus className="w-4 h-4 mr-2" />Record Payment</Link></Button>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
          </div>
        ) : payments && payments.length > 0 ? (
          <div className="space-y-2">
            {payments.map(p => (
              <Card key={p.id}>
                <CardContent className="p-4 flex items-center justify-between gap-3 flex-wrap">
                  <div className="min-w-0">
                    <p className="font-semibold text-sm truncate">{(p as any).debts?.debt_name ?? "Unknown Debt"}</p>
                    <p className="text-xs text-muted-foreground">
                      {p.payment_date ? new Date(p.payment_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                    </p>
                    {p.notes && <p className="text-xs text-muted-foreground mt-0.5">{p.notes}</p>}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge variant={p.is_extra_payment ? "default" : "secondary"}>
                      {p.is_extra_payment ? "Extra" : "Minimum"}
                    </Badge>
                    <span className="font-heading font-bold text-sm sm:text-base">{formatCurrency(p.amount ?? 0, defaultCurrency)}</span>
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setEditPayment(p)}>
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setDeletePayment(p)}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground mb-4">No payments recorded yet.</p>
              <Button asChild><Link to="/record-payment"><Plus className="w-4 h-4 mr-2" />Record Your First Payment</Link></Button>
            </CardContent>
          </Card>
        )}
      </div>

      <EditPaymentDialog payment={editPayment} open={!!editPayment} onOpenChange={(o) => !o && setEditPayment(null)} />
      <ConfirmDialog
        open={!!deletePayment}
        onOpenChange={(o) => !o && setDeletePayment(null)}
        title="Delete Payment"
        description="Are you sure you want to delete this payment? This action cannot be undone."
        onConfirm={handleDelete}
        loading={deleting}
      />
      {showUpgrade && (
        <UpgradePrompt feature="csvExport" open={showUpgrade} onOpenChange={setShowUpgrade} />
      )}
    </AppLayout>
  );
}
