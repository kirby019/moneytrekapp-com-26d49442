import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useWeeklyReports() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["weekly_reports", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("weekly_reports")
        .select("*")
        .eq("user_id", user!.id)
        .order("week_start", { ascending: false })
        .limit(1);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}
