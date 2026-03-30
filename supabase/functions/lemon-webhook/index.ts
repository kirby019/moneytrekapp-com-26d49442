import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-signature, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

async function verifySignature(
  payload: string,
  signature: string,
  secret: string
): Promise<boolean> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  const hexSig = Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hexSig === signature;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-signature");
    const webhookSecret = Deno.env.get("LEMONSQUEEZY_WEBHOOK_SECRET");

    if (!webhookSecret) {
      console.error("LEMONSQUEEZY_WEBHOOK_SECRET not set");
      return new Response("Server misconfigured", { status: 500 });
    }

    if (!signature || !(await verifySignature(rawBody, signature, webhookSecret))) {
      console.error("Invalid webhook signature");
      return new Response("Invalid signature", { status: 401 });
    }

    const event = JSON.parse(rawBody);
    const eventName = event.meta?.event_name;
    const customData = event.meta?.custom_data;
    const userId = customData?.user_id;
    const attrs = event.data?.attributes;

    console.log("Webhook event:", eventName, "user:", userId);

    if (!userId) {
      console.error("No user_id in custom_data");
      return new Response("Missing user_id", { status: 400 });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const subscriptionData = {
      user_id: userId,
      plan: "pro" as const,
      status: "active",
      is_trial: false,
      trial_ends_at: null,
      billing_cycle: attrs?.variant_name?.toLowerCase().includes("year") ? "yearly" : "monthly",
      stripe_subscription_id: String(event.data?.id ?? ""),
      stripe_customer_id: String(attrs?.customer_id ?? ""),
      start_date: attrs?.created_at ? new Date(attrs.created_at).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
      current_period_end: attrs?.renews_at ? new Date(attrs.renews_at).toISOString() : null,
      is_founding_member: true,
    };

    switch (eventName) {
      case "subscription_created": {
        // Deactivate existing trial/subscriptions (only trials and old subs, not paid active ones)
        await supabase
          .from("subscriptions")
          .update({ status: "inactive" })
          .eq("user_id", userId)
          .eq("status", "active")
          .eq("is_trial", true);

        // Also deactivate any other non-trial active subs to avoid duplicates
        await supabase
          .from("subscriptions")
          .update({ status: "inactive" })
          .eq("user_id", userId)
          .eq("status", "active")
          .neq("stripe_subscription_id", String(event.data?.id ?? ""));

        const { error } = await supabase
          .from("subscriptions")
          .insert(subscriptionData);

        if (error) console.error("Insert error:", error);
        else console.log("Subscription created for", userId);
        break;
      }

      case "subscription_updated": {
        const status = attrs?.status;
        const mappedStatus =
          status === "active" ? "active" :
          status === "past_due" ? "active" :
          status === "paused" ? "inactive" :
          status === "cancelled" ? "inactive" :
          "inactive";

        const { error } = await supabase
          .from("subscriptions")
          .update({
            status: mappedStatus,
            current_period_end: attrs?.renews_at ? new Date(attrs.renews_at).toISOString() : null,
            end_date: attrs?.ends_at ? new Date(attrs.ends_at).toISOString().split("T")[0] : null,
          })
          .eq("user_id", userId)
          .eq("stripe_subscription_id", String(event.data?.id));

        if (error) console.error("Update error:", error);
        else console.log("Subscription updated for", userId, "status:", mappedStatus);
        break;
      }

      case "subscription_cancelled": {
        // LemonSqueezy cancellation: subscription stays active until ends_at
        const { error } = await supabase
          .from("subscriptions")
          .update({
            end_date: attrs?.ends_at ? new Date(attrs.ends_at).toISOString().split("T")[0] : null,
          })
          .eq("user_id", userId)
          .eq("stripe_subscription_id", String(event.data?.id));

        if (error) console.error("Cancel error:", error);
        else console.log("Subscription cancelled for", userId);
        break;
      }

      case "subscription_expired": {
        const { error } = await supabase
          .from("subscriptions")
          .update({ status: "inactive" })
          .eq("user_id", userId)
          .eq("stripe_subscription_id", String(event.data?.id));

        if (error) console.error("Expire error:", error);
        else console.log("Subscription expired for", userId);
        break;
      }

      default:
        console.log("Unhandled event:", eventName);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Webhook error:", err);
    return new Response("Internal error", { status: 500 });
  }
});
