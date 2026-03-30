import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, ArrowRight, Check, Heart, UserCheck, Zap, CreditCard, DollarSign, BarChart3, Trophy, PartyPopper } from "lucide-react";
import CurrencySelector from "@/components/CurrencySelector";
import { useUpdateProfile } from "@/hooks/useProfile";
import { useAddDebt } from "@/hooks/useDebts";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";

const steps = ["How It Works", "Welcome", "Why", "Identity", "Journey", "Currency", "First Debt", "Done"];

const HOW_STEPS = [
  { icon: CreditCard, title: "Add Your Debts", desc: "Enter your debts with balances and interest rates." },
  { icon: DollarSign, title: "Record Your Payments", desc: "Log payments and watch balances update automatically." },
  { icon: BarChart3, title: "Track Your Progress", desc: "See charts, stats, and your overall financial progress." },
  { icon: Trophy, title: "Reach Milestones", desc: "Earn badges at 10%, 25%, 50%, 75%, and 100%." },
  { icon: PartyPopper, title: "Become Debt Free", desc: "Complete your journey to financial freedom!" },
];

const REASONS = [
  { id: "freedom", label: "Financial Freedom", desc: "I want to live without debt stress" },
  { id: "stress", label: "Reduce Stress", desc: "Debt is causing me anxiety" },
  { id: "goal", label: "Save for a Goal", desc: "I want to save for something important" },
  { id: "example", label: "Set a Good Example", desc: "I want to model good financial habits" },
];

const IDENTITIES = [
  { id: "debt-destroyer", label: "Debt Destroyer", desc: "I attack debt aggressively" },
  { id: "freedom-fighter", label: "Freedom Fighter", desc: "I'm fighting for financial independence" },
  { id: "money-master", label: "Money Master", desc: "I'm taking control of my finances" },
  { id: "budget-boss", label: "Budget Boss", desc: "I manage every dollar with purpose" },
];

const JOURNEY_TYPES = [
  { id: "aggressive", label: "Aggressive", icon: Zap, desc: "Pay off debt as fast as possible" },
  { id: "steady", label: "Steady", icon: ArrowRight, desc: "Balanced approach with consistent payments" },
  { id: "gentle", label: "Gentle", icon: Heart, desc: "Minimum payments, slow and steady wins" },
];

