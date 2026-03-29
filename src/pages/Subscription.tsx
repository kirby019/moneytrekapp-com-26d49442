import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, X, Clock, Sparkles, Loader2, Settings } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { cn } from "@/lib/utils";
import { useSubscription, PRO_PRICING } from "@/hooks/useSubscription";
import { useLocalizedCurrency } from "@/hooks/useLocalizedPrice";
import FoundingMemberBadge from "@/components/FoundingMemberBadge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";

const FOUNDING_MEMBER_LIMIT = 500;

const freePlanFeatures = [
  { text: "Up to 3 debts", included: true },
  { text: "Record payments", included: true },
  { text: "Basic dashboard", included: true },
  { text: "Basic progress tracking", included: true },
  { text: "Basic charts", included: true },
  { text: "Single currency", included: true },
  { text: "Monthly summary", included: true },
  { text: "Weekly reports", included: false },
  { text: "Advanced analytics", included: false },
  { text: "CSV export", included: false },
  { text: "Multi-currency", included: false },
  { text: "Financial goals", included: false },
  { text: "Payment reminders", included: false },
  { text: "Automation features", included: false },
];

const proPlanFeatures = [
  "Everything in Free",
  "Unlimited debts",
  "Weekly reports",
  "Advanced analytics & charts",
  "Multi-currency support",
  "CSV data export",
  "Payment reminders",
  "Automation features",
  "Financial goals (coming soon)",
  "Net worth tracking (coming soon)",
  "Future premium features",
];

export default function Subscription() {
  const { plan, isPro, isTrial, trialDaysRemaining, isTrialExpired, isFoundingMember } = useSubscription();
  const { format } = useLocalizedCurrency();

  const monthlyPrice = format(PRO_PRICING.monthly);
  const yearlyPrice = format(PRO_PRICING.yearly);

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-bold">Subscription</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your plan and unlock advanced features</p>
        </div>

        {/* Trial Banner */}
        {isTrial && !isTrialExpired && (
          <div className="bg-accent/10 border border-accent/20 rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="font-semibold text-sm">
                Pro Trial Active — {trialDaysRemaining} day{trialDaysRemaining !== 1 ? "s" : ""} left
              </p>
              <p className="text-xs text-muted-foreground">
                You have full access to all Pro features. Subscribe before your trial ends to keep them!
              </p>
            </div>
          </div>
        )}

        {isTrialExpired && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="font-semibold text-sm text-destructive">Your Pro trial has ended</p>
              <p className="text-xs text-muted-foreground">
                Subscribe now to regain access to unlimited debts, analytics, and all Pro features.
              </p>
            </div>
          </div>
        )}

        {/* Founding Member Urgency */}
        {isFoundingMember && (
          <div className="bg-gradient-to-r from-amber-500/10 to-yellow-400/10 border border-amber-400/20 rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-yellow-400 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-sm flex items-center gap-2">
                You're a Founding Member!
                <FoundingMemberBadge />
              </p>
              <p className="text-xs text-muted-foreground">
                Lock in {monthlyPrice}/mo forever — this introductory rate won't last. Price increases after the first {FOUNDING_MEMBER_LIMIT} members.
              </p>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          {/* Free */}
          <Card className={cn(!isPro && !isTrial && "ring-2 ring-primary")}>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="font-heading font-bold text-lg">Free</h2>
                {!isPro && !isTrial && <Badge className="bg-primary text-primary-foreground text-xs">Current</Badge>}
              </div>
              <div className="mb-4">
                <span className="text-3xl font-heading font-extrabold">$0</span>
                <span className="text-sm text-muted-foreground">/forever</span>
              </div>
              <ul className="space-y-2 mb-6">
                {freePlanFeatures.map(f => (
                  <li key={f.text} className={cn("flex items-center gap-2 text-sm", !f.included && "text-muted-foreground/50")}>
                    {f.included
                      ? <Check className="w-4 h-4 text-accent flex-shrink-0" />
                      : <X className="w-4 h-4 text-muted-foreground/30 flex-shrink-0" />
                    }
                    {f.text}
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full" disabled>
                {!isPro && !isTrial ? "Current Plan" : "Downgrade"}
              </Button>
            </CardContent>
          </Card>

          {/* Pro */}
          <Card className={cn(isPro ? "ring-2 ring-primary" : "ring-2 ring-accent/30", "relative overflow-hidden")}>
            {!isPro && (
              <div className="absolute top-0 right-0 bg-accent text-accent-foreground text-[10px] font-bold px-3 py-1 rounded-bl-lg">
                {isTrial ? "Trial Active" : "Coming Soon"}
              </div>
            )}
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Crown className="w-5 h-5 text-accent" />
                <h2 className="font-heading font-bold text-lg">Pro</h2>
                {isPro && !isTrial && <Badge className="bg-accent text-accent-foreground text-xs">Current</Badge>}
                {isTrial && <Badge variant="outline" className="border-accent text-accent text-xs">Trial</Badge>}
              </div>
              <div className="mb-1">
                <span className="text-3xl font-heading font-extrabold">{monthlyPrice}</span>
                <span className="text-sm text-muted-foreground">/month</span>
              </div>
              <p className="text-xs text-muted-foreground mb-1">
                or {yearlyPrice}/year (save 44%)
              </p>
              {isFoundingMember && (
                <p className="text-xs text-accent font-medium mb-3">
                  🔒 Founding member price — locked in forever
                </p>
              )}
              <ul className="space-y-2 mb-6">
                {proPlanFeatures.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-accent flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Button className="w-full" disabled={isPro && !isTrial}>
                {isPro && !isTrial ? "Current Plan" : isTrial ? "Subscribe Now — Keep Pro" : "Coming Soon"}
              </Button>
              {isTrial && (
                <p className="text-center text-[10px] text-muted-foreground mt-2">
                  Payment integration coming soon
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
