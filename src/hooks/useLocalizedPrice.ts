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

// Map IANA timezone to currency as a fallback when locale doesn't reveal region
const timezoneToCurrency: Record<string, string> = {
  "Asia/Ho_Chi_Minh": "VND", "Asia/Saigon": "VND",
  "Asia/Manila": "PHP", "Asia/Singapore": "SGD", "Asia/Bangkok": "THB",
  "Asia/Jakarta": "IDR", "Asia/Kuala_Lumpur": "MYR", "Asia/Hong_Kong": "HKD",
  "Asia/Taipei": "TWD", "Asia/Tokyo": "JPY", "Asia/Seoul": "KRW",
  "Asia/Kolkata": "INR", "Asia/Calcutta": "INR", "Asia/Shanghai": "CNY",
  "Asia/Dhaka": "BDT", "Asia/Karachi": "PKR", "Asia/Colombo": "LKR",
  "Asia/Yangon": "MMK", "Asia/Kathmandu": "NPR", "Asia/Dubai": "AED",
  "Asia/Riyadh": "SAR", "Asia/Qatar": "QAR", "Asia/Kuwait": "KWD",
  "Asia/Bahrain": "BHD", "Asia/Muscat": "OMR", "Asia/Jerusalem": "ILS",
  "Asia/Istanbul": "TRY",
  "Europe/London": "GBP", "Europe/Zurich": "CHF", "Europe/Stockholm": "SEK",
  "Europe/Oslo": "NOK", "Europe/Copenhagen": "DKK", "Europe/Warsaw": "PLN",
  "Europe/Prague": "CZK", "Europe/Budapest": "HUF", "Europe/Bucharest": "RON",
  "Europe/Sofia": "BGN", "Europe/Zagreb": "HRK", "Europe/Moscow": "RUB",
  "Europe/Kiev": "UAH", "Europe/Kyiv": "UAH",
  "Europe/Berlin": "EUR", "Europe/Paris": "EUR", "Europe/Rome": "EUR",
  "Europe/Madrid": "EUR", "Europe/Amsterdam": "EUR", "Europe/Brussels": "EUR",
  "Europe/Vienna": "EUR", "Europe/Lisbon": "EUR", "Europe/Dublin": "EUR",
  "Europe/Helsinki": "EUR", "Europe/Athens": "EUR",
  "Australia/Sydney": "AUD", "Australia/Melbourne": "AUD", "Australia/Perth": "AUD",
  "Pacific/Auckland": "NZD",
  "America/New_York": "USD", "America/Chicago": "USD", "America/Denver": "USD",
  "America/Los_Angeles": "USD", "America/Toronto": "CAD", "America/Vancouver": "CAD",
  "America/Sao_Paulo": "BRL", "America/Mexico_City": "MXN", "America/Argentina/Buenos_Aires": "ARS",
  "America/Santiago": "CLP", "America/Bogota": "COP", "America/Lima": "PEN",
  "Africa/Cairo": "EGP", "Africa/Johannesburg": "ZAR", "Africa/Lagos": "NGN",
  "Africa/Nairobi": "KES", "Africa/Accra": "GHS",
};

function detectCurrency(): string {
  // 1. Try locale region first
  try {
    const locales = navigator.languages ?? [navigator.language];
    for (const locale of locales) {
      const parts = locale.split("-");
      if (parts.length > 1) {
        const region = parts[parts.length - 1].toUpperCase();
        if (localeToCurrency[region]) return localeToCurrency[region];
      }
    }
  } catch {}

  // 2. Fallback to timezone detection (works even with en-US locale in Vietnam)
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz && timezoneToCurrency[tz]) return timezoneToCurrency[tz];
  } catch {}

  return "USD";
}

export function useLocalizedCurrency() {
  const detectedCurrency = useMemo(() => detectCurrency(), []);

  const { data: rates } = useQuery({
    queryKey: ["exchange_rates_public"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("exchange_rates")
        .select("base_currency, target_currency, rate");
      if (error) throw error;
      return data as unknown as { base_currency: string; target_currency: string; rate: number }[];
    },
    staleTime: 1000 * 60 * 60,
  });

  const convert = useMemo(() => {
    return (usdAmount: number) => {
      if (detectedCurrency === "USD" || !rates || rates.length === 0) return usdAmount;
      const rate = rates.find(r => r.base_currency === "USD" && r.target_currency === detectedCurrency);
      if (!rate) return usdAmount;
      return usdAmount * rate.rate;
    };
  }, [detectedCurrency, rates]);

  const format = useMemo(() => {
    return (usdAmount: number, round = true) => {
      const converted = convert(usdAmount);
      const cur = (detectedCurrency !== "USD" && rates?.length) ? detectedCurrency : "USD";
      if (round) {
        const rounded = converted < 10 ? Math.round(converted * 100) / 100 :
                        converted < 100 ? Math.round(converted * 10) / 10 :
                        Math.round(converted);
        return formatCurrency(rounded, cur);
      }
      return formatCurrency(converted, cur);
    };
  }, [convert, detectedCurrency, rates]);

  return { currency: detectedCurrency, convert, format, rates };
}

export function useLocalizedPrice(baseUsd: number) {
  const { currency, format } = useLocalizedCurrency();

  return useMemo(() => ({
    price: format(baseUsd),
    currency,
    raw: baseUsd,
  }), [baseUsd, currency, format]);
}
