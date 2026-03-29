import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, ArrowRight, Check } from "lucide-react";
import CurrencySelector from "@/components/CurrencySelector";
import { useUpdateProfile } from "@/hooks/useProfile";
import { useAddDebt } from "@/hooks/useDebts";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const steps = ["Welcome", "Currency", "First Debt", "Done"];

export default function Onboarding() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const updateProfile = useUpdateProfile();
  const addDebt = useAddDebt();
  const [step, setStep] = useState(0);
  const [currency, setCurrency] = useState("USD");
  const [debt, setDebt] = useState({ name: "", balance: "", rate: "", minPayment: "" });
  const [saving, setSaving] = useState(false);

  const handleCurrencySave = async () => {
    setSaving(true);
    try {
      await updateProfile.mutateAsync({ default_currency: currency });
      setStep(2);
    } catch {
      toast.error("Failed to save currency");
    } finally {
      setSaving(false);
    }
  };

  const saveJourneyBaseline = async (addedDebtBalance?: number) => {
    // Calculate total remaining debt including any just-added debt
    const { data: existingDebts } = await supabase
      .from("debts")
      .select("current_balance")
      .eq("user_id", user!.id)
      .eq("status", "active");
    
    const existingTotal = existingDebts?.reduce((s, d) => s + (d.current_balance ?? 0), 0) ?? 0;
    const totalStartingDebt = existingTotal + (addedDebtBalance ?? 0);
    const today = new Date().toISOString().split("T")[0];

    await supabase
      .from("users")
      .upsert({
        id: user!.id,
        journey_start_date: today,
        journey_starting_debt: totalStartingDebt,
      }, { onConflict: "id" });
  };

  const handleDebtSave = async () => {
    setSaving(true);
    try {
      const balance = parseFloat(debt.balance);
      await addDebt.mutateAsync({
        debt_name: debt.name,
        original_amount: balance,
        current_balance: balance,
        interest_rate: parseFloat(debt.rate),
        minimum_payment: parseFloat(debt.minPayment),
        status: "active",
        currency,
      });
      await saveJourneyBaseline(0); // debt already inserted, so existingTotal includes it
      setStep(3);
    } catch {
      toast.error("Failed to add debt");
    } finally {
      setSaving(false);
    }
  };

  const canAddDebt = debt.name && debt.balance && debt.rate && debt.minPayment;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i <= step ? "bg-primary w-8" : "bg-muted w-4"
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="welcome" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <Card>
                <CardContent className="p-8 text-center space-y-6">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                    <Sparkles className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h1 className="font-heading text-2xl font-bold">Welcome to Debt Free! 🎉</h1>
                    <p className="text-muted-foreground mt-2">Let's set up your account in just a few steps.</p>
                  </div>
                  <Button onClick={() => setStep(1)} className="w-full">
                    Get Started <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="currency" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <Card>
                <CardContent className="p-8 space-y-6">
                  <div>
                    <h2 className="font-heading text-xl font-bold">Choose Your Currency</h2>
                    <p className="text-muted-foreground text-sm mt-1">This will be your default currency for tracking debts.</p>
                  </div>
                  <CurrencySelector value={currency} onValueChange={setCurrency} />
                  <Button onClick={handleCurrencySave} disabled={saving} className="w-full">
                    {saving ? "Saving…" : "Continue"} <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="debt" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <Card>
                <CardContent className="p-8 space-y-5">
                  <div>
                    <h2 className="font-heading text-xl font-bold">Add Your First Debt</h2>
                    <p className="text-muted-foreground text-sm mt-1">Start by adding one debt. You can add more later.</p>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Debt Name</Label>
                      <Input placeholder="e.g., Chase Visa" value={debt.name} onChange={e => setDebt({ ...debt, name: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label>Balance</Label>
                        <Input type="number" step="0.01" placeholder="0.00" value={debt.balance} onChange={e => setDebt({ ...debt, balance: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label>Interest Rate (%)</Label>
                        <Input type="number" step="0.01" placeholder="0.00" value={debt.rate} onChange={e => setDebt({ ...debt, rate: e.target.value })} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Minimum Payment</Label>
                      <Input type="number" step="0.01" placeholder="0.00" value={debt.minPayment} onChange={e => setDebt({ ...debt, minPayment: e.target.value })} />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button onClick={handleDebtSave} disabled={saving || !canAddDebt} className="flex-1">
                      {saving ? "Adding…" : "Add Debt"}
                    </Button>
                    <Button variant="ghost" onClick={async () => { await saveJourneyBaseline(); setStep(3); }}>Skip</Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="done" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <Card>
                <CardContent className="p-8 text-center space-y-6">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <Check className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-heading text-2xl font-bold">You're All Set!</h2>
                    <p className="text-muted-foreground mt-2">Your debt-free journey starts now.</p>
                  </div>
                  <Button onClick={() => navigate("/dashboard")} className="w-full">
                    Go to Dashboard <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
