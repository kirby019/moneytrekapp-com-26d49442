import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import AppLayout from "@/components/AppLayout";
import CurrencySelector from "@/components/CurrencySelector";
import ConfirmDialog from "@/components/ConfirmDialog";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import { useDebts } from "@/hooks/useDebts";
import { usePayments } from "@/hooks/usePayments";
import { useWeeklyReports } from "@/hooks/useWeeklyReports";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, Key, Trash2, Lock, RotateCcw } from "lucide-react";
import { exportToCsv } from "@/lib/exportCsv";
import { useNavigate } from "react-router-dom";
import { useFeatureAccess } from "@/hooks/useSubscription";
import { useQueryClient } from "@tanstack/react-query";

export default function AppSettings() {
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const { data: debts } = useDebts();
  const { data: payments } = usePayments();
  const { data: reports } = useWeeklyReports();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { hasAccess: canExport } = useFeatureAccess("csvExport");

  const [currency, setCurrency] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPw, setChangingPw] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showResetJourney, setShowResetJourney] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [resetting, setResetting] = useState(false);

  const activeCurrency = currency ?? (profile as any)?.default_currency ?? "USD";

  const handleCurrencySave = async () => {
    try {
      await updateProfile.mutateAsync({ default_currency: activeCurrency });
      toast.success("Default currency updated!");
    } catch (e: any) {
      toast.error(e.message || "Failed to update currency");
    }
  };

  const handleChangePassword = async () => {
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setChangingPw(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast.success("Password changed successfully!");
      setNewPassword("");
      setConfirmPassword("");
    } catch (e: any) {
      toast.error(e.message || "Failed to change password");
    } finally {
      setChangingPw(false);
    }
  };

  const handleResetJourney = async () => {
    if (!user) return;
    setResetting(true);
    try {
      // Calculate current total remaining debt
      const activeDebts = debts?.filter(d => d.status !== "paid") ?? [];
      const totalRemaining = activeDebts.reduce((s, d) => s + (d.current_balance ?? 0), 0);
      const today = new Date().toISOString().split("T")[0];

      // Update journey baseline
      const { error: userError } = await supabase
        .from("users")
        .upsert({
          id: user.id,
          journey_start_date: today,
          journey_starting_debt: totalRemaining,
        }, { onConflict: "id" });
      if (userError) throw userError;

      // Delete existing milestones
      await supabase.from("milestones").delete().eq("user_id", user.id);

      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["user-journey"] });
      queryClient.invalidateQueries({ queryKey: ["milestones"] });
      queryClient.invalidateQueries({ queryKey: ["onboarding-status"] });

      toast.success("Journey reset! Your progress tracking starts fresh from today.");
      setShowResetJourney(false);
    } catch (e: any) {
      toast.error(e.message || "Failed to reset journey");
    } finally {
      setResetting(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (!userId) throw new Error("Not authenticated");

      await supabase.from("payments").delete().eq("user_id", userId);
      await supabase.from("debts").delete().eq("user_id", userId);
      await supabase.from("milestones").delete().eq("user_id", userId);
      await supabase.from("streaks").delete().eq("user_id", userId);
      await supabase.from("notifications").delete().eq("user_id", userId);
      await supabase.from("weekly_reports").delete().eq("user_id", userId);
      await supabase.from("financial_goals").delete().eq("user_id", userId);
      await supabase.from("savings_transactions").delete().eq("user_id", userId);
      await supabase.from("savings_accounts").delete().eq("user_id", userId);
      await supabase.from("net_worth_snapshots").delete().eq("user_id", userId);
      await supabase.from("users").delete().eq("id", userId);
      await supabase.from("profiles").delete().eq("id", userId);

      await signOut();
      toast.success("Account data deleted. You have been signed out.");
      navigate("/");
    } catch (e: any) {
      toast.error(e.message || "Failed to delete account data");
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const exportDebts = () => {
    if (!debts?.length) { toast.error("No debts to export"); return; }
    exportToCsv("debts.csv",
      ["Name", "Balance", "Original Amount", "Interest Rate", "Min Payment", "Currency", "Status", "Created"],
      debts.map(d => [d.debt_name ?? "", String(d.current_balance ?? 0), String(d.original_amount ?? 0), String(d.interest_rate ?? 0), String(d.minimum_payment ?? 0), (d as any).currency ?? "USD", d.status ?? "", d.created_at ?? ""])
    );
    toast.success("Debts exported!");
  };

  const exportPayments = () => {
    if (!payments?.length) { toast.error("No payments to export"); return; }
    exportToCsv("payments.csv",
      ["Debt", "Amount", "Date", "Extra Payment", "Notes", "Created"],
      payments.map(p => [(p as any).debts?.debt_name ?? "", String(p.amount ?? 0), p.payment_date ?? "", p.is_extra_payment ? "Yes" : "No", p.notes ?? "", p.created_at ?? ""])
    );
    toast.success("Payments exported!");
  };

  const exportReports = () => {
    if (!reports?.length) { toast.error("No reports to export"); return; }
    exportToCsv("weekly_reports.csv",
      ["Week Start", "Amount Paid", "Progress %", "Notes", "Created"],
      reports.map(r => [r.week_start ?? "", String(r.amount_paid ?? 0), String(r.progress_percent ?? 0), r.notes ?? "", r.created_at ?? ""])
    );
    toast.success("Weekly reports exported!");
  };

  return (
    <AppLayout>
      <div className="max-w-lg mx-auto space-y-6">
        <h1 className="font-heading text-2xl font-bold">Settings</h1>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-48 w-full rounded-xl" />
          </div>
        ) : (
          <>
            {/* Notifications */}
            <Card>
              <CardContent className="p-6 space-y-5">
                <h2 className="font-heading font-semibold">Notifications</h2>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Payment Reminders</Label>
                    <p className="text-xs text-muted-foreground">Get notified before payments are due</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Milestone Celebrations</Label>
                    <p className="text-xs text-muted-foreground">Show confetti on achievements</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Weekly Review Emails</Label>
                    <p className="text-xs text-muted-foreground">Receive weekly progress summaries</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            {/* Default Currency */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <h2 className="font-heading font-semibold">Default Currency</h2>
                <CurrencySelector value={activeCurrency} onValueChange={setCurrency} />
                <Button onClick={handleCurrencySave} disabled={updateProfile.isPending} size="sm">
                  {updateProfile.isPending ? "Saving…" : "Save Currency"}
                </Button>
              </CardContent>
            </Card>

            {/* Change Password */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <h2 className="font-heading font-semibold flex items-center gap-2">
                  <Key className="w-4 h-4" /> Change Password
                </h2>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label>New Password</Label>
                    <Input type="password" placeholder="••••••••" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Confirm Password</Label>
                    <Input type="password" placeholder="••••••••" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                  </div>
                  <Button onClick={handleChangePassword} disabled={changingPw || !newPassword} size="sm">
                    {changingPw ? "Changing…" : "Change Password"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Data Export */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <h2 className="font-heading font-semibold flex items-center gap-2">
                  <Download className="w-4 h-4" /> Export Data
                </h2>
                {canExport ? (
                  <>
                    <p className="text-sm text-muted-foreground">Download your data as CSV files.</p>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" onClick={exportDebts}>
                        <Download className="w-3.5 h-3.5 mr-1.5" /> Debts
                      </Button>
                      <Button variant="outline" size="sm" onClick={exportPayments}>
                        <Download className="w-3.5 h-3.5 mr-1.5" /> Payments
                      </Button>
                      <Button variant="outline" size="sm" onClick={exportReports}>
                        <Download className="w-3.5 h-3.5 mr-1.5" /> Weekly Reports
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/5 border border-accent/20">
                    <Lock className="w-4 h-4 text-accent flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">CSV export is available on Pro</p>
                      <a href="/subscription" className="text-xs text-accent hover:underline">Upgrade to Pro →</a>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Reset Journey */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <h2 className="font-heading font-semibold flex items-center gap-2">
                  <RotateCcw className="w-4 h-4" /> Reset Journey
                </h2>
                <p className="text-sm text-muted-foreground">
                  Start your journey progress tracking fresh from today. This resets your journey start date and milestones but keeps all your debts and payment history.
                </p>
                <Button variant="outline" size="sm" onClick={() => setShowResetJourney(true)}>
                  Reset Journey Progress
                </Button>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-destructive/30">
              <CardContent className="p-6 space-y-4">
                <h2 className="font-heading font-semibold text-destructive flex items-center gap-2">
                  <Trash2 className="w-4 h-4" /> Danger Zone
                </h2>
                <p className="text-sm text-muted-foreground">
                  Deleting your account will remove all your debts, payments, and reports. This cannot be undone.
                </p>
                <Button variant="destructive" size="sm" onClick={() => setShowDeleteConfirm(true)}>
                  Delete Account Data
                </Button>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Delete Account Data"
        description="This will permanently delete all your debts, payments, milestones, and reports. This action cannot be undone."
        onConfirm={handleDeleteAccount}
        loading={deleting}
      />
      <ConfirmDialog
        open={showResetJourney}
        onOpenChange={setShowResetJourney}
        title="Reset Journey"
        description="This will reset your journey start date to today and clear all milestones. Your debts and payment history will NOT be deleted. Continue?"
        onConfirm={handleResetJourney}
        loading={resetting}
      />
    </AppLayout>
  );
}
