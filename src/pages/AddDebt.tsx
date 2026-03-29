import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AppLayout from "@/components/AppLayout";
import { toast } from "sonner";

export default function AddDebt() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", type: "", balance: "", rate: "", minPayment: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Debt added successfully!");
    navigate("/debts");
  };

  return (
    <AppLayout>
      <div className="max-w-lg mx-auto">
        <h1 className="font-heading text-2xl font-bold mb-6">Add New Debt</h1>
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name">Debt Name</Label>
                <Input id="name" placeholder="e.g., Chase Visa" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Debt Type</Label>
                <Select value={form.type} onValueChange={v => setForm({ ...form, type: v })}>
                  <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="credit-card">Credit Card</SelectItem>
                    <SelectItem value="student-loan">Student Loan</SelectItem>
                    <SelectItem value="auto-loan">Auto Loan</SelectItem>
                    <SelectItem value="mortgage">Mortgage</SelectItem>
                    <SelectItem value="personal-loan">Personal Loan</SelectItem>
                    <SelectItem value="medical">Medical</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="balance">Current Balance ($)</Label>
                  <Input id="balance" type="number" placeholder="0.00" value={form.balance} onChange={e => setForm({ ...form, balance: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rate">Interest Rate (%)</Label>
                  <Input id="rate" type="number" step="0.01" placeholder="0.00" value={form.rate} onChange={e => setForm({ ...form, rate: e.target.value })} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="minPayment">Minimum Payment ($)</Label>
                <Input id="minPayment" type="number" placeholder="0.00" value={form.minPayment} onChange={e => setForm({ ...form, minPayment: e.target.value })} required />
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="submit" className="flex-1">Add Debt</Button>
                <Button type="button" variant="outline" onClick={() => navigate("/debts")}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
