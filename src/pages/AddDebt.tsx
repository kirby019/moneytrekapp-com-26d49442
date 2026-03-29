import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AppLayout from "@/components/AppLayout";
import { toast } from "sonner";
import { useAddDebt } from "@/hooks/useDebts";
import { useProfile } from "@/hooks/useProfile";
import CurrencySelector from "@/components/CurrencySelector";
import UpgradePrompt from "@/components/UpgradePrompt";
import { useCanAddDebt, useFeatureAccess } from "@/hooks/useSubscription";

export default function AddDebt() {
  const navigate = useNavigate();
  const addDebt = useAddDebt();
  const { data: profile } = useProfile();
  const defaultCurrency = (profile as any)?.default_currency ?? "USD";
  const { canAdd, remaining, maxDebts, isFree } = useCanAddDebt();
  const { hasAccess: hasMultiCurrency } = useFeatureAccess("multiCurrency");

  const [form, setForm] = useState({ name: "", type: "", balance: "", rate: "", minPayment: "" });
  const [currency, setCurrency] = useState<string | null>(null);

  // Use per-debt currency if set, otherwise default from profile
  const activeCurrency = hasMultiCurrency ? (currency ?? defaultCurrency) : defaultCurrency;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDebt.mutateAsync({
        debt_name: form.name,
        original_amount: parseFloat(form.balance),
        current_balance: parseFloat(form.balance),
        interest_rate: parseFloat(form.rate),
        minimum_payment: parseFloat(form.minPayment),
        status: "active",
        currency: activeCurrency,
      });
      toast.success("Debt added successfully!");
      navigate("/debts");
    } catch (error: any) {
      toast.error(error.message || "Failed to add debt");
    }
  };

  return (
    <AppLayout>
      <div className="max-w-lg mx-auto">
        <h1 className="font-heading text-2xl font-bold mb-6">Add New Debt</h1>
        {!canAdd ? (
          <UpgradePrompt
            title="Debt Limit Reached"
            message={`Free plan supports up to ${maxDebts} debts. Upgrade to Pro for unlimited debts.`}
          />
        ) : (
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
              <div className="space-y-2">
                <Label>Currency</Label>
                <CurrencySelector value={activeCurrency} onValueChange={setCurrency} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="balance">Current Balance</Label>
                  <Input id="balance" type="number" step="0.01" placeholder="0.00" value={form.balance} onChange={e => setForm({ ...form, balance: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rate">Interest Rate (%)</Label>
                  <Input id="rate" type="number" step="0.01" placeholder="0.00" value={form.rate} onChange={e => setForm({ ...form, rate: e.target.value })} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="minPayment">Minimum Payment</Label>
                <Input id="minPayment" type="number" step="0.01" placeholder="0.00" value={form.minPayment} onChange={e => setForm({ ...form, minPayment: e.target.value })} required />
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="submit" className="flex-1" disabled={addDebt.isPending}>
                  {addDebt.isPending ? "Adding…" : "Add Debt"}
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate("/debts")}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
        )}
      </div>
    </AppLayout>
  );
}
