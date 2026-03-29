import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight, Sparkles, CreditCard, History, BarChart3, CalendarCheck,
  Globe, LineChart, Download, Shield, Star, CheckCircle2, TrendingDown,
  DollarSign, Target, Users, Zap, ChevronRight, Award, Clock, Rocket, LogOut,
  PiggyBank, Landmark, TrendingUp, Wallet
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useLocalizedPrice, useLocalizedCurrency } from "@/hooks/useLocalizedPrice";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const features = [
  { icon: CreditCard, title: "Debt Tracking", desc: "Add all your debts in one place with balances, interest rates, types, and due dates." },
  { icon: History, title: "Payment Recording", desc: "Log every payment you make and watch your balances update automatically." },
  { icon: BarChart3, title: "Progress Dashboard", desc: "Visual overview of your debts, payments, progress, and financial journey." },
  { icon: Award, title: "Milestones & Badges", desc: "Earn badges as you hit milestones on your journey to financial freedom." },
  { icon: Clock, title: "Streaks", desc: "Stay consistent and build momentum with payment streaks that track your habits." },
  { icon: CalendarCheck, title: "Weekly Reports", desc: "Automated weekly summaries of your payments and progress.", pro: true },
  { icon: LineChart, title: "Analytics & Charts", desc: "Beautiful charts showing debt reduction, payment trends, and your progress over time.", pro: true },
  { icon: Globe, title: "Multi-Currency", desc: "Track finances in any currency with automatic exchange rate conversion.", pro: true },
  { icon: Download, title: "Data Export", desc: "Export your debts, payments, and reports as CSV files anytime.", pro: true },
  { icon: Shield, title: "Secure & Private", desc: "Your data is protected with row-level security and encrypted authentication." },
];

const steps = [
  { icon: CreditCard, title: "Add Your Debts", desc: "Enter your debts with balances, interest rates, and due dates to get started." },
  { icon: DollarSign, title: "Record Payments", desc: "Log each payment you make — your balances and progress update automatically." },
  { icon: Target, title: "Track Your Progress", desc: "Watch your debt shrink, hit milestones, and stay motivated on your journey to financial freedom." },
];

const testimonials = [
  { name: "Alex", country: "Philippines", quote: "This app helped me organize all my finances in one place. I can see my debt going down and savings going up at the same time.", rating: 5 },
  { name: "Maria", country: "Singapore", quote: "I love seeing my net worth grow every month. It keeps me motivated to save more and spend less.", rating: 5 },
  { name: "John", country: "Australia", quote: "Multi-currency support is great because I have accounts in different currencies. Everything converts automatically.", rating: 5 },
];

const comingSoonFeatures = [
  "Payment reminders",
  "Monthly summaries",
  "Advanced financial planning",
  "Budget tracking",
  "Shared household finances",
  "Mobile app",
];

// Raw USD amounts for mockups
const mockStatsRaw = [
  { label: "Total Debt", usd: 24500, change: "↓ 12%", icon: CreditCard },
  { label: "Total Savings", usd: 8400, change: "↑ 18%", icon: PiggyBank },
  { label: "Net Worth", usd: -16100, change: "Improving", icon: Landmark },
  { label: "Progress", value: "41%", change: "On track", icon: Target },
];

const mockDebtsRaw = [
  { name: "Credit Card", usd: 4200, pct: 35, type: "Debt", icon: CreditCard },
  { name: "Student Loan", usd: 12500, pct: 18, type: "Debt", icon: CreditCard },
  { name: "Emergency Fund", usd: 5200, pct: 52, type: "Savings", icon: PiggyBank },
  { name: "Vacation Goal", usd: 3200, pct: 64, type: "Goal", icon: Target },
];

