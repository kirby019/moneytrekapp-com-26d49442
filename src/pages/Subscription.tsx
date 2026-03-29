import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    current: true,
    features: ["Track up to 3 debts", "Snowball strategy", "Basic progress tracking"],
  },
  {
    name: "Pro",
    price: "$5",
    period: "/month",
    current: false,
    features: ["Unlimited debts", "All strategies", "Milestones & badges", "Weekly reviews", "Future projections", "Priority support"],
  },
];

export default function Subscription() {
  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-bold">Subscription</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your plan</p>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {plans.map(plan => (
            <Card key={plan.name} className={cn(plan.current && "ring-2 ring-primary")}>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  {plan.name === "Pro" && <Crown className="w-5 h-5 text-warning" />}
                  <h2 className="font-heading font-bold text-lg">{plan.name}</h2>
                  {plan.current && <Badge className="bg-primary text-primary-foreground text-xs">Current</Badge>}
                </div>
                <div className="mb-4">
                  <span className="text-3xl font-heading font-extrabold">{plan.price}</span>
                  <span className="text-sm text-muted-foreground">{plan.period}</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-success" /> {f}
                    </li>
                  ))}
                </ul>
                <Button variant={plan.current ? "outline" : "default"} className="w-full" disabled={plan.current}>
                  {plan.current ? "Current Plan" : "Upgrade"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
