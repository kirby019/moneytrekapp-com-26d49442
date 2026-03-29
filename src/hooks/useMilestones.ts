import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useMilestones() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["milestones", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("milestones")
        .select("*")
        .eq("user_id", user!.id)
        .order("milestone_percent", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}
