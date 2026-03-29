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
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user!.id)
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const plan: PlanType = subscription?.plan === "pro" ? "pro" : "free";
  const limits = PLAN_LIMITS[plan];

  return {
    plan,
    limits,
    subscription,
    isLoading,
    isPro: plan === "pro",
    isFree: plan === "free",
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
