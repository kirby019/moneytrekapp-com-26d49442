import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import CurrencySelector from "@/components/CurrencySelector";
import { DEBT_TYPES } from "@/lib/debtTypes";

interface EditDebtDialogProps {
  debt: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditDebtDialog({ debt, open, onOpenChange }: EditDebtDialogProps) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    debt_name: "",
    debt_type: "Credit Card",
    current_balance: "",
    original_amount: "",
    interest_rate: "",
    minimum_payment: "",
    currency: "USD",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (debt) {
      setForm({
        debt_name: debt.debt_name ?? "",
        debt_type: debt.debt_type ?? "Credit Card",
        current_balance: String(debt.current_balance ?? ""),
        original_amount: String(debt.original_amount ?? ""),
        interest_rate: String(debt.interest_rate ?? ""),
        minimum_payment: String(debt.minimum_payment ?? ""),
        currency: debt.currency ?? "USD",
      });
    }
  }, [debt]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("debts")
        .update({
          debt_name: form.debt_name,
          debt_type: form.debt_type,
          current_balance: parseFloat(form.current_balance),
          original_amount: parseFloat(form.original_amount),
          interest_rate: parseFloat(form.interest_rate),
          minimum_payment: parseFloat(form.minimum_payment),
          currency: form.currency,
        })
        .eq("id", debt.id);
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ["debts"] });
      toast.success("Debt updated!");
      onOpenChange(false);
    } catch (e: any) {
      toast.error(e.message || "Failed to update debt");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Debt</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Debt Name</Label>
            <Input value={form.debt_name} onChange={e => setForm({ ...form, debt_name: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Debt Type</Label>
            <Select value={form.debt_type} onValueChange={v => setForm({ ...form, debt_type: v })}>
              <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
              <SelectContent>
                {DEBT_TYPES.map(t => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Currency</Label>
            <CurrencySelector value={form.currency} onValueChange={v => setForm({ ...form, currency: v })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Current Balance</Label>
              <Input type="number" step="0.01" value={form.current_balance} onChange={e => setForm({ ...form, current_balance: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Original Amount</Label>
              <Input type="number" step="0.01" value={form.original_amount} onChange={e => setForm({ ...form, original_amount: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Interest Rate (%)</Label>
              <Input type="number" step="0.01" value={form.interest_rate} onChange={e => setForm({ ...form, interest_rate: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Min Payment</Label>
              <Input type="number" step="0.01" value={form.minimum_payment} onChange={e => setForm({ ...form, minimum_payment: e.target.value })} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
