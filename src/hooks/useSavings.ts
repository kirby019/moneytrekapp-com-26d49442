import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useSavingsAccounts() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["savings-accounts", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("savings_accounts")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

export function useAddSavingsAccount() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values: { account_name: string; balance: number; currency: string }) => {
      const { data, error } = await supabase
        .from("savings_accounts")
        .insert({ ...values, user_id: user!.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savings-accounts"] });
    },
  });
}

export function useUpdateSavingsAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; account_name?: string; balance?: number }) => {
      const { error } = await supabase
        .from("savings_accounts")
        .update(updates)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savings-accounts"] });
    },
  });
}

export function useDeleteSavingsAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      // Delete transactions first (foreign key)
      await supabase.from("savings_transactions").delete().eq("savings_account_id", id);
      const { error } = await supabase.from("savings_accounts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savings-accounts"] });
    },
  });
}

export function useAddSavingsTransaction() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      savings_account_id,
      amount,
      type,
      notes,
      current_balance,
    }: {
      savings_account_id: string;
      amount: number;
      type: "deposit" | "withdrawal";
      notes?: string;
      current_balance: number;
    }) => {
      const delta = type === "deposit" ? amount : -amount;
      const newBalance = Math.max(0, current_balance + delta);

      // Record the transaction
      const { error: txError } = await supabase
        .from("savings_transactions")
        .insert({
          savings_account_id,
          user_id: user!.id,
          amount: delta,
          notes: notes || null,
          transaction_date: new Date().toISOString().split("T")[0],
        });
      if (txError) throw txError;

      // Update the account balance
      const { error: balError } = await supabase
        .from("savings_accounts")
        .update({ balance: newBalance })
        .eq("id", savings_account_id);
      if (balError) throw balError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savings-accounts"] });
    },
  });
}
