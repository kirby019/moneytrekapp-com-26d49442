import { useState } from "react";
import { Target, Plus, Pencil, Trash2, PlusCircle, CalendarDays, CheckCircle2 } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/currency";
import CurrencySelector from "@/components/CurrencySelector";
import ConfirmDialog from "@/components/ConfirmDialog";
import UpgradePrompt from "@/components/UpgradePrompt";
import { useProfile } from "@/hooks/useProfile";
import { useFeatureAccess } from "@/hooks/useSubscription";
import {
  useFinancialGoals,
  useAddFinancialGoal,
  useUpdateFinancialGoal,
  useDeleteFinancialGoal,
} from "@/hooks/useFinancialGoals";
import { toast } from "sonner";

function daysRemaining(targetDate: string | null): number | null {
  if (!targetDate) return null;
  const diff = new Date(targetDate).getTime() - new Date().getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function Goals() {
  const { hasAccess } = useFeatureAccess("financialGoals");
  const { data: goals, isLoading } = useFinancialGoals();
  const { data: profile } = useProfile();
  const defaultCurrency = (profile as any)?.default_currency ?? "USD";

  const addGoal = useAddFinancialGoal();
  const updateGoal = useUpdateFinancialGoal();
  const deleteGoal = useDeleteFinancialGoal();

  const [addOpen, setAddOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newTarget, setNewTarget] = useState("");
  const [newCurrent, setNewCurrent] = useState("");
  const [newCurrency, setNewCurrency] = useState(defaultCurrency);
  const [newDate, setNewDate] = useState("");
  const [addingGoal, setAddingGoal] = useState(false);

  const [editGoal, setEditGoal] = useState<any>(null);
  const [editName, setEditName] = useState("");
  const [editTarget, setEditTarget] = useState("");
  const [editCurrent, setEditCurrent] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editingGoal, setEditingGoal] = useState(false);

  const [addMoneyGoal, setAddMoneyGoal] = useState<any>(null);
  const [addAmount, setAddAmount] = useState("");
  const [addingMoney, setAddingMoney] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [deleting, setDeleting] = useState(false);

  const totalTarget = goals?.reduce((s, g) => s + (g.target_amount ?? 0), 0) ?? 0;
  const totalSaved = goals?.reduce((s, g) => s + (g.current_amount ?? 0), 0) ?? 0;
  const completedCount = goals?.filter(g => (g.current_amount ?? 0) >= (g.target_amount ?? 0)).length ?? 0;

  // Pro gate
  if (!hasAccess) {
    return (
      <AppLayout>
        <UpgradePrompt
          fullPage
          title="Financial Goals"
          message="Set savings goals, track progress toward targets, and celebrate when you hit them. Upgrade to Pro — or start your free 7-day trial — to unlock Financial Goals."
        />
      </AppLayout>
    );
  }

  const handleAddGoal = async () => {
    if (!newName || !newTarget) return;
    setAddingGoal(true);
    try {
      await addGoal.mutateAsync({
        goal_name: newName,
        target_amount: parseFloat(newTarget),
        current_amount: parseFloat(newCurrent || "0"),
        currency: newCurrency,
        target_date: newDate || null,
      });
      toast.success(`${newName} goal created! 🎯`);
      setAddOpen(false);
      setNewName(""); setNewTarget(""); setNewCurrent(""); setNewDate(""); setNewCurrency(defaultCurrency);
    } catch {
      toast.error("Failed to create goal. Please try again.");
    } finally {
      setAddingGoal(false);
    }
  };

  const handleEditGoal = async () => {
    if (!editGoal || !editName || !editTarget) return;
    setEditingGoal(true);
    try {
      await updateGoal.mutateAsync({
        id: editGoal.id,
        goal_name: editName,
        target_amount: parseFloat(editTarget),
        current_amount: parseFloat(editCurrent || "0"),
        target_date: editDate || null,
      });
      toast.success("Goal updated!");
      setEditGoal(null);
    } catch {
      toast.error("Failed to update goal.");
    } finally {
      setEditingGoal(false);
    }
  };

  const handleAddMoney = async () => {
    if (!addMoneyGoal || !addAmount) return;
    const amt = parseFloat(addAmount);
    if (isNaN(amt) || amt <= 0) { toast.error("Enter a valid amount."); return; }
    setAddingMoney(true);
    try {
      const newAmount = (addMoneyGoal.current_amount ?? 0) + amt;
      await updateGoal.mutateAsync({ id: addMoneyGoal.id, current_amount: newAmount });
      const isComplete = newAmount >= addMoneyGoal.target_amount;
      toast.success(isComplete
        ? `🎉 Goal reached! You've saved ${formatCurrency(newAmount, addMoneyGoal.currency)}!`
        : `Added ${formatCurrency(amt, addMoneyGoal.currency)} toward ${addMoneyGoal.goal_name}!`
      );
      setAddMoneyGoal(null);
      setAddAmount("");
    } catch {
      toast.error("Failed to update goal.");
    } finally {
      setAddingMoney(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteGoal.mutateAsync(deleteTarget.id);
      toast.success("Goal deleted");
      setDeleteTarget(null);
    } catch {
      toast.error("Failed to delete goal.");
    } finally {
      setDeleting(false);
    }
  };

  const openEdit = (goal: any) => {
    setEditGoal(goal);
    setEditName(goal.goal_name);
    setEditTarget(String(goal.target_amount));
    setEditCurrent(String(goal.current_amount));
    setEditDate(goal.target_date ?? "");
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">

        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-heading text-2xl font-bold">Financial Goals</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {goals?.length ?? 0} {goals?.length === 1 ? "goal" : "goals"}
              {completedCount > 0 && ` · ${completedCount} completed 🏆`}
            </p>
          </div>
          <Button onClick={() => setAddOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />Add Goal
          </Button>
        </div>

        {goals && goals.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">Total Saved</p>
                <p className="font-heading text-xl font-bold text-primary mt-1">{formatCurrency(totalSaved, defaultCurrency)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">Total Target</p>
                <p className="font-heading text-xl font-bold mt-1">{formatCurrency(totalTarget, defaultCurrency)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">Overall Progress</p>
                <p className="font-heading text-xl font-bold mt-1">
                  {totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0}%
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {isLoading ? (
          <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-32 w-full rounded-xl" />)}</div>
        ) : goals && goals.length > 0 ? (
          <div className="space-y-3">
            {goals.map((goal) => {
              const progress = goal.target_amount > 0 ? Math.min(100, Math.round((goal.current_amount / goal.target_amount) * 100)) : 0;
              const isComplete = goal.current_amount >= goal.target_amount;
              const days = daysRemaining(goal.target_date);
              return (
                <Card key={goal.id} className={isComplete ? "border-green-200 bg-green-50/30" : ""}>
                  <CardContent className="p-4 sm:p-5 space-y-3">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold">{goal.goal_name}</p>
                        {isComplete && (
                          <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
                            <CheckCircle2 className="w-3 h-3 mr-1" />Goal Reached!
                          </Badge>
                        )}
                        {!isComplete && days !== null && (
                          <Badge variant="outline" className="text-xs">
                            <CalendarDays className="w-3 h-3 mr-1" />
                            {days > 0 ? `${days} days left` : days === 0 ? "Due today!" : "Overdue"}
                          </Badge>
                        )}
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        {!isComplete && (
                          <Button size="sm" variant="outline" className="text-primary border-primary/30 hover:bg-primary/5"
                            onClick={() => { setAddMoneyGoal(goal); setAddAmount(""); }}>
                            <PlusCircle className="w-3.5 h-3.5 mr-1" />Add Money
                          </Button>
                        )}
                        <Button size="icon" variant="ghost" onClick={() => openEdit(goal)}><Pencil className="w-4 h-4" /></Button>
                        <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => setDeleteTarget(goal)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Progress value={progress} className="h-2.5" />
                      <div className="flex justify-between mt-1.5 text-xs text-muted-foreground">
                        <span>{formatCurrency(goal.current_amount, goal.currency)} saved</span>
                        <span className="font-medium">{progress}% of {formatCurrency(goal.target_amount, goal.currency)}</span>
                      </div>
                    </div>
                    {goal.target_date && (
                      <p className="text-xs text-muted-foreground">
                        Target date: {new Date(goal.target_date).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="p-10 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h2 className="font-heading text-xl font-bold">Set Your First Financial Goal</h2>
                <p className="text-muted-foreground text-sm mt-2 max-w-sm mx-auto">
                  Set a savings goal — a vacation, emergency fund, new phone, or anything you're working toward — and track your progress.
                </p>
              </div>
              <Button size="lg" onClick={() => setAddOpen(true)}><Plus className="w-4 h-4 mr-2" />Create Your First Goal</Button>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Create Financial Goal</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label>Goal Name</Label>
              <Input placeholder="e.g., Emergency Fund, Vacation, New Car" value={newName} onChange={e => setNewName(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Target Amount</Label>
                <Input type="number" step="0.01" min="0" placeholder="0.00" value={newTarget} onChange={e => setNewTarget(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Already Saved</Label>
                <Input type="number" step="0.01" min="0" placeholder="0.00" value={newCurrent} onChange={e => setNewCurrent(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Currency</Label>
              <CurrencySelector value={newCurrency} onValueChange={setNewCurrency} />
            </div>
            <div className="space-y-2">
              <Label>Target Date <span className="text-muted-foreground">(optional)</span></Label>
              <Input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} min={new Date().toISOString().split("T")[0]} />
            </div>
            <div className="flex gap-2 pt-2">
              <Button onClick={handleAddGoal} disabled={addingGoal || !newName || !newTarget} className="flex-1">
                {addingGoal ? "Creating…" : "Create Goal"}
              </Button>
              <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editGoal} onOpenChange={o => !o && setEditGoal(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Goal</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label>Goal Name</Label>
              <Input value={editName} onChange={e => setEditName(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Target Amount</Label>
                <Input type="number" step="0.01" min="0" value={editTarget} onChange={e => setEditTarget(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Amount Saved</Label>
                <Input type="number" step="0.01" min="0" value={editCurrent} onChange={e => setEditCurrent(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Target Date <span className="text-muted-foreground">(optional)</span></Label>
              <Input type="date" value={editDate} onChange={e => setEditDate(e.target.value)} />
            </div>
            <div className="flex gap-2 pt-2">
              <Button onClick={handleEditGoal} disabled={editingGoal || !editName || !editTarget} className="flex-1">
                {editingGoal ? "Saving…" : "Save Changes"}
              </Button>
              <Button variant="outline" onClick={() => setEditGoal(null)}>Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!addMoneyGoal} onOpenChange={o => !o && setAddMoneyGoal(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Money — {addMoneyGoal?.goal_name}</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label>Amount ({addMoneyGoal?.currency})</Label>
              <Input type="number" step="0.01" min="0" placeholder="0.00" value={addAmount} onChange={e => setAddAmount(e.target.value)} />
            </div>
            {addMoneyGoal && (
              <div className="rounded-lg bg-muted/50 p-3 text-sm space-y-1">
                <div className="flex justify-between text-muted-foreground">
                  <span>Currently saved</span>
                  <span>{formatCurrency(addMoneyGoal.current_amount, addMoneyGoal.currency)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Target</span>
                  <span>{formatCurrency(addMoneyGoal.target_amount, addMoneyGoal.currency)}</span>
                </div>
                {addAmount && !isNaN(parseFloat(addAmount)) && (
                  <div className="flex justify-between font-medium text-primary border-t border-border pt-1 mt-1">
                    <span>New total</span>
                    <span>{formatCurrency((addMoneyGoal.current_amount ?? 0) + parseFloat(addAmount), addMoneyGoal.currency)}</span>
                  </div>
                )}
              </div>
            )}
            <div className="flex gap-2 pt-2">
              <Button onClick={handleAddMoney} disabled={addingMoney || !addAmount} className="flex-1">
                {addingMoney ? "Saving…" : "Add Money"}
              </Button>
              <Button variant="outline" onClick={() => setAddMoneyGoal(null)}>Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={o => !o && setDeleteTarget(null)}
        title="Delete Goal"
        description={`Are you sure you want to delete "${deleteTarget?.goal_name}"? This cannot be undone.`}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </AppLayout>
  );
}
