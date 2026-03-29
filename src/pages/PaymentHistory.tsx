import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { usePayments } from "@/hooks/usePayments";
import { Skeleton } from "@/components/ui/skeleton";

export default function PaymentHistory() {
  const { data: payments, isLoading } = usePayments();

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold">Payment History</h1>
            <p className="text-sm text-muted-foreground mt-1">{payments?.length ?? 0} payments recorded</p>
          </div>
          <Button asChild><Link to="/record-payment"><Plus className="w-4 h-4 mr-2" />Record Payment</Link></Button>
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
          </div>
        ) : payments && payments.length > 0 ? (
          <div className="space-y-2">
            {payments.map(p => (
              <Card key={p.id}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm">{(p as any).debts?.debt_name ?? "Unknown Debt"}</p>
                    <p className="text-xs text-muted-foreground">
                      {p.payment_date ? new Date(p.payment_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                    </p>
                    {p.notes && <p className="text-xs text-muted-foreground mt-0.5">{p.notes}</p>}
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={p.is_extra_payment ? "default" : "secondary"}>
                      {p.is_extra_payment ? "Extra" : "Minimum"}
                    </Badge>
                    <span className="font-heading font-bold">${(p.amount ?? 0).toLocaleString()}</span>
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
    </AppLayout>
  );
}
