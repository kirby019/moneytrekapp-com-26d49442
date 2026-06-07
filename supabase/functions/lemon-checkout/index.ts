import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authenticate user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { billing_cycle } = await req.json();
    if (!billing_cycle || !["monthly", "yearly"].includes(billing_cycle)) {
      return new Response(
        JSON.stringify({ error: "Invalid billing_cycle. Use 'monthly' or 'yearly'." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const variantId =
      billing_cycle === "monthly"
        ? Deno.env.get("LEMONSQUEEZY_MONTHLY_VARIANT_ID")
        : Deno.env.get("LEMONSQUEEZY_YEARLY_VARIANT_ID");

    const storeId = Deno.env.get("LEMONSQUEEZY_STORE_ID");
    const apiKey = Deno.env.get("LEMONSQUEEZY_API_KEY");

    if (!variantId || !storeId || !apiKey) {
      console.error("Missing LemonSqueezy config", { variantId: !!variantId, storeId: !!storeId, apiKey: !!apiKey });
      return new Response(
        JSON.stringify({ error: "Payment service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create checkout via LemonSqueezy API
    const response = await fetch("https://api.lemonsqueezy.com/v1/checkouts", {
      method: "POST",
      headers: {
        Accept: "application/vnd.api+json",
        "Content-Type": "application/vnd.api+json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        data: {
          type: "checkouts",
          attributes: {
            checkout_data: {
              email: user.email,
              custom: {
                user_id: user.id,
              },
            },
            product_options: {
              redirect_url: `${req.headers.get("origin") || "https://moneytrekapp.com"}/subscription?success=true`,
            },
          },
          relationships: {
            store: { data: { type: "stores", id: storeId } },
            variant: { data: { type: "variants", id: variantId } },
          },
        },
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error("LemonSqueezy API error:", response.status, errBody);
      return new Response(
        JSON.stringify({ error: "Failed to create checkout session" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const result = await response.json();
    const checkoutUrl = result.data?.attributes?.url;

    return new Response(JSON.stringify({ url: checkoutUrl }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Checkout error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
