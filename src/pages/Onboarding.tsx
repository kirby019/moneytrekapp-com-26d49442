import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sparkles, ArrowRight, Check, Heart, Zap, CreditCard,
  DollarSign, BarChart3, Trophy, PiggyBank, TrendingUp,
} from "lucide-react";
import CurrencySelector from "@/components/CurrencySelector";
import TalkingCharacter from "@/components/TalkingCharacter";
import { useUpdateProfile } from "@/hooks/useProfile";
import { useAddDebt } from "@/hooks/useDebts";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";

const steps = ["How It Works", "Welcome", "Goal", "Identity", "Journey", "Currency", "First Debt", "Done"];

const HOW_STEPS = [
  { icon: CreditCard, title: "Track Your Debts", desc: "Add debts with balances and interest rates to see everything in one place." },
  { icon: DollarSign, title: "Record Your Payments", desc: "Log payments and watch your balances update automatically." },
  { icon: PiggyBank, title: "Build Your Savings", desc: "Set savings goals and track your progress toward financial security." },
  { icon: BarChart3, title: "Monitor Your Progress", desc: "See charts, net worth stats, streaks, and your full financial picture." },
  { icon: Trophy, title: "Reach Financial Freedom", desc: "Earn milestones, celebrate wins, and achieve your financial goals." },
];

const GOALS = [
  { id: "pay-debt", label: "Pay Off Debt", desc: "I want to eliminate my debt and become debt-free" },
  { id: "build-savings", label: "Build Savings", desc: "I want to grow my emergency fund and save for goals" },
  { id: "grow-networth", label: "Grow Net Worth", desc: "I want to track my assets and build long-term wealth" },
  { id: "reduce-stress", label: "Reduce Financial Stress", desc: "I want to feel in control and stop worrying about money" },
];

const IDENTITIES = [
  { id: "debt-destroyer", label: "Debt Destroyer", desc: "I attack debt aggressively" },
  { id: "wealth-builder", label: "Wealth Builder", desc: "I'm building long-term financial freedom" },
  { id: "smart-saver", label: "Smart Saver", desc: "I grow my savings strategically" },
  { id: "budget-boss", label: "Budget Boss", desc: "I manage every dollar with purpose" },
];

const JOURNEY_TYPES = [
  { id: "aggressive", label: "Bold", icon: Zap, desc: "Move fast — pay off debt and save aggressively" },
  { id: "steady", label: "Balanced", icon: ArrowRight, desc: "Steady, consistent progress toward my goals" },
  { id: "gentle", label: "Gentle", icon: Heart, desc: "Slow and steady — build at my own pace" },
];

