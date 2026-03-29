import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AppLayout from "@/components/AppLayout";
import { toast } from "sonner";

export default function RecordPayment() {
  const navigate = useNavigate();
  const [debt, setDebt] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Payment recorded! 🎉");
    navigate("/payment-history");
  };

  return (
    <AppLayout>
      <div className="max-w-lg mx-auto">
        <h1 className="font-heading text-2xl font-bold mb-6">Record Payment</h1>
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label>Select Debt</Label>
                <Select value={debt} onValueChange={setDebt}>
                  <SelectTrigger><SelectValue placeholder="Choose a debt" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="chase-visa">Chase Visa — $4,200</SelectItem>
                    <SelectItem value="student-loan">Student Loan — $12,500</SelectItem>
                    <SelectItem value="car-loan">Car Loan — $6,150</SelectItem>
                    <SelectItem value="medical">Medical Bill — $1,500</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Payment Amount ($)</Label>
                <Input id="amount" type="number" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Payment Date</Label>
                <Input id="date" type="date" value={date} onChange={e => setDate(e.target.value)} required />
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="submit" className="flex-1">Record Payment</Button>
                <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