function ProPricingCard() {
  const { price: monthlyPrice, currency } = useLocalizedPrice(2.99);
  const { price: yearlyPrice } = useLocalizedPrice(19.99);
  const showLocal = currency !== "USD";

  return (
    <motion.div {...fadeUp} transition={{ delay: 0.2 }}>
      <Card className="h-full relative overflow-hidden hover:shadow-lg transition-shadow border-2 border-accent/30">
        <div className="absolute top-0 right-0 bg-accent text-accent-foreground text-[10px] font-bold px-3 py-1 rounded-bl-lg">Coming Soon</div>
        <CardContent className="p-6">
          <div className="mb-4">
            <span className="text-xs font-semibold text-accent uppercase">Pro</span>
            <p className="font-heading text-3xl font-extrabold mt-1">
              {monthlyPrice}<span className="text-sm font-normal text-muted-foreground">/month</span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              or {yearlyPrice}/year (save 44%)
            </p>
            {showLocal && (
              <p className="text-xs text-muted-foreground mt-0.5">≈ $2.99/mo or $19.99/yr USD</p>
            )}
          </div>
          <ul className="space-y-2.5 mb-4">
            {[
              "Everything in Free",
              "Unlimited debts & savings",
              "Weekly reports",
              "Advanced analytics & charts",
              "Multi-currency support",
              "CSV data export",
              "Financial goals",
              "Net worth tracking",
            ].map(f => (
              <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
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
  const { user, signOut } = useAuth();

  const mockStats = mockStatsRaw.map(s => ({
    ...s,
    value: s.usd != null ? (s.usd < 0 ? `−${fmt(Math.abs(s.usd))}` : fmt(s.usd)) : s.value!,
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
          <span className="font-heading font-bold text-lg">MoneyTrek</span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <>
              <Button size="sm" asChild><Link to="/dashboard">Dashboard</Link></Button>
              <Button variant="ghost" size="sm" onClick={() => signOut()}>
                <LogOut className="w-4 h-4 mr-1" /> Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild><Link to="/login">Log in</Link></Button>
              <Button size="sm" asChild><Link to="/signup">Get Started</Link></Button>
            </>
          )}
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
                Track Your Money Progress. <span className="text-accent">One Step at a Time.</span>
              </h1>
              <p className="text-base sm:text-lg text-primary-foreground/70 mb-8 max-w-lg leading-relaxed">
                MoneyTrek helps you track debt, record payments, monitor your progress, and stay motivated with milestones, reports, and visual progress tracking on your journey to financial freedom.
              </p>
              <div className="flex flex-wrap gap-3">
                {user ? (
                  <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg shadow-accent/20" asChild>
                    <Link to="/dashboard">
                      Go to Dashboard <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg shadow-accent/20" asChild>
                      <Link to="/signup">
                        Start Your Trek for Free <ArrowRight className="ml-2 w-4 h-4" />
                      </Link>
                    </Button>
                    <Button size="lg" variant="outline" className="border-white/40 text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm" asChild>
                      <Link to="/login">Log In</Link>
                    </Button>
                  </>
                )}
              </div>
              <div className="flex items-center gap-6 mt-8 text-primary-foreground/50 text-sm flex-wrap">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-accent" /> Free plan available</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-accent" /> No credit card required</span>
                <span className="flex items-center gap-1.5 hidden sm:flex"><CheckCircle2 className="w-4 h-4 text-accent" /> Track up to 3 debts free</span>
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
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {mockStats.map(s => (
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
                    <span className="text-xs font-bold text-accent">41%</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-accent"
                      initial={{ width: 0 }}
                      animate={{ width: "41%" }}
                      transition={{ duration: 1.2, delay: 0.8 }}
                    />
                  </div>
                  <div className="flex justify-between mt-2 text-[10px] text-muted-foreground">
                    <span>Debt: {fmt(24500)}</span>
                    <span>Savings: {fmt(8400)}</span>
                  </div>
                </div>
                {/* Mini dual chart mockup */}
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div className="bg-card/90 backdrop-blur rounded-xl p-4 border border-border/50">
                    <span className="text-[10px] font-semibold text-card-foreground mb-2 block">Debt ↓</span>
                    <div className="flex items-end gap-1 h-12">
                      {[95, 90, 85, 80, 75, 70, 65, 60, 55, 50, 45, 42].map((h, i) => (
                        <motion.div
                          key={i}
                          className="flex-1 rounded-t bg-destructive/50"
                          initial={{ height: 0 }}
                          animate={{ height: `${h}%` }}
                          transition={{ duration: 0.5, delay: 0.8 + i * 0.04 }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="bg-card/90 backdrop-blur rounded-xl p-4 border border-border/50">
                    <span className="text-[10px] font-semibold text-card-foreground mb-2 block">Savings ↑</span>
                    <div className="flex items-end gap-1 h-12">
                      {[8, 12, 18, 22, 28, 32, 38, 42, 48, 55, 62, 68].map((h, i) => (
                        <motion.div
                          key={i}
                          className="flex-1 rounded-t bg-accent/70"
                          initial={{ height: 0 }}
                          animate={{ height: `${h}%` }}
                          transition={{ duration: 0.5, delay: 0.8 + i * 0.04 }}
                        />
                      ))}
                    </div>
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
          <h2 className="font-heading text-2xl sm:text-3xl font-bold mt-2 mb-3">Your Complete Financial Command Center</h2>
          <p className="text-muted-foreground max-w-md mx-auto text-sm">See your debts, savings, net worth, and progress — all in one clean dashboard.</p>
        </motion.div>
        <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.15 }}>
          <div className="max-w-4xl mx-auto bg-card rounded-2xl border border-border shadow-xl overflow-hidden">
            {/* Fake window bar */}
            <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b border-border">
              <div className="w-3 h-3 rounded-full bg-destructive/60" />
              <div className="w-3 h-3 rounded-full bg-warning/60" />
              <div className="w-3 h-3 rounded-full bg-accent/60" />
              <span className="ml-3 text-xs text-muted-foreground">app.moneytrek.com/dashboard</span>
            </div>
            <div className="p-4 sm:p-6">
              {/* Stats row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
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
                  <span className="text-sm font-semibold">Overall Financial Progress</span>
                  <span className="text-sm font-bold text-accent">41%</span>
                </div>
                <Progress value={41} className="h-3" />
                <div className="flex justify-between mt-2 text-[10px] text-muted-foreground">
                  <span>Net Worth: −{fmt(16100)}</span>
                  <span>Goal: {fmt(0)} (debt free)</span>
                </div>
              </div>
              {/* Items list mockup — debts + savings */}
              <div className="space-y-2">
                {mockItems.map(d => (
                  <div key={d.name} className="flex items-center gap-4 bg-secondary/30 rounded-lg p-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${d.type === "Savings" || d.type === "Goal" ? "bg-accent/10" : "bg-primary/10"}`}>
                      <d.icon className={`w-4 h-4 ${d.type === "Savings" || d.type === "Goal" ? "text-accent" : "text-primary"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium truncate">{d.name}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className={`text-[9px] px-1.5 py-0 ${d.type === "Savings" ? "bg-accent/10 text-accent" : d.type === "Goal" ? "bg-warning/10 text-warning" : ""}`}>
                            {d.type}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{d.bal}</span>
                        </div>
                      </div>
                      <Progress value={d.pct} className="h-1.5" />
                    </div>
                  </div>
                ))}
              </div>
              {/* Monthly summary row */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="bg-secondary/50 rounded-xl p-3.5 text-center">
                  <p className="text-[10px] text-muted-foreground mb-1">Paid This Month</p>
                  <p className="font-heading text-lg font-bold text-primary">{fmt(1400)}</p>
                </div>
                <div className="bg-secondary/50 rounded-xl p-3.5 text-center">
                  <p className="text-[10px] text-muted-foreground mb-1">Saved This Month</p>
                  <p className="font-heading text-lg font-bold text-accent">{fmt(650)}</p>
                </div>
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
          <h2 className="font-heading text-2xl sm:text-3xl font-bold mt-2 mb-3">Everything You Need to Track Your Financial Progress</h2>
          <p className="text-muted-foreground max-w-lg mx-auto text-sm">MoneyTrek helps you track your debts, record payments, visualize your progress, and stay motivated with milestones, reports, and analytics that show your financial progress over time.</p>
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
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <f.icon className="w-5 h-5 text-primary" />
                    </div>
                    {(f as any).pro && (
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5">Pro</Badge>
                    )}
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
            <h2 className="font-heading text-2xl sm:text-3xl font-bold mt-2 mb-3">Visualize Your Complete Financial Picture</h2>
            <p className="text-muted-foreground max-w-md mx-auto text-sm">Beautiful charts showing debt reduction, savings growth, net worth trends, and your overall financial progress.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {[
              { title: "Debt Over Time", bars: [95, 90, 85, 80, 78, 75, 72, 70, 67, 65, 62, 58], color: "bg-destructive/50" },
              { title: "Savings Over Time", bars: [5, 10, 15, 22, 28, 35, 40, 48, 55, 60, 65, 72], color: "bg-accent/60" },
              { title: "Net Worth Over Time", bars: [10, 14, 18, 22, 26, 30, 35, 40, 45, 50, 55, 60], color: "bg-primary/60" },
              { title: "Payments Per Month", bars: [30, 55, 40, 70, 50, 80, 65, 90, 75, 85, 60, 95], color: "bg-primary/50" },
              { title: "Savings Per Month", bars: [20, 35, 45, 30, 55, 40, 60, 50, 70, 55, 75, 65], color: "bg-accent/50" },
              { title: "Progress Over Time", bars: [5, 10, 15, 20, 25, 28, 32, 35, 38, 40, 41, 41], color: "bg-accent/60" },
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
          <p className="text-muted-foreground max-w-md mx-auto text-sm">Real feedback from people tracking their financial progress.</p>
        </motion.div>
        <div className="grid sm:grid-cols-3 gap-5 max-w-4xl mx-auto">
          {testimonials.map((t, i) => (
            <motion.div key={t.name} {...fadeUp} transition={{ delay: i * 0.12 }}>
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="p-5">
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
            <p className="text-muted-foreground max-w-md mx-auto text-sm">Start tracking your financial progress for free. Upgrade when you need more.</p>
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
                  <p className="text-sm text-muted-foreground mb-4">Start your financial journey with core debt and progress tracking.</p>
                  <ul className="space-y-2.5 mb-6">
                    {["Up to 3 active debts", "Record payments", "Basic dashboard & progress", "Milestones & badges", "Payoff strategies", "Weekly review", "Single currency"].map(f => (
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

      {/* ==================== COMING SOON ==================== */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-12 py-16 sm:py-20">
        <motion.div {...fadeUp} transition={{ duration: 0.6 }} className="text-center mb-12">
          <span className="text-xs font-semibold text-accent uppercase tracking-wider">Roadmap</span>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold mt-2 mb-3">Coming Soon</h2>
          <p className="text-muted-foreground max-w-md mx-auto text-sm">We're building more tools to help you take full control of your finances.</p>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {comingSoonFeatures.map((f, i) => (
            <motion.div key={f} {...fadeUp} transition={{ delay: i * 0.08 }}>
              <Card className="border-dashed border-border/60">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Rocket className="w-4 h-4 text-accent" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">{f}</span>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ==================== FINAL CTA ==================== */}
      <section className="relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 py-16 sm:py-24 text-center relative z-10">
          <motion.div {...fadeUp} transition={{ duration: 0.6 }}>
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-primary-foreground mb-4">
              Start Your Journey to Financial Freedom Today
            </h2>
            <p className="text-primary-foreground/60 mb-8 max-w-md mx-auto text-sm sm:text-base">
              Track your debt, monitor your progress, and build better financial habits with MoneyTrek. Small steps lead to big financial progress.
            </p>
            {user ? (
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg shadow-accent/20" asChild>
                <Link to="/dashboard">Go to Dashboard <ArrowRight className="ml-2 w-4 h-4" /></Link>
              </Button>
            ) : (
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg shadow-accent/20" asChild>
                <Link to="/signup">Create Free Account <ArrowRight className="ml-2 w-4 h-4" /></Link>
              </Button>
            )}
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
                <span className="font-heading font-bold">MoneyTrek</span>
              </Link>
              <p className="text-sm text-muted-foreground leading-relaxed">MoneyTrek is a financial progress tracker that helps you track debt, monitor progress, and build better financial habits on your journey to financial freedom.</p>
            </div>
            <div>
              <h4 className="font-heading font-semibold text-sm mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {user ? (
                  <>
                    <li><Link to="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link></li>
                    <li><button onClick={() => signOut()} className="hover:text-foreground transition-colors">Sign Out</button></li>
                  </>
                ) : (
                  <>
                    <li><Link to="/signup" className="hover:text-foreground transition-colors">Get Started</Link></li>
                    <li><Link to="/login" className="hover:text-foreground transition-colors">Log In</Link></li>
                  </>
                )}
                <li><span className="cursor-default">Pricing</span></li>
              </ul>
            </div>
            <div>
              <h4 className="font-heading font-semibold text-sm mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
                <li><a href="mailto:hello@moneytrek.app" className="hover:text-foreground transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-6 text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} MoneyTrek. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
