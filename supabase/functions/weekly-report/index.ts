import { createClient } from "@supabase/supabase-js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // Get all distinct user_ids from debts
    const { data: users, error: usersErr } = await supabase
      .from("debts")
      .select("user_id")
      .not("user_id", "is", null);

    if (usersErr) throw usersErr;

    const uniqueUserIds = [...new Set(users.map((u: any) => u.user_id))];

    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - 7);
    const weekStartStr = weekStart.toISOString().split("T")[0];

    let created = 0;

    for (const userId of uniqueUserIds) {
      // Check if report already exists for this week
      const { data: existing } = await supabase
        .from("weekly_reports")
        .select("id")
        .eq("user_id", userId)
        .gte("week_start", weekStartStr)
        .limit(1);

      if (existing && existing.length > 0) continue;

      // Get payments this week
      const { data: payments } = await supabase
        .from("payments")
        .select("amount")
        .eq("user_id", userId)
        .gte("payment_date", weekStartStr);

      const totalPaid = (payments ?? []).reduce(
        (s: number, p: any) => s + (p.amount ?? 0),
        0
      );

      // Get total remaining balance
      const { data: debts } = await supabase
        .from("debts")
        .select("current_balance, original_amount")
        .eq("user_id", userId);

      const totalBalance = (debts ?? []).reduce(
        (s: number, d: any) => s + (d.current_balance ?? 0),
        0
      );
      const totalOriginal = (debts ?? []).reduce(
        (s: number, d: any) => s + (d.original_amount ?? 0),
        0
      );
      const progressPercent =
        totalOriginal > 0
          ? Math.round(((totalOriginal - totalBalance) / totalOriginal) * 100)
          : 0;

      // Insert weekly report
      const { error: insertErr } = await supabase
        .from("weekly_reports")
        .insert({
          user_id: userId,
          week_start: weekStartStr,
          amount_paid: totalPaid,
          progress_percent: progressPercent,
          notes: `Paid $${totalPaid.toFixed(2)} this week. ${totalBalance > 0 ? `$${totalBalance.toFixed(2)} remaining.` : "All debts paid off!"}`,
        });

      if (!insertErr) created++;
    }

    return new Response(
      JSON.stringify({ success: true, reports_created: created }),
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
