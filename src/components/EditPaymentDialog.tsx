import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface EditPaymentDialogProps {
  payment: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditPaymentDialog({ payment, open, onOpenChange }: EditPaymentDialogProps) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    amount: "",
    payment_date: "",
    is_extra_payment: false,
    notes: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (payment) {
      setForm({
        amount: String(payment.amount ?? ""),
        payment_date: payment.payment_date ?? "",
        is_extra_payment: payment.is_extra_payment ?? false,
        notes: payment.notes ?? "",
      });
    }
  }, [payment]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("payments")
        .update({
          amount: parseFloat(form.amount),
          payment_date: form.payment_date,
          is_extra_payment: form.is_extra_payment,
          notes: form.notes || null,
        })
        .eq("id", payment.id);
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["debts"] });
      toast.success("Payment updated!");
      onOpenChange(false);
    } catch (e: any) {
      toast.error(e.message || "Failed to update payment");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Payment</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Amount</Label>
            <Input type="number" step="0.01" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Payment Date</Label>
            <Input type="date" value={form.payment_date} onChange={e => setForm({ ...form, payment_date: e.target.value })} />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="edit-extra" checked={form.is_extra_payment} onCheckedChange={(c) => setForm({ ...form, is_extra_payment: c === true })} />
            <Label htmlFor="edit-extra" className="text-sm">Extra payment</Label>
          </div>
          <div className="space-y-2">
            <Label>Notes</Label>
            <Input value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Optional notes" />
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
