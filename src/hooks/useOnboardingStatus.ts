import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useOnboardingStatus() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["onboarding-status", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("users")
        .select("journey_start_date")
        .eq("id", user!.id)
        .maybeSingle();
      return { completed: !!data?.journey_start_date };
    },
    enabled: !!user,
  });
}
