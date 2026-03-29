import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { usePayments } from "@/hooks/usePayments";

export function useJourneyProgress() {
  const { user } = useAuth();
  const { data: payments } = usePayments();

  const { data: userRow, isLoading } = useQuery({
    queryKey: ["user-journey", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("users")
        .select("journey_start_date, journey_starting_debt")
        .eq("id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const journeyStartDate = userRow?.journey_start_date ?? null;
  const journeyStartingDebt = userRow?.journey_starting_debt ?? 0;

  // Sum payments made after the journey start date
  const journeyPayments = payments?.filter((p) => {
    if (!journeyStartDate || !p.payment_date) return false;
    return p.payment_date >= journeyStartDate;
  }) ?? [];

  const totalJourneyPaid = journeyPayments.reduce((s, p) => s + (p.amount ?? 0), 0);

  const journeyProgress = journeyStartingDebt > 0
    ? Math.min(Math.round((totalJourneyPaid / journeyStartingDebt) * 100), 100)
    : 0;

  return {
    journeyStartDate,
    journeyStartingDebt,
    totalJourneyPaid,
    journeyProgress,
    journeyPayments,
    isLoading,
    hasJourneyData: !!journeyStartDate && journeyStartingDebt > 0,
  };
}
