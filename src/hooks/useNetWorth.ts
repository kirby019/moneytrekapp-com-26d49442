import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useNetWorthSnapshots() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["net-worth-snapshots", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("net_worth_snapshots")
        .select("*")
        .eq("user_id", user!.id)
        .order("snapshot_date", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

export function useTakeNetWorthSnapshot() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values: {
      total_savings: number;
      total_debt: number;
      net_worth: number;
    }) => {
      const today = new Date().toISOString().split("T")[0];

      // Check if a snapshot already exists for today
      const { data: existing } = await supabase
        .from("net_worth_snapshots")
        .select("id")
        .eq("user_id", user!.id)
        .eq("snapshot_date", today)
        .maybeSingle();

      if (existing) {
        // Update today's snapshot
        const { error } = await supabase
          .from("net_worth_snapshots")
          .update({ ...values })
          .eq("id", existing.id);
        if (error) throw error;
      } else {
        // Create new snapshot
        const { error } = await supabase
          .from("net_worth_snapshots")
          .insert({ ...values, user_id: user!.id, snapshot_date: today });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["net-worth-snapshots"] });
    },
  });
}

export function useDeleteNetWorthSnapshot() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("net_worth_snapshots")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["net-worth-snapshots"] });
    },
  });
}
