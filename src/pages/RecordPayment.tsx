import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { toast } from "sonner";
import { useDebts } from "@/hooks/useDebts";
import { useAddPayment } from "@/hooks/usePayments";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/currency";
import { useCelebrations } from "@/hooks/useCelebrations";
import { useUpdateStreak } from "@/hooks/useStreak";
import CelebrationModal from "@/components/CelebrationModal";
import CharacterGuide from "@/components/CharacterGuide";
import TalkingCharacter from "@/components/TalkingCharacter";

export default function RecordPayment() {
  const navigate = useNavigate();
  const { data: debts, isLoading } = useDebts();
  const addPayment = useAddPayment();
  const updateStreak = useUpdateStreak();
  const [debtId, setDebtId] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [isExtra, setIsExtra] = useState(false);
  const [notes, setNotes] = useState("");

  const { celebration, closeCelebration, celebratePayment, celebrateDebtPayoff, checkStreakCelebration } = useCelebrations();

  const activeDebts = debts?.filter(d => d.status !== "paid") ?? [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addPayment.mutateAsync({
        debt_id: debtId,
        amount: parseFloat(amount),
        payment_date: date,
        is_extra_payment: isExtra,
        notes: notes || null,
      });

      celebratePayment(isExtra);

      try {
        const newStreak = await updateStreak.mutateAsync();
        checkStreakCelebration(newStreak);
      } catch {
        // Streak update failure shouldn't block the flow
      }

      const selectedDebt = debts?.find(d => d.id === debtId);
      if (selectedDebt) {
        const newBalance = (selectedDebt.current_balance ?? 0) - parseFloat(amount);
        if (newBalance <= 0) {
          setTimeout(() => {
            celebrateDebtPayoff(selectedDebt.debt_name ?? "Your debt");
          }, 500);
          return;
        }
      }

      navigate("/payment-history");
    } catch (error: any) {
      toast.error(error.message || "Failed to record payment");
    }
  };

  return (
    <AppLayout>
      <div className="max-w-lg mx-auto">
        <h1 className="font-heading text-2xl font-bold mb-6">Record Payment</h1>

        {!isLoading && activeDebts.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center space-y-4">
              <TalkingCharacter
                character="moneyTree"
                context="empty"
                animation="pulse"
                size="xl"
                bubblePosition="top"
                className="mx-auto"
              />
              <p className="text-muted-foreground">You don't have any active debts to make a payment on.</p>
              <Button asChild>
                <Link to="/add-debt"><Plus className="w-4 h-4 mr-2" />Add Your First Debt</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-end -mt-2 -mr-2 mb-2">
                <CharacterGuide character="moneyTree" context="payment" animation="float" />
              </div>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label>Select Debt</Label>
                  {isLoading ? (
                    <Skeleton className="h-10 w-full" />
                  ) : (
                    <Select value={debtId} onValueChange={setDebtId} required>
                      <SelectTrigger><SelectValue placeholder="Choose a debt" /></SelectTrigger>
                      <SelectContent>
                        {activeDebts.map(d => {
                          const cur = (d as any).currency ?? "USD";
                          return (
                            <SelectItem key={d.id} value={d.id}>
                              {d.debt_name} — {formatCurrency(d.current_balance ?? 0, cur)}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Payment Amount</Label>
                  <Input id="amount" type="number" step="0.01" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Payment Date</Label>
                  <Input id="date" type="date" value={date} onChange={e => setDate(e.target.value)} required />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="extra" checked={isExtra} onCheckedChange={(c) => setIsExtra(c === true)} />
                  <Label htmlFor="extra" className="text-sm">This is an extra payment (above minimum)</Label>
                </div>
                <div className="flex gap-3 pt-2">
                  <Button type="submit" className="flex-1" disabled={addPayment.isPending}>
                    {addPayment.isPending ? "Recording…" : "Record Payment"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>

      <CelebrationModal
        open={celebration.open}
        onOpenChange={(open) => {
          closeCelebration(open);
          if (!open) navigate("/payment-history");
        }}
        emoji={celebration.emoji}
        title={celebration.title}
        message={celebration.message}
        level={celebration.level}
      />
    </AppLayout>
  );
}
