import { createClient } from "@supabase/supabase-js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Free, no-auth-required API
const API_URL = "https://open.er-api.com/v6/latest/USD";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // Fetch rates from public API
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`API returned ${res.status}`);

    const data = await res.json();
    if (data.result !== "success") throw new Error("API error: " + data.result);

    const rates = data.rates as Record<string, number>;
    const now = new Date().toISOString();

    // Upsert each rate with USD as base
    const upserts = Object.entries(rates).map(([currency, rate]) => ({
      base_currency: "USD",
      target_currency: currency,
      rate: rate,
      updated_at: now,
    }));

    // Batch upsert in chunks of 50
    let updated = 0;
    for (let i = 0; i < upserts.length; i += 50) {
      const chunk = upserts.slice(i, i + 50);
      const { error } = await supabase
        .from("exchange_rates")
        .upsert(chunk, {
          onConflict: "base_currency,target_currency",
        });
      if (error) throw error;
      updated += chunk.length;
    }

    return new Response(
      JSON.stringify({ success: true, rates_updated: updated }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
