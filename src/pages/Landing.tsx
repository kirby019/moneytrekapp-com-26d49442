import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight, Sparkles, CreditCard, History, BarChart3, CalendarCheck,
  Globe, LineChart, Download, Shield, Star, CheckCircle2, TrendingDown,
  DollarSign, Target, Users, Zap, ChevronRight, PiggyBank, Wallet, TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useLocalizedPrice, useLocalizedCurrency } from "@/hooks/useLocalizedPrice";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const features = [
  { icon: CreditCard, title: "Debt Tracking", desc: "Add all your debts in one place with balances, interest rates, and due dates." },
  { icon: PiggyBank, title: "Savings Tracking", desc: "Track your savings accounts, deposits, and watch your money grow over time." },
  { icon: Target, title: "Financial Goals", desc: "Set savings and debt payoff goals, then track your progress toward each one." },
  { icon: BarChart3, title: "Progress Dashboard", desc: "Visual overview of your debt, savings, net worth, and milestones." },
  { icon: CalendarCheck, title: "Weekly Reports", desc: "Automated weekly summaries of payments made, money saved, and progress." },
  { icon: LineChart, title: "Analytics & Charts", desc: "Beautiful charts showing debt reduction, savings growth, and net worth trends." },
  { icon: Globe, title: "Multi-Currency", desc: "Track finances in any currency with automatic exchange rate conversion." },
  { icon: Download, title: "Data Export", desc: "Export your debts, savings, payments, and reports as CSV files anytime." },
  { icon: Shield, title: "Secure Account", desc: "Your data is protected with row-level security and encrypted authentication." },
  { icon: Wallet, title: "Net Worth Tracking", desc: "See your full financial picture — savings minus debt — updated in real time." },
];

const steps = [
  { icon: CreditCard, title: "Add Debts & Savings", desc: "Enter your debts with balances and interest rates, and add your savings accounts." },
  { icon: DollarSign, title: "Record Payments & Deposits", desc: "Log payments toward debt and deposits into savings as you make them." },
  { icon: Target, title: "Track Your Progress", desc: "Watch your net worth grow, earn milestones, and get weekly reports automatically." },
];

const testimonials = [
  { name: "Alex", country: "Philippines", quote: "This app helped me organize all my debts and savings in one place. I can finally see my full financial picture.", rating: 5 },
  { name: "Maria", country: "Singapore", quote: "I love the dashboard showing my net worth going up as I pay off debt and save more each month.", rating: 5 },
  { name: "John", country: "Australia", quote: "Multi-currency support is very useful because I have loans and savings in different currencies.", rating: 5 },
];

// Raw USD amounts for mockups — will be converted at render time
const mockStatsRaw = [
  { label: "Total Debt", usd: 24500, change: "-12%", icon: CreditCard },
  { label: "Total Savings", usd: 18300, change: "+22%", icon: PiggyBank },
  { label: "Net Worth", usd: -6200, change: "Improving", icon: TrendingUp },
  { label: "Progress", value: "58%", change: "On track", icon: Target },
  { label: "Paid This Month", usd: 1400, change: "3 debts", icon: DollarSign },
  { label: "Saved This Month", usd: 850, change: "+15%", icon: Wallet },
];

const mockDebtsRaw = [
  { name: "Chase Visa", usd: 4200, pct: 35, type: "debt" as const },
  { name: "Student Loan", usd: 12500, pct: 18, type: "debt" as const },
  { name: "Emergency Fund", usd: 8500, pct: 68, type: "savings" as const },
  { name: "Vacation Goal", usd: 2400, pct: 48, type: "savings" as const },
];

