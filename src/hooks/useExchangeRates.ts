import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface ExchangeRate {
  base_currency: string;
  target_currency: string;
  rate: number;
}

export function useExchangeRates() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["exchange_rates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("exchange_rates" as any)
        .select("base_currency, target_currency, rate");
      if (error) throw error;
      return data as unknown as ExchangeRate[];
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  rates: ExchangeRate[] | undefined
): number {
  if (fromCurrency === toCurrency) return amount;
  if (!rates || rates.length === 0) return amount; // 1:1 fallback

  // Direct rate
  const direct = rates.find(
    (r) => r.base_currency === fromCurrency && r.target_currency === toCurrency
  );
  if (direct) return amount * direct.rate;

  // Reverse rate
  const reverse = rates.find(
    (r) => r.base_currency === toCurrency && r.target_currency === fromCurrency
  );
  if (reverse && reverse.rate !== 0) return amount / reverse.rate;

  // Via USD pivot
  const toUsd = rates.find(
    (r) => r.base_currency === fromCurrency && r.target_currency === "USD"
  );
  const fromUsd = rates.find(
    (r) => r.base_currency === "USD" && r.target_currency === toCurrency
  );
  if (toUsd && fromUsd) return amount * toUsd.rate * fromUsd.rate;

  // Reverse via USD pivot
  const toUsdReverse = rates.find(
    (r) => r.base_currency === "USD" && r.target_currency === fromCurrency
  );
  const fromUsdReverse = rates.find(
    (r) => r.base_currency === toCurrency && r.target_currency === "USD"
  );
  if (toUsdReverse && toUsdReverse.rate !== 0 && fromUsdReverse && fromUsdReverse.rate !== 0) {
    return (amount / toUsdReverse.rate) / fromUsdReverse.rate;
  }

  // Fallback 1:1
  return amount;
}
