import { CreditCard, Plus, ArrowUpDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import AppLayout from "@/components/AppLayout";

const debts = [
  { id: 1, name: "Chase Visa", type: "Credit Card", balance: 4200, original: 8500, rate: 19.99, minPayment: 120, status: "active" },
  { id: 2, name: "Student Loan", type: "Student Loan", balance: 12500, original: 25000, rate: 5.5, minPayment: 280, status: "active" },
  { id: 3, name: "Car Loan", type: "Auto Loan", balance: 6150, original: 18000, rate: 4.2, minPayment: 350, status: "active" },
  { id: 4, name: "Medical Bill", type: "Medical", balance: 1500, original: 3200, rate: 0, minPayment: 140, status: "active" },
  { id: 5, name: "Best Buy Card", type: "Credit Card", balance: 0, original: 2100, rate: 22.99, minPayment: 0, status: "paid" },
];

export default function Debts() {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold">All Debts</h1>
            <p className="text-sm text-muted-foreground mt-1">{debts.filter(d => d.status === "active").length} active, {debts.filter(d => d.status === "paid").length} paid off</p>
          </div>
          <Button asChild><Link to="/add-debt"><Plus className="w-4 h-4 mr-2" />Add Debt</Link></Button>
        </div>

        <div className="space-y-3">
          {debts.map(debt => {
            const progress = Math.round(((debt.original - debt.balance) / debt.original) * 100);
            const paid = debt.status === "paid";
            return (
              <Card key={debt.id} className={paid ? "opacity-60" : ""}>
                <CardContent className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                      <CreditCard className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold">{debt.name}</p>
                        {paid && <Badge variant="secondary" className="bg-success/10 text-success text-xs">Paid Off!</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground">{debt.type} · {debt.rate}% APR</p>
                      <div className="mt-2">
                        <Progress value={progress} className="h-2" />
                      </div>
                      <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                        <span>{paid ? "Fully paid" : `$${debt.balance.toLocaleString()} of $${debt.original.toLocaleString()}`}</span>
                        <span>{progress}%</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {!paid && (
                        <Button size="sm" asChild>
                          <Link to={`/record-payment`}>Pay</Link>
                        </Button>
                      )}
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/debts`}>View</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
