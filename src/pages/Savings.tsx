import { useState } from "react";
import { PiggyBank, Plus, Pencil, Trash2, ArrowDownCircle, ArrowUpCircle, TrendingUp, Crown } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/currency";
import CurrencySelector from "@/components/CurrencySelector";
import ConfirmDialog from "@/components/ConfirmDialog";
import { useProfile } from "@/hooks/useProfile";
import { useFeatureAccess } from "@/hooks/useSubscription";
import {
  useSavingsAccounts,
  useAddSavingsAccount,
  useUpdateSavingsAccount,
  useDeleteSavingsAccount,
  useAddSavingsTransaction,
} from "@/hooks/useSavings";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

type TransactionType = "deposit" | "withdrawal";

const FREE_SAVINGS_LIMIT = 2;

export default function Savings() {
  const { data: accounts, isLoading } = useSavingsAccounts();
  const { data: profile } = useProfile();
  const defaultCurrency = (profile as any)?.default_currency ?? "USD";
  const { hasAccess: hasUnlimitedSavings } = useFeatureAccess("unlimitedSavings");

  const addAccount = useAddSavingsAccount();
  const updateAccount = useUpdateSavingsAccount();
  const deleteAccount = useDeleteSavingsAccount();
  const addTransaction = useAddSavingsTransaction();

  const [addOpen, setAddOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newBalance, setNewBalance] = useState("");
  const [newCurrency, setNewCurrency] = useState(defaultCurrency);
  const [addingAccount, setAddingAccount] = useState(false);

  const [editAccount, setEditAccount] = useState<any>(null);
  const [editName, setEditName] = useState("");
  const [editingAccount, setEditingAccount] = useState(false);

  const [txAccount, setTxAccount] = useState<any>(null);
  const [txType, setTxType] = useState<TransactionType>("deposit");
  const [txAmount, setTxAmount] = useState("");
  const [txNotes, setTxNotes] = useState("");
  const [addingTx, setAddingTx] = useState(false);

  const [deleteAcc, setDeleteAcc] = useState<any>(null);
  const [deleting, setDeleting] = useState(false);

  const totalSavings = accounts?.reduce((s, a) => s + (a.balance ?? 0), 0) ?? 0;
  const accountCount = accounts?.length ?? 0;
  const atFreeLimit = !hasUnlimitedSavings && accountCount >= FREE_SAVINGS_LIMIT;

  const handleAddAccount = async () => {
    if (!newName || !newBalance) return;
    if (atFreeLimit) {
      toast.error("Upgrade to Pro to add unlimited savings accounts.");
      return;
    }
    setAddingAccount(true);
    try {
      await addAccount.mutateAsync({
        account_name: newName,
        balance: parseFloat(newBalance),
        currency: newCurrency,
      });
      toast.success(`${newName} added! 💰`);
      setAddOpen(false);
      setNewName(""); setNewBalance(""); setNewCurrency(defaultCurrency);
    } catch {
      toast.error("Failed to add account. Please try again.");
    } finally {
      setAddingAccount(false);
    }
  };

  const handleEditAccount = async () => {
    if (!editAccount || !editName) return;
    setEditingAccount(true);
    try {
      await updateAccount.mutateAsync({ id: editAccount.id, account_name: editName });
      toast.success("Account updated");
      setEditAccount(null);
    } catch {
      toast.error("Failed to update account.");
    } finally {
      setEditingAccount(false);
    }
  };

  const handleAddTransaction = async () => {
    if (!txAccount || !txAmount) return;
    const amt = parseFloat(txAmount);
    if (isNaN(amt) || amt <= 0) { toast.error("Please enter a valid amount."); return; }
    setAddingTx(true);
    try {
      await addTransaction.mutateAsync({
        savings_account_id: txAccount.id,
        amount: amt,
        type: txType,
        notes: txNotes || undefined,
        current_balance: txAccount.balance,
      });
      toast.success(txType === "deposit" ? "Deposit recorded! 💰" : "Withdrawal recorded");
      setTxAccount(null); setTxAmount(""); setTxNotes("");
    } catch {
      toast.error("Failed to record transaction.");
    } finally {
      setAddingTx(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteAcc) return;
    setDeleting(true);
    try {
      await deleteAccount.mutateAsync(deleteAcc.id);
      toast.success("Account deleted");
      setDeleteAcc(null);
    } catch {
      toast.error("Failed to delete account.");
    } finally {
      setDeleting(false);
    }
  };

  const previewBalance =
    txAccount && txAmount && !isNaN(parseFloat(txAmount))
      ? Math.max(0, txAccount.balance + (txType === "deposit" ? 1 : -1) * parseFloat(txAmount))
      : null;

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">

        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-heading text-2xl font-bold">Savings</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {accountCount} {accountCount === 1 ? "account" : "accounts"}
              {accounts && accounts.length > 0 && ` · Total ${formatCurrency(totalSavings, defaultCurrency)}`}
              {!hasUnlimitedSavings && ` · ${accountCount}/${FREE_SAVINGS_LIMIT} free`}
            </p>
          </div>
          {atFreeLimit ? (
            <Button asChild>
              <Link to="/subscription">
                <Crown className="w-4 h-4 mr-2" />Upgrade for More
              </Link>
            </Button>
          ) : (
            <Button onClick={() => setAddOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />Add Account
            </Button>
          )}
        </div>

        {/* Free limit banner */}
        {atFreeLimit && (
          <Card className="border-accent/30 bg-accent/5">
            <CardContent className="p-4 flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-accent flex-shrink-0" />
                <p className="text-sm font-medium">You've used your {FREE_SAVINGS_LIMIT} free savings accounts.</p>
              </div>
              <Button size="sm" asChild>
                <Link to="/subscription">Upgrade to Pro for unlimited</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {accounts && accounts.length > 0 && (
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Savings</p>
                <p className="font-heading text-2xl font-bold text-primary">{formatCurrency(totalSavings, defaultCurrency)}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Across {accountCount} {accountCount === 1 ? "account" : "accounts"}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {isLoading ? (
          <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}</div>
        ) : accounts && accounts.length > 0 ? (
          <div className="space-y-3">
            {accounts.map((account) => (
              <Card key={account.id}>
                <CardContent className="p-4 sm:p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="hidden sm:flex w-10 h-10 rounded-lg bg-secondary items-center justify-center flex-shrink-0">
                      <PiggyBank className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold">{account.account_name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{account.currency}</p>
                      <p className="font-heading text-xl font-bold text-primary mt-1">{formatCurrency(account.balance, account.currency)}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0 flex-wrap">
                      <Button size="sm" variant="outline" className="text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
                        onClick={() => { setTxAccount(account); setTxType("deposit"); setTxAmount(""); setTxNotes(""); }}>
                        <ArrowDownCircle className="w-3.5 h-3.5 mr-1" />Deposit
                      </Button>
                      <Button size="sm" variant="outline" className="text-orange-600 border-orange-200 hover:bg-orange-50 hover:text-orange-700"
                        onClick={() => { setTxAccount(account); setTxType("withdrawal"); setTxAmount(""); setTxNotes(""); }}>
                        <ArrowUpCircle className="w-3.5 h-3.5 mr-1" />Withdraw
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => { setEditAccount(account); setEditName(account.account_name); }}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => setDeleteAcc(account)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-10 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <PiggyBank className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h2 className="font-heading text-xl font-bold">Start Building Your Savings</h2>
                <p className="text-muted-foreground text-sm mt-2 max-w-sm mx-auto">
                  Add your savings accounts — emergency fund, vacation fund, or any savings goal — and track your balance over time.
                </p>
              </div>
              <Button size="lg" onClick={() => setAddOpen(true)}><Plus className="w-4 h-4 mr-2" />Add Your First Account</Button>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Savings Account</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label>Account Name</Label>
              <Input placeholder="e.g., Emergency Fund, Vacation Fund" value={newName} onChange={e => setNewName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Current Balance</Label>
              <Input type="number" step="0.01" min="0" placeholder="0.00" value={newBalance} onChange={e => setNewBalance(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Currency</Label>
              <CurrencySelector value={newCurrency} onValueChange={setNewCurrency} />
            </div>
            <div className="flex gap-2 pt-2">
              <Button onClick={handleAddAccount} disabled={addingAccount || !newName || !newBalance} className="flex-1">
                {addingAccount ? "Adding…" : "Add Account"}
              </Button>
              <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editAccount} onOpenChange={o => !o && setEditAccount(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Account</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label>Account Name</Label>
              <Input value={editName} onChange={e => setEditName(e.target.value)} />
            </div>
            <div className="flex gap-2 pt-2">
              <Button onClick={handleEditAccount} disabled={editingAccount || !editName} className="flex-1">
                {editingAccount ? "Saving…" : "Save Changes"}
              </Button>
              <Button variant="outline" onClick={() => setEditAccount(null)}>Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!txAccount} onOpenChange={o => !o && setTxAccount(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{txType === "deposit" ? "Record Deposit" : "Record Withdrawal"}</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="flex gap-2">
              <button onClick={() => setTxType("deposit")} className={cn("flex-1 py-2.5 rounded-lg text-sm font-medium border transition-all", txType === "deposit" ? "bg-green-50 border-green-300 text-green-700" : "border-border text-muted-foreground hover:border-primary/50")}>💰 Deposit</button>
              <button onClick={() => setTxType("withdrawal")} className={cn("flex-1 py-2.5 rounded-lg text-sm font-medium border transition-all", txType === "withdrawal" ? "bg-orange-50 border-orange-300 text-orange-700" : "border-border text-muted-foreground hover:border-primary/50")}>💸 Withdrawal</button>
            </div>
            <div className="space-y-2">
              <Label>Amount ({txAccount?.currency})</Label>
              <Input type="number" step="0.01" min="0" placeholder="0.00" value={txAmount} onChange={e => setTxAmount(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Notes <span className="text-muted-foreground">(optional)</span></Label>
              <Input placeholder="e.g., Monthly savings transfer" value={txNotes} onChange={e => setTxNotes(e.target.value)} />
            </div>
            {txAccount && (
              <div className="rounded-lg bg-muted/50 p-3 text-sm space-y-1">
                <div className="flex justify-between text-muted-foreground">
                  <span>Current balance</span>
                  <span>{formatCurrency(txAccount.balance, txAccount.currency)}</span>
                </div>
                {previewBalance !== null && (
                  <div className="flex justify-between font-medium">
                    <span>New balance</span>
                    <span className={txType === "deposit" ? "text-green-600" : "text-orange-600"}>{formatCurrency(previewBalance, txAccount.currency)}</span>
                  </div>
                )}
              </div>
            )}
            <div className="flex gap-2 pt-2">
              <Button onClick={handleAddTransaction} disabled={addingTx || !txAmount} className="flex-1">
                {addingTx ? "Saving…" : txType === "deposit" ? "Record Deposit" : "Record Withdrawal"}
              </Button>
              <Button variant="outline" onClick={() => setTxAccount(null)}>Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteAcc}
        onOpenChange={o => !o && setDeleteAcc(null)}
        title="Delete Account"
        description={`Are you sure you want to delete "${deleteAcc?.account_name}"? All transactions will be permanently deleted.`}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </AppLayout>
  );
}
