import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { TablesInsert } from "@/integrations/supabase/types";

export function usePayments() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["payments", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payments")
        .select("*, debts(debt_name)")
        .eq("user_id", user!.id)
        .order("payment_date", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

export function useAddPayment() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payment: Omit<TablesInsert<"payments">, "user_id" | "id">) => {
      const { data, error } = await supabase
        .from("payments")
        .insert({ ...payment, user_id: user!.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["debts"] });
    },
  });
}