function ProPricingCard() {
  const { price, currency } = useLocalizedPrice(2);
  const showLocal = currency !== "USD";

  return (
    <motion.div {...fadeUp} transition={{ delay: 0.2 }}>
      <Card className="h-full relative overflow-hidden hover:shadow-lg transition-shadow">
        <div className="absolute top-0 right-0 bg-accent text-accent-foreground text-[10px] font-bold px-3 py-1 rounded-bl-lg">Coming Soon</div>
        <CardContent className="p-6">
          <div className="mb-4">
            <span className="text-xs font-semibold text-muted-foreground uppercase">Pro</span>
            <p className="font-heading text-3xl font-extrabold mt-1">
              {price}<span className="text-sm font-normal text-muted-foreground">/month</span>
            </p>
            {showLocal && (
              <p className="text-xs text-muted-foreground mt-1">≈ $2.00 USD</p>
            )}
          </div>
          <ul className="space-y-2.5 mb-6">
            {["Everything in Free", "Advanced analytics", "Payment reminders", "Priority support", "Custom reports", "Goal setting tools"].map(f => (
              <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="w-4 h-4 text-muted-foreground/50 flex-shrink-0" />
                {f}
              </li>
            ))}
          </ul>
          <Button variant="outline" className="w-full" disabled>Coming Soon</Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function Landing() {
  const { format: fmt } = useLocalizedCurrency();

  const mockStats = mockStatsRaw.map(s => ({
    ...s,
    value: s.usd != null ? fmt(s.usd) : s.value!,
    change: s.change!,
  }));

  const mockItems = mockDebtsRaw.map(d => ({
    ...d,
    bal: fmt(d.usd),
  }));

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="flex items-center justify-between px-4 sm:px-6 lg:px-12 py-4 bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-30">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--gradient-primary)" }}>
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-heading font-bold text-lg">Debt Free Journey</span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <Button variant="ghost" size="sm" asChild><Link to="/login">Log in</Link></Button>
          <Button size="sm" asChild><Link to="/signup">Get Started</Link></Button>
        </div>
      </nav>

      {/* ==================== HERO ==================== */}
      <section className="relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 py-16 sm:py-20 lg:py-28 relative z-10">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left - Copy */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-accent/20 text-accent mb-6">
                <Zap className="w-3 h-3" /> Your path to financial freedom
              </span>
              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-[1.1] mb-5 text-primary-foreground">
                Pay Off Debt. <span className="text-accent">Build Savings.</span> Track Progress.
              </h1>
              <p className="text-base sm:text-lg text-primary-foreground/70 mb-8 max-w-lg leading-relaxed">
                Track your debts, grow your savings, and monitor your financial progress — all in one simple app designed to help you take control of your money.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg shadow-accent/20" asChild>
                  <Link to="/signup">
                    Get Started <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white/40 text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm" asChild>
                  <Link to="/login">View Demo</Link>
                </Button>
              </div>
              <div className="flex items-center gap-6 mt-8 text-primary-foreground/50 text-sm">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-accent" /> No credit card</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-accent" /> Cancel anytime</span>
                <span className="flex items-center gap-1.5 hidden sm:flex"><CheckCircle2 className="w-4 h-4 text-accent" /> Multi-currency</span>
              </div>
            </motion.div>

            {/* Right - Dashboard Mockup */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="bg-card/10 backdrop-blur-md rounded-2xl border border-primary-foreground/10 p-5 shadow-2xl">
                {/* Mini stat cards */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {mockStats.slice(0, 3).map(s => (
                    <div key={s.label} className="bg-card/90 backdrop-blur rounded-xl p-3.5 border border-border/50">
                      <div className="flex items-center justify-between mb-2">
                        <s.icon className="w-4 h-4 text-muted-foreground" />
                        <span className="text-[10px] font-medium text-accent">{s.change}</span>
                      </div>
                      <p className="font-heading text-lg font-bold text-card-foreground">{s.value}</p>
                      <p className="text-[10px] text-muted-foreground">{s.label}</p>
                    </div>
                  ))}
                </div>
                {/* Progress bar mockup */}
                <div className="bg-card/90 backdrop-blur rounded-xl p-4 border border-border/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-card-foreground">Financial Progress</span>
                    <span className="text-xs font-bold text-accent">58%</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-accent"
                      initial={{ width: 0 }}
                      animate={{ width: "58%" }}
                      transition={{ duration: 1.2, delay: 0.8 }}
                    />
                  </div>
                  <div className="flex justify-between mt-2 text-[10px] text-muted-foreground">
                    <span>Debt: {fmt(24500)}</span>
                    <span>Savings: {fmt(18300)}</span>
                  </div>
                </div>
                {/* Mini chart mockup - dual bars */}
                <div className="bg-card/90 backdrop-blur rounded-xl p-4 border border-border/50 mt-3">
                  <span className="text-xs font-semibold text-card-foreground mb-3 block">Debt ↓ &amp; Savings ↑</span>
                  <div className="flex items-end gap-1.5 h-16">
                    {[
                      { debt: 90, savings: 10 }, { debt: 85, savings: 18 }, { debt: 78, savings: 25 },
                      { debt: 72, savings: 32 }, { debt: 68, savings: 40 }, { debt: 62, savings: 48 },
                      { debt: 58, savings: 55 }, { debt: 52, savings: 60 }, { debt: 48, savings: 68 },
                      { debt: 42, savings: 72 }, { debt: 38, savings: 78 }, { debt: 32, savings: 85 },
                    ].map((d, i) => (
                      <div key={i} className="flex-1 flex gap-px items-end h-full">
                        <motion.div
                          className="flex-1 rounded-t bg-destructive/50"
                          initial={{ height: 0 }}
                          animate={{ height: `${d.debt}%` }}
                          transition={{ duration: 0.5, delay: 0.8 + i * 0.05 }}
                        />
                        <motion.div
                          className="flex-1 rounded-t bg-accent/70"
                          initial={{ height: 0 }}
                          animate={{ height: `${d.savings}%` }}
                          transition={{ duration: 0.5, delay: 0.9 + i * 0.05 }}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-1.5 text-[8px] text-muted-foreground">
                    <span>Jan</span><span>Jun</span><span>Dec</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        {/* Decorative */}
        <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute bottom-10 left-1/4 w-48 h-48 rounded-full bg-primary-foreground/5 blur-2xl" />
      </section>

      {/* ==================== DASHBOARD PREVIEW ==================== */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-12 py-16 sm:py-20">
        <motion.div {...fadeUp} transition={{ duration: 0.6 }} className="text-center mb-12">
          <span className="text-xs font-semibold text-accent uppercase tracking-wider">Dashboard Preview</span>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold mt-2 mb-3">Your Complete Financial Picture</h2>
          <p className="text-muted-foreground max-w-md mx-auto text-sm">See your debt, savings, net worth, and progress — all in one clean dashboard.</p>
        </motion.div>
        <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.15 }}>
          <div className="max-w-4xl mx-auto bg-card rounded-2xl border border-border shadow-xl overflow-hidden">
            {/* Fake window bar */}
            <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b border-border">
              <div className="w-3 h-3 rounded-full bg-destructive/60" />
              <div className="w-3 h-3 rounded-full bg-warning/60" />
              <div className="w-3 h-3 rounded-full bg-accent/60" />
              <span className="ml-3 text-xs text-muted-foreground">app.debtfreejourney.com/dashboard</span>
            </div>
            <div className="p-4 sm:p-6">
              {/* Stats row */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-5">
                {mockStats.map(s => (
                  <div key={s.label} className="bg-secondary/50 rounded-xl p-3.5">
                    <div className="flex items-center gap-2 mb-1.5">
                      <s.icon className="w-4 h-4 text-muted-foreground" />
                      <span className="text-[10px] font-medium text-accent">{s.change}</span>
                    </div>
                    <p className="font-heading text-lg sm:text-xl font-bold">{s.value}</p>
                    <p className="text-[10px] text-muted-foreground">{s.label}</p>
                  </div>
                ))}
              </div>
              {/* Progress */}
              <div className="bg-secondary/50 rounded-xl p-4 mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-semibold">Financial Progress</span>
                  <span className="text-sm font-bold text-accent">58%</span>
                </div>
                <Progress value={58} className="h-3" />
              </div>
              {/* Debt & Savings list mockup */}
              <div className="space-y-2">
                {mockItems.map(d => (
                  <div key={d.name} className="flex items-center gap-4 bg-secondary/30 rounded-lg p-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${d.type === "savings" ? "bg-accent/10" : "bg-primary/10"}`}>
                      {d.type === "savings"
                        ? <PiggyBank className="w-4 h-4 text-accent" />
                        : <CreditCard className="w-4 h-4 text-primary" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium truncate">{d.name}</span>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-medium ${d.type === "savings" ? "text-accent" : "text-muted-foreground"}`}>
                            {d.type === "savings" ? "Savings" : "Debt"}
                          </span>
                          <span className="text-xs text-muted-foreground">{d.bal}</span>
                        </div>
                      </div>
                      <Progress value={d.pct} className="h-1.5" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ==================== HOW IT WORKS ==================== */}
      <section className="bg-secondary/40 py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <motion.div {...fadeUp} transition={{ duration: 0.6 }} className="text-center mb-12">
            <span className="text-xs font-semibold text-accent uppercase tracking-wider">How It Works</span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold mt-2 mb-3">Three Simple Steps</h2>
            <p className="text-muted-foreground max-w-md mx-auto text-sm">Getting started takes less than 2 minutes. No complicated setup required.</p>
          </motion.div>
          <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {steps.map((s, i) => (
              <motion.div
                key={s.title}
                {...fadeUp}
                transition={{ delay: i * 0.15 }}
                className="relative text-center"
              >
                <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                  <s.icon className="w-7 h-7" />
                </div>
                <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-6 h-6 rounded-full bg-accent text-accent-foreground text-xs font-bold flex items-center justify-center shadow-sm">
                  {i + 1}
                </span>
                <h3 className="font-heading font-semibold text-base mb-1.5">{s.title}</h3>
                <p className="text-muted-foreground text-sm">{s.desc}</p>
                {i < 2 && (
                  <ChevronRight className="hidden sm:block absolute top-8 -right-3 w-5 h-5 text-muted-foreground/30" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== FEATURES ==================== */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-12 py-16 sm:py-20">
        <motion.div {...fadeUp} transition={{ duration: 0.6 }} className="text-center mb-12">
          <span className="text-xs font-semibold text-accent uppercase tracking-wider">Features</span>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold mt-2 mb-3">Everything You Need</h2>
          <p className="text-muted-foreground max-w-md mx-auto text-sm">Simple yet powerful tools to track your debts, grow your savings, and monitor your financial progress.</p>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              {...fadeUp}
              transition={{ delay: i * 0.06 }}
            >
              <Card className="h-full hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group">
                <CardContent className="p-5">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <f.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-heading font-semibold text-sm mb-1.5">{f.title}</h3>
                  <p className="text-muted-foreground text-xs leading-relaxed">{f.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ==================== ANALYTICS PREVIEW ==================== */}
      <section className="bg-secondary/40 py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <motion.div {...fadeUp} transition={{ duration: 0.6 }} className="text-center mb-12">
            <span className="text-xs font-semibold text-accent uppercase tracking-wider">Analytics</span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold mt-2 mb-3">Visualize Your Financial Progress</h2>
            <p className="text-muted-foreground max-w-md mx-auto text-sm">Beautiful charts showing your debt reduction, savings growth, and net worth over time.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {[
              { title: "Debt Over Time", bars: [95, 90, 85, 80, 78, 75, 72, 70, 67, 65, 62, 58], color: "bg-destructive/50" },
              { title: "Savings Over Time", bars: [10, 18, 25, 32, 40, 48, 55, 60, 68, 72, 78, 85], color: "bg-accent/60" },
              { title: "Net Worth", bars: [5, 12, 18, 25, 30, 38, 45, 50, 58, 62, 70, 78], color: "bg-primary/60" },
              { title: "Payments Per Month", bars: [30, 55, 40, 70, 50, 80, 65, 90, 75, 85, 60, 95], color: "bg-accent/60" },
              { title: "Savings Per Month", bars: [20, 35, 30, 45, 50, 55, 60, 50, 65, 70, 55, 80], color: "bg-accent/60" },
              { title: "Progress Over Time", bars: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 58], color: "bg-primary/60" },
            ].map((chart, ci) => (
              <motion.div key={chart.title} {...fadeUp} transition={{ delay: ci * 0.08 }}>
                <Card className="overflow-hidden">
                  <CardContent className="p-5">
                    <h4 className="text-xs font-semibold mb-4">{chart.title}</h4>
                    <div className="flex items-end gap-1 h-20">
                      {chart.bars.map((h, i) => (
                        <motion.div
                          key={i}
                          className={`flex-1 rounded-t ${chart.color}`}
                          initial={{ height: 0 }}
                          whileInView={{ height: `${h}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: i * 0.04 }}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between mt-2 text-[8px] text-muted-foreground">
                      <span>Jan</span><span>Jun</span><span>Dec</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== TESTIMONIALS ==================== */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-12 py-16 sm:py-20">
        <motion.div {...fadeUp} transition={{ duration: 0.6 }} className="text-center mb-12">
          <span className="text-xs font-semibold text-accent uppercase tracking-wider">Testimonials</span>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold mt-2 mb-3">What Users Say</h2>
          <p className="text-muted-foreground max-w-md mx-auto text-sm">Real feedback from people on their financial freedom journey.</p>
        </motion.div>
        <div className="grid sm:grid-cols-3 gap-5 max-w-4xl mx-auto">
          {testimonials.map((t, i) => (
            <motion.div key={t.name} {...fadeUp} transition={{ delay: i * 0.12 }}>
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="p-5">
                  {/* Stars */}
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: t.rating }).map((_, si) => (
                      <Star key={si} className="w-4 h-4 fill-warning text-warning" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4 italic">"{t.quote}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-primary">{t.name[0]}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.country}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ==================== PRICING ==================== */}
      <section className="bg-secondary/40 py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <motion.div {...fadeUp} transition={{ duration: 0.6 }} className="text-center mb-12">
            <span className="text-xs font-semibold text-accent uppercase tracking-wider">Pricing</span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold mt-2 mb-3">Simple, Transparent Pricing</h2>
            <p className="text-muted-foreground max-w-md mx-auto text-sm">Start for free. Upgrade when you need more.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Free */}
            <motion.div {...fadeUp} transition={{ delay: 0.1 }}>
              <Card className="h-full border-2 border-primary/30 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="mb-4">
                    <span className="text-xs font-semibold text-accent uppercase">Free</span>
                    <p className="font-heading text-3xl font-extrabold mt-1">$0<span className="text-sm font-normal text-muted-foreground">/forever</span></p>
                  </div>
                  <ul className="space-y-2.5 mb-6">
                    {["Track unlimited debts", "Track savings accounts", "Record payments & deposits", "Weekly reports", "Multi-currency support", "Progress dashboard", "Data export (CSV)"].map(f => (
                      <li key={f} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full" asChild>
                    <Link to="/signup">Get Started Free</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
            {/* Pro */}
            <ProPricingCard />
          </div>
        </div>
      </section>

      {/* ==================== FINAL CTA ==================== */}
      <section className="relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 py-16 sm:py-24 text-center relative z-10">
          <motion.div {...fadeUp} transition={{ duration: 0.6 }}>
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-primary-foreground mb-4">
              Start Your Financial Freedom Journey Today
            </h2>
            <p className="text-primary-foreground/60 mb-8 max-w-md mx-auto text-sm sm:text-base">
              Join thousands who are paying off debt, building savings, and taking control of their financial future.
            </p>
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg shadow-accent/20" asChild>
              <Link to="/signup">Create Free Account <ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
          </motion.div>
        </div>
        <div className="absolute top-10 left-10 w-48 h-48 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute bottom-10 right-10 w-64 h-64 rounded-full bg-primary-foreground/5 blur-3xl" />
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="border-t border-border bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 py-10">
          <div className="grid sm:grid-cols-3 gap-8">
            <div>
              <Link to="/" className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "var(--gradient-primary)" }}>
                  <Sparkles className="w-3.5 h-3.5 text-primary-foreground" />
                </div>
                <span className="font-heading font-bold">Debt Free Journey</span>
              </Link>
              <p className="text-sm text-muted-foreground leading-relaxed">A financial progress tracker that helps you pay off debt, build savings, and track your journey to financial freedom.</p>
            </div>
            <div>
              <h4 className="font-heading font-semibold text-sm mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/signup" className="hover:text-foreground transition-colors">Get Started</Link></li>
                <li><Link to="/login" className="hover:text-foreground transition-colors">Log In</Link></li>
                <li><span className="cursor-default">Pricing</span></li>
              </ul>
            </div>
            <div>
              <h4 className="font-heading font-semibold text-sm mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><span className="cursor-default">Privacy Policy</span></li>
                <li><span className="cursor-default">Terms of Service</span></li>
                <li><span className="cursor-default">Contact</span></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-6 text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} Debt Free Journey. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