export default function Onboarding() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const updateProfile = useUpdateProfile();
  const addDebt = useAddDebt();
  const [step, setStep] = useState(0);
  const [reason, setReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [identity, setIdentity] = useState("");
  const [journeyType, setJourneyType] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [debt, setDebt] = useState({ name: "", balance: "", rate: "", minPayment: "" });
  const [saving, setSaving] = useState(false);

  const handleCurrencySave = async () => {
    setSaving(true);
    try {
      await updateProfile.mutateAsync({ default_currency: currency });
      setStep(6);
    } catch {
      toast.error("Failed to save currency");
    } finally {
      setSaving(false);
    }
  };

  const saveUserData = async () => {
    await supabase.from("users").upsert({
      id: user!.id,
      reason: reason === "custom" ? customReason : reason,
      identity,
      journey_type: journeyType,
    }, { onConflict: "id" });
  };

  const saveJourneyBaseline = async () => {
    const { data: existingDebts } = await supabase
      .from("debts")
      .select("current_balance")
      .eq("user_id", user!.id)
      .neq("status", "paid");

    const totalStartingDebt = existingDebts?.reduce((s, d) => s + (d.current_balance ?? 0), 0) ?? 0;
    const today = new Date().toISOString().split("T")[0];

    await supabase.from("users").upsert({
      id: user!.id,
      journey_start_date: today,
      journey_starting_debt: totalStartingDebt,
    }, { onConflict: "id" });

    queryClient.invalidateQueries({ queryKey: ["onboarding-status"] });
    queryClient.invalidateQueries({ queryKey: ["user-journey"] });
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
      await saveJourneyBaseline();
      setStep(7);
    } catch {
      toast.error("Failed to add debt");
    } finally {
      setSaving(false);
    }
  };

  const handleSkipDebt = async () => {
    setSaving(true);
    try {
      await saveJourneyBaseline();
      setStep(7);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const canAddDebt = debt.name && debt.balance && debt.rate && debt.minPayment;

  const slideProps = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

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
            <motion.div key="how-it-works" {...slideProps}>
              <Card>
                <CardContent className="p-6 sm:p-8 space-y-6">
                  <div className="text-center">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                      <Sparkles className="w-7 h-7 text-primary" />
                    </div>
                    <h1 className="font-heading text-2xl font-bold">How MoneyTrek Works</h1>
                    <p className="text-muted-foreground text-sm mt-1">Five simple steps to financial freedom.</p>
                  </div>
                  <div className="space-y-2">
                    {HOW_STEPS.map((s, i) => (
                      <div key={s.title} className="flex items-center gap-3 p-2.5 rounded-lg border border-border">
                        <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <s.icon className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{s.title}</p>
                          <p className="text-xs text-muted-foreground">{s.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button onClick={() => setStep(1)} className="w-full">
                    Got It! Let's Go <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="welcome" {...slideProps}>
              <Card>
                <CardContent className="p-8 text-center space-y-6">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                    <Sparkles className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h1 className="font-heading text-2xl font-bold">Welcome to MoneyTrek! 🎉</h1>
                    <p className="text-muted-foreground mt-2">Let's set up your financial progress journey in just a few steps.</p>
                  </div>
                  <Button onClick={() => setStep(2)} className="w-full">
                    Get Started <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="reason" {...slideProps}>
              <Card>
                <CardContent className="p-6 sm:p-8 space-y-6">
                  <div>
                    <h2 className="font-heading text-xl font-bold">Why do you want to be debt free?</h2>
                    <p className="text-muted-foreground text-sm mt-1">This helps us personalize your experience.</p>
                  </div>
                  <div className="space-y-2">
                    {REASONS.map(r => (
                      <button
                        key={r.id}
                        onClick={() => setReason(r.id)}
                        className={cn(
                          "w-full text-left p-3 rounded-lg border transition-all",
                          reason === r.id ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:border-primary/50"
                        )}
                      >
                        <p className="font-medium text-sm">{r.label}</p>
                        <p className="text-xs text-muted-foreground">{r.desc}</p>
                      </button>
                    ))}
                    <button
                      onClick={() => setReason("custom")}
                      className={cn(
                        "w-full text-left p-3 rounded-lg border transition-all",
                        reason === "custom" ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:border-primary/50"
                      )}
                    >
                      <p className="font-medium text-sm">Other</p>
                    </button>
                    {reason === "custom" && (
                      <Input
                        placeholder="Tell us your reason..."
                        value={customReason}
                        onChange={e => setCustomReason(e.target.value)}
                        className="mt-2"
                      />
                    )}
                  </div>
                  <Button
                    onClick={() => setStep(2)}
                    disabled={!reason || (reason === "custom" && !customReason)}
                    className="w-full"
                  >
                    Continue <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="identity" {...slideProps}>
              <Card>
                <CardContent className="p-6 sm:p-8 space-y-6">
                  <div>
                    <h2 className="font-heading text-xl font-bold">Who do you want to become?</h2>
                    <p className="text-muted-foreground text-sm mt-1">Choose the identity that resonates with you.</p>
                  </div>
                  <div className="space-y-2">
                    {IDENTITIES.map(id => (
                      <button
                        key={id.id}
                        onClick={() => setIdentity(id.id)}
                        className={cn(
                          "w-full text-left p-3 rounded-lg border transition-all",
                          identity === id.id ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:border-primary/50"
                        )}
                      >
                        <p className="font-medium text-sm">{id.label}</p>
                        <p className="text-xs text-muted-foreground">{id.desc}</p>
                      </button>
                    ))}
                  </div>
                  <Button onClick={() => setStep(3)} disabled={!identity} className="w-full">
                    Continue <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="journey-type" {...slideProps}>
              <Card>
                <CardContent className="p-6 sm:p-8 space-y-6">
                  <div>
                    <h2 className="font-heading text-xl font-bold">Choose your pace</h2>
                    <p className="text-muted-foreground text-sm mt-1">How do you want to tackle your debt?</p>
                  </div>
                  <div className="space-y-2">
                    {JOURNEY_TYPES.map(jt => (
                      <button
                        key={jt.id}
                        onClick={() => setJourneyType(jt.id)}
                        className={cn(
                          "w-full text-left p-4 rounded-lg border transition-all flex items-center gap-3",
                          journeyType === jt.id ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:border-primary/50"
                        )}
                      >
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <jt.icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{jt.label}</p>
                          <p className="text-xs text-muted-foreground">{jt.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                  <Button
                    onClick={async () => {
                      await saveUserData();
                      setStep(4);
                    }}
                    disabled={!journeyType}
                    className="w-full"
                  >
                    Continue <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="currency" {...slideProps}>
              <Card>
                <CardContent className="p-6 sm:p-8 space-y-6">
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

          {step === 5 && (
            <motion.div key="debt" {...slideProps}>
              <Card>
                <CardContent className="p-6 sm:p-8 space-y-5">
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
                    <Button variant="ghost" onClick={handleSkipDebt} disabled={saving}>Skip</Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 6 && (
            <motion.div key="done" {...slideProps}>
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
