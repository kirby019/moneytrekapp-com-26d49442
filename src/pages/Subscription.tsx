import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, X } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { cn } from "@/lib/utils";
import { useSubscription, PRO_PRICING } from "@/hooks/useSubscription";
import { useLocalizedCurrency } from "@/hooks/useLocalizedPrice";

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
  const { plan, isPro } = useSubscription();
  const { format, currency } = useLocalizedCurrency();

  const monthlyPrice = format(PRO_PRICING.monthly);
  const yearlyPrice = format(PRO_PRICING.yearly);
  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-bold">Subscription</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your plan and unlock advanced features</p>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {/* Free */}
          <Card className={cn(!isPro && "ring-2 ring-primary")}>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="font-heading font-bold text-lg">Free</h2>
                {!isPro && <Badge className="bg-primary text-primary-foreground text-xs">Current</Badge>}
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
                {!isPro ? "Current Plan" : "Downgrade"}
              </Button>
            </CardContent>
          </Card>

          {/* Pro */}
          <Card className={cn(isPro ? "ring-2 ring-primary" : "ring-2 ring-accent/30", "relative overflow-hidden")}>
            {!isPro && (
              <div className="absolute top-0 right-0 bg-accent text-accent-foreground text-[10px] font-bold px-3 py-1 rounded-bl-lg">
                Coming Soon
              </div>
            )}
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Crown className="w-5 h-5 text-accent" />
                <h2 className="font-heading font-bold text-lg">Pro</h2>
                {isPro && <Badge className="bg-accent text-accent-foreground text-xs">Current</Badge>}
              </div>
              <div className="mb-1">
                <span className="text-3xl font-heading font-extrabold">${PRO_PRICING.monthly}</span>
                <span className="text-sm text-muted-foreground">/month</span>
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                or ${PRO_PRICING.yearly}/year (save 44%)
              </p>
              <ul className="space-y-2 mb-6">
                {proPlanFeatures.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-accent flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Button className="w-full" disabled={isPro || !isPro}>
                {isPro ? "Current Plan" : "Coming Soon"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
