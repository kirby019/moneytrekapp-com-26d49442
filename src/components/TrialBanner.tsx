import { Link } from "react-router-dom";
import { Clock, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/hooks/useSubscription";

export default function TrialBanner() {
  const { isTrial, trialDaysRemaining, isTrialExpired, isPro } = useSubscription();

  // Show nothing if not on trial, or if they're a paid pro
  if (!isTrial && !isTrialExpired) return null;
  if (isPro && !isTrial) return null;

  if (isTrialExpired) {
    return (
      <div className="bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-destructive flex-shrink-0" />
          <p className="text-sm font-medium text-destructive">
            Your free Pro trial has ended. Upgrade to keep all features.
          </p>
        </div>
        <Button asChild size="sm" variant="default">
          <Link to="/subscription">
            <Crown className="w-3.5 h-3.5 mr-1" />
            Upgrade Now
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-accent/10 border border-accent/20 rounded-lg px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <Crown className="w-4 h-4 text-accent flex-shrink-0" />
        <p className="text-sm font-medium">
          <span className="text-accent font-bold">Pro Trial</span>
          <span className="text-muted-foreground"> — {trialDaysRemaining} day{trialDaysRemaining !== 1 ? "s" : ""} remaining. All Pro features unlocked!</span>
        </p>
      </div>
      <Button asChild size="sm" variant="outline" className="border-accent/30 text-accent hover:bg-accent/10">
        <Link to="/subscription">View Plans</Link>
      </Button>
    </div>
  );
}
