import { motion } from "framer-motion";
import { TrendingDown, DollarSign, CreditCard, Target, ArrowRight, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import AppLayout from "@/components/AppLayout";

const stats = [
  { label: "Total Debt", value: "$24,350", icon: CreditCard, change: "-$1,200 this month" },
  { label: "Monthly Payment", value: "$890", icon: DollarSign, change: "On track" },
  { label: "Debts Remaining", value: "4", icon: TrendingDown, change: "1 paid off!" },
  { label: "Debt-Free Date", value: "Mar 2028", icon: Target, change: "2 years away" },
];

const debts = [
  { name: "Chase Visa", balance: 4200, original: 8500, rate: 19.99, minPayment: 120 },
  { name: "Student Loan", balance: 12500, original: 25000, rate: 5.5, minPayment: 280 },
  { name: "Car Loan", balance: 6150, original: 18000, rate: 4.2, minPayment: 350 },
  { name: "Medical Bill", balance: 1500, original: 3200, rate: 0, minPayment: 140 },
];

export default function Dashboard() {
  const totalOriginal = debts.reduce((s, d) => s + d.original, 0);
  const totalBalance = debts.reduce((s, d) => s + d.balance, 0);
  const overallProgress = Math.round(((totalOriginal - totalBalance) / totalOriginal) * 100);

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl lg:text-3xl font-bold">Welcome back! 👋</h1>
            <p className="text-muted-foreground text-sm mt-1">Here's your debt payoff overview.</p>
          </div>
          <Button asChild>
            <Link to="/add-debt"><Plus className="w-4 h-4 mr-2" /> Add Debt</Link>
          </Button>
        </div>

        {/* Overall progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl text-primary-foreground" style={{ background: "var(--gradient-hero)" }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-primary-foreground/70 text-sm font-medium">Overall Progress</p>
              <p className="text-4xl font-heading font-extrabold mt-1">{overallProgress}% Paid Off</p>
              <p className="text-primary-foreground/60 text-sm mt-1">
                ${(totalOriginal - totalBalance).toLocaleString()} of ${totalOriginal.toLocaleString()} eliminated
              </p>
            </div>
            <div className="w-full md:w-64">
              <div className="h-3 rounded-full bg-primary-foreground/20 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-accent"
                  initial={{ width: 0 }}
                  animate={{ width: `${overallProgress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <s.icon className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <p className="text-2xl font-heading font-bold">{s.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
                  <p className="text-xs text-success font-medium mt-2">{s.change}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Debts list */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-xl font-semibold">Your Debts</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/debts">View all <ArrowRight className="ml-1 w-3 h-3" /></Link>
            </Button>
          </div>
          <div className="space-y-3">
            {debts.map((debt, i) => {
              const progress = Math.round(((debt.original - debt.balance) / debt.original) * 100);
              return (
                <motion.div
                  key={debt.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold truncate">{debt.name}</p>
                          <span className="text-xs text-muted-foreground">{debt.rate}% APR</span>
                        </div>
                        <div className="mt-2">
                          <Progress value={progress} className="h-2" />
                        </div>
                        <div className="flex justify-between mt-1.5 text-xs text-muted-foreground">
                          <span>${debt.balance.toLocaleString()} remaining</span>
                          <span>{progress}%</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link to="/debts">Details</Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
