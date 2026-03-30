import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useDebts } from "@/hooks/useDebts";

export type PlanType = "free" | "pro";

export const PLAN_LIMITS = {
  free: {
    maxDebts: 3,
    multiCurrency: false,
    csvExport: false,
    weeklyReports: false,
    advancedAnalytics: false,
    financialGoals: false,
    paymentReminders: false,
    netWorthTracking: false,
    unlimitedSavings: false,
  },
  pro: {
    maxDebts: Infinity,
    multiCurrency: true,
    csvExport: true,
    weeklyReports: true,
    advancedAnalytics: true,
    financialGoals: true,
    paymentReminders: true,
    netWorthTracking: true,
    unlimitedSavings: true,
  },
} as const;

export const PRO_PRICING = {
  monthly: 2.99,
  yearly: 19.99,
  currency: "USD",
} as const;

export function useSubscription() {
  const { user } = useAuth();

  const { data: subscription, isLoading } = useQuery({
    queryKey: ["subscription", user?.id],
    queryFn: async () => {
      // First try to find an active subscription
      const { data: activeSub, error: activeErr } = await (supabase
        .from("subscriptions_safe" as any)
        .select("*")
        .eq("user_id", user!.id)
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle() as any);
      if (activeErr) throw activeErr;
      if (activeSub) return activeSub as SubscriptionRow;

      // If no active sub, check for a valid trial that was incorrectly deactivated
      const { data: trialSub, error: trialErr } = await (supabase
        .from("subscriptions_safe" as any)
        .select("*")
        .eq("user_id", user!.id)
        .eq("is_trial", true)
        .gte("trial_ends_at", new Date().toISOString())
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle() as any);
      if (trialErr) throw trialErr;
      return (trialSub as SubscriptionRow) ?? null;
    },
    enabled: !!user,
  });

  const isTrial = !!subscription?.is_trial;
  const trialEndsAt = subscription?.trial_ends_at
    ? new Date(subscription.trial_ends_at)
    : null;
  const isTrialExpired = isTrial && trialEndsAt ? trialEndsAt < new Date() : false;
  const isFoundingMember = !!subscription?.is_founding_member;

  // If trial is expired and it's still a trial (not converted), treat as free
  const plan: PlanType =
    subscription?.plan === "pro" && !isTrialExpired ? "pro" : "free";
  const limits = PLAN_LIMITS[plan];

  const trialDaysRemaining = trialEndsAt
    ? Math.max(0, Math.ceil((trialEndsAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0;

  return {
    plan,
    limits,
    subscription,
    isLoading,
    isPro: plan === "pro",
    isFree: plan === "free",
    isTrial,
    isTrialExpired,
    trialDaysRemaining,
    trialEndsAt,
    isFoundingMember,
  };
}

export function useCanAddDebt() {
  const { limits, isFree } = useSubscription();
  const { data: debts } = useDebts();

  const activeDebts = debts?.filter(d => d.status !== "paid")?.length ?? 0;
  const canAdd = !isFree || activeDebts < limits.maxDebts;
  const remaining = Math.max(0, limits.maxDebts - activeDebts);

  return { canAdd, remaining, activeCount: activeDebts, maxDebts: limits.maxDebts, isFree };
}

export type FeatureKey = keyof Omit<typeof PLAN_LIMITS.free, "maxDebts">;

export function useFeatureAccess(feature: FeatureKey) {
  const { limits, isPro, isFree } = useSubscription();
  const hasAccess = limits[feature] as boolean;
  return { hasAccess, isPro, isFree };
}
