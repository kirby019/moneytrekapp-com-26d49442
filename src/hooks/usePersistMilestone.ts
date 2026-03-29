import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function usePersistMilestone() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (milestonePercent: number) => {
      const today = new Date().toISOString().split("T")[0];
      const { error } = await supabase
        .from("milestones")
        .insert({
          user_id: user!.id,
          milestone_percent: milestonePercent,
          achieved_date: today,
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["milestones"] });
    },
  });
}