export default function Onboarding() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const updateProfile = useUpdateProfile();
  const addDebt = useAddDebt();
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState("");
  const [customGoal, setCustomGoal] = useState("");
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
      toast.error("Failed to save currency. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const saveUserData = async () => {
    await supabase.from("users").upsert({
      id: user!.id,
      reason: goal === "custom" ? customGoal : goal,
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
      toast.error("Failed to add debt. Please try again.");
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
      toast.error("Something went wrong. Please try again.");
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
        {/* Progress dots */}
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

          {/* Step 0 — How It Works */}
          {step === 0 && (
            <motion.div key="how-it-works" {...slideProps}>
              <Card>
                <CardContent className="p-6 sm:p-8 space-y-6">
                  <div className="text-center">
                    <TalkingCharacter
                      character="theClimber"
                      context="journey"
                      animation="entrance"
                      size="lg"
                      showBubble={true}
                      bubblePosition="top"
                      className="mx-auto mb-3"
                    />
                    <h1 className="font-heading text-2xl font-bold">How MoneyTrek Works</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                      Your complete financial progress tracker in 5 steps.
                    </p>
                  </div>
                  <div className="space-y-2">
                    {HOW_STEPS.map((s, i) => (
                      <div key={s.title} className="flex items-center gap-3 p-2.5 rounded-lg border border-border">
                        <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center flex-shrink-0">
                          {i + 1}
                        </span>
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

          {/* Step 1 — Welcome */}
          {step === 1 && (
            <motion.div key="welcome" {...slideProps}>
              <Card>
                <CardContent className="p-8 text-center space-y-6">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                    <Sparkles className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h1 className="font-heading text-2xl font-bold">Welcome to MoneyTrek! 🎉</h1>
                    <p className="text-muted-foreground mt-2">
                      Let's set up your financial journey in just a few steps. This will only take 2 minutes.
                    </p>
                  </div>
                  <Button onClick={() => setStep(2)} className="w-full">
                    Let's Go <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 2 — Financial Goal */}
          {step === 2 && (
            <motion.div key="goal" {...slideProps}>
              <Card>
                <CardContent className="p-6 sm:p-8 space-y-6">
                  <div>
                    <h2 className="font-heading text-xl font-bold">What's your main financial goal?</h2>
                    <p className="text-muted-foreground text-sm mt-1">
                      This helps us personalize your experience.
                    </p>
                  </div>
                  <div className="space-y-2">
                    {GOALS.map((g) => (
                      <button
                        key={g.id}
                        onClick={() => setGoal(g.id)}
                        className={cn(
                          "w-full text-left p-3 rounded-lg border transition-all",
                          goal === g.id
                            ? "border-primary bg-primary/5 ring-1 ring-primary"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        <p className="font-medium text-sm">{g.label}</p>
                        <p className="text-xs text-muted-foreground">{g.desc}</p>
                      </button>
                    ))}
                    <button
                      onClick={() => setGoal("custom")}
                      className={cn(
                        "w-full text-left p-3 rounded-lg border transition-all",
                        goal === "custom"
                          ? "border-primary bg-primary/5 ring-1 ring-primary"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <p className="font-medium text-sm">Other</p>
                    </button>
                    {goal === "custom" && (
                      <Input
                        placeholder="Tell us your goal…"
                        value={customGoal}
                        onChange={(e) => setCustomGoal(e.target.value)}
                        className="mt-2"
                      />
                    )}
                  </div>
                  <Button
                    onClick={() => setStep(3)}
                    disabled={!goal || (goal === "custom" && !customGoal)}
                    className="w-full"
                  >
                    Continue <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 3 — Identity */}
          {step === 3 && (
            <motion.div key="identity" {...slideProps}>
              <Card>
                <CardContent className="p-6 sm:p-8 space-y-6">
                  <div>
                    <h2 className="font-heading text-xl font-bold">Who do you want to become?</h2>
                    <p className="text-muted-foreground text-sm mt-1">Choose the identity that resonates with you.</p>
                  </div>
                  <div className="space-y-2">
                    {IDENTITIES.map((id) => (
                      <button
                        key={id.id}
                        onClick={() => setIdentity(id.id)}
                        className={cn(
                          "w-full text-left p-3 rounded-lg border transition-all",
                          identity === id.id
                            ? "border-primary bg-primary/5 ring-1 ring-primary"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        <p className="font-medium text-sm">{id.label}</p>
                        <p className="text-xs text-muted-foreground">{id.desc}</p>
                      </button>
                    ))}
                  </div>
                  <Button onClick={() => setStep(4)} disabled={!identity} className="w-full">
                    Continue <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 4 — Journey Type */}
          {step === 4 && (
            <motion.div key="journey-type" {...slideProps}>
              <Card>
                <CardContent className="p-6 sm:p-8 space-y-6">
                  <div>
                    <h2 className="font-heading text-xl font-bold">Choose your pace</h2>
                    <p className="text-muted-foreground text-sm mt-1">How do you want to approach your financial goals?</p>
                  </div>
                  <div className="space-y-2">
                    {JOURNEY_TYPES.map((jt) => (
                      <button
                        key={jt.id}
                        onClick={() => setJourneyType(jt.id)}
                        className={cn(
                          "w-full text-left p-4 rounded-lg border transition-all flex items-center gap-3",
                          journeyType === jt.id
                            ? "border-primary bg-primary/5 ring-1 ring-primary"
                            : "border-border hover:border-primary/50"
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
                      setStep(5);
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

          {/* Step 5 — Currency */}
          {step === 5 && (
            <motion.div key="currency" {...slideProps}>
              <Card>
                <CardContent className="p-6 sm:p-8 space-y-6">
                  <div>
                    <h2 className="font-heading text-xl font-bold">Choose Your Currency</h2>
                    <p className="text-muted-foreground text-sm mt-1">
                      This will be your default currency for tracking debts and savings.
                    </p>
                  </div>
                  <CurrencySelector value={currency} onValueChange={setCurrency} />
                  <Button onClick={handleCurrencySave} disabled={saving} className="w-full">
                    {saving ? "Saving…" : "Continue"} <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 6 — Add First Debt */}
          {step === 6 && (
            <motion.div key="debt" {...slideProps}>
              <Card>
                <CardContent className="p-6 sm:p-8 space-y-5">
                  <div>
                    <h2 className="font-heading text-xl font-bold">Add Your First Debt</h2>
                    <p className="text-muted-foreground text-sm mt-1">
                      Start with one debt — you can add more, plus savings goals, later.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Debt Name</Label>
                      <Input
                        placeholder="e.g., Credit Card, Car Loan"
                        value={debt.name}
                        onChange={(e) => setDebt({ ...debt, name: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label>Balance ({currency})</Label>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={debt.balance}
                          onChange={(e) => setDebt({ ...debt, balance: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Interest Rate (%)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={debt.rate}
                          onChange={(e) => setDebt({ ...debt, rate: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Minimum Monthly Payment ({currency})</Label>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={debt.minPayment}
                        onChange={(e) => setDebt({ ...debt, minPayment: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button onClick={handleDebtSave} disabled={saving || !canAddDebt} className="flex-1">
                      {saving ? "Adding…" : "Add Debt"}
                    </Button>
                    <Button variant="ghost" onClick={handleSkipDebt} disabled={saving}>
                      Skip
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    No debts? That's great! You can still use MoneyTrek to track savings and net worth.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 7 — Done */}
          {step === 7 && (
            <motion.div key="done" {...slideProps}>
              <Card>
                <CardContent className="p-8 text-center space-y-6">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <Check className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-heading text-2xl font-bold">You're All Set! 🚀</h2>
                    <p className="text-muted-foreground mt-2">
                      Your financial journey starts now. Track your progress, build good habits, and celebrate every win.
                    </p>
                  </div>
                  <Button onClick={() => navigate("/dashboard")} className="w-full" size="lg">
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
