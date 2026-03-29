import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import AppLayout from "@/components/AppLayout";

const payments = [
  { id: 1, debt: "Chase Visa", amount: 250, date: "2025-03-25", type: "Extra" },
  { id: 2, debt: "Student Loan", amount: 280, date: "2025-03-20", type: "Minimum" },
  { id: 3, debt: "Car Loan", amount: 350, date: "2025-03-15", type: "Minimum" },
  { id: 4, debt: "Medical Bill", amount: 200, date: "2025-03-10", type: "Extra" },
  { id: 5, debt: "Chase Visa", amount: 120, date: "2025-03-01", type: "Minimum" },
  { id: 6, debt: "Best Buy Card", amount: 500, date: "2025-02-28", type: "Payoff!" },
];

export default function PaymentHistory() {
  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold">Payment History</h1>
            <p className="text-sm text-muted-foreground mt-1">{payments.length} payments recorded</p>
          </div>
          <Button asChild><Link to="/record-payment"><Plus className="w-4 h-4 mr-2" />Record Payment</Link></Button>
        </div>
        <div className="space-y-2">
          {payments.map(p => (
            <Card key={p.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm">{p.debt}</p>
                  <p className="text-xs text-muted-foreground">{new Date(p.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={p.type === "Payoff!" ? "default" : "secondary"} className={p.type === "Payoff!" ? "bg-success text-success-foreground" : ""}>
                    {p.type}
                  </Badge>
                  <span className="font-heading font-bold">${p.amount}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
