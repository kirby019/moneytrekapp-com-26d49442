import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useStreak() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["streak", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("streaks")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle();
      if (error) throw error;

      if (!data) return { current_streak: 0, last_activity_date: null };

      // Check if streak is still active (within 7 days)
      if (data.last_activity_date) {
        const lastDate = new Date(data.last_activity_date);
        const now = new Date();
        const diffDays = Math.floor((now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays > 7) {
          return { current_streak: 0, last_activity_date: data.last_activity_date };
        }
      }

      return data;
    },
    enabled: !!user,
  });
}

export function useUpdateStreak() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const today = new Date().toISOString().split("T")[0];

      // Get current streak
      const { data: existing } = await supabase
        .from("streaks")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle();

      if (!existing) {
        // First activity — create streak
        const { error } = await supabase
          .from("streaks")
          .insert({ user_id: user!.id, current_streak: 1, last_activity_date: today });
        if (error) throw error;
        return 1;
      }

      // Already recorded today
      if (existing.last_activity_date === today) {
        return existing.current_streak ?? 1;
      }

      const lastDate = new Date(existing.last_activity_date!);
      const now = new Date();
      const diffDays = Math.floor((now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

      // Within 7 days: increment. Otherwise: reset to 1.
      const newStreak = diffDays <= 7 ? (existing.current_streak ?? 0) + 1 : 1;

      const { error } = await supabase
        .from("streaks")
        .update({ current_streak: newStreak, last_activity_date: today })
        .eq("id", existing.id);
      if (error) throw error;

      return newStreak;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["streak"] });
    },
  });
}
