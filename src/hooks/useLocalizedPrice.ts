import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useMemo } from "react";
import { formatCurrency } from "@/lib/currency";

// Map browser locale regions to currency codes
const localeToCurrency: Record<string, string> = {
  US: "USD", PH: "PHP", SG: "SGD", AU: "AUD", NZ: "NZD", GB: "GBP", CA: "CAD",
  JP: "JPY", KR: "KRW", IN: "INR", TH: "THB", VN: "VND", ID: "IDR", MY: "MYR",
  HK: "HKD", TW: "TWD", CN: "CNY", CH: "CHF", SE: "SEK", NO: "NOK", DK: "DKK",
  PL: "PLN", CZ: "CZK", HU: "HUF", RO: "RON", BG: "BGN", HR: "HRK", RU: "RUB",
  UA: "UAH", TR: "TRY", IL: "ILS", AE: "AED", SA: "SAR", QA: "QAR", KW: "KWD",
  BH: "BHD", OM: "OMR", EG: "EGP", ZA: "ZAR", NG: "NGN", KE: "KES", GH: "GHS",
  BR: "BRL", MX: "MXN", AR: "ARS", CL: "CLP", CO: "COP", PE: "PEN", BD: "BDT",
  PK: "PKR", LK: "LKR", MM: "MMK", NP: "NPR",
  // Eurozone
  DE: "EUR", FR: "EUR", IT: "EUR", ES: "EUR", NL: "EUR", BE: "EUR", AT: "EUR",
  PT: "EUR", IE: "EUR", FI: "EUR", GR: "EUR", SK: "EUR", SI: "EUR", LT: "EUR",
  LV: "EUR", EE: "EUR", MT: "EUR", CY: "EUR", LU: "EUR",
};

function detectCurrency(): string {
  try {
    const locales = navigator.languages ?? [navigator.language];
    for (const locale of locales) {
      const parts = locale.split("-");
      const region = parts.length > 1 ? parts[parts.length - 1].toUpperCase() : parts[0].toUpperCase();
      if (localeToCurrency[region]) return localeToCurrency[region];
    }
  } catch {}
  return "USD";
}

export function useLocalizedPrice(baseUsd: number) {
  const detectedCurrency = useMemo(() => detectCurrency(), []);

  const { data: rates } = useQuery({
    queryKey: ["exchange_rates_public"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("exchange_rates" as any)
        .select("base_currency, target_currency, rate");
      if (error) throw error;
      return data as { base_currency: string; target_currency: string; rate: number }[];
    },
    staleTime: 1000 * 60 * 60,
  });

  return useMemo(() => {
    if (detectedCurrency === "USD" || !rates || rates.length === 0) {
      return { price: formatCurrency(baseUsd, "USD"), currency: "USD", raw: baseUsd };
    }

    // Find USD -> detected currency rate
    const rate = rates.find(
      r => r.base_currency === "USD" && r.target_currency === detectedCurrency
    );

    if (!rate) {
      return { price: formatCurrency(baseUsd, "USD"), currency: "USD", raw: baseUsd };
    }

    const converted = baseUsd * rate.rate;
    // Round nicely
    const rounded = converted < 10 ? Math.round(converted * 100) / 100 :
                    converted < 100 ? Math.round(converted * 10) / 10 :
                    Math.round(converted);

    return {
      price: formatCurrency(rounded, detectedCurrency),
      currency: detectedCurrency,
      raw: rounded,
    };
  }, [baseUsd, detectedCurrency, rates]);
}
