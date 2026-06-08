import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight, Sparkles, CreditCard, History, BarChart3, CalendarCheck,
  Globe, LineChart, Download, Shield, Star, CheckCircle2, TrendingDown,
  DollarSign, Target, Users, Zap, ChevronRight, Award, Clock, Rocket, LogOut,
  PiggyBank, Landmark, TrendingUp, Wallet, Eye
} from "lucide-react";
import { characters } from "@/lib/characters";
import TalkingCharacter from "@/components/TalkingCharacter";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  { icon: History, title: "Payment Recording", desc: "Log every payment and watch your debt balances shrink automatically in real time." },
  { icon: PiggyBank, title: "Savings Accounts", desc: "Track multiple savings accounts — emergency fund, vacation savings, and more — and watch them grow." },
  { icon: Target, title: "Financial Goals", desc: "Set savings targets and track your progress toward every goal with visual progress bars.", pro: true },
  { icon: Landmark, title: "Net Worth Tracking", desc: "See your assets vs. liabilities and watch your net worth climb over time.", pro: true },
  { icon: TrendingUp, title: "What-If Calculator", desc: "Project your debt-free date, calculate interest saved with extra payments, and see long-term investment growth." },
  { icon: Award, title: "Milestones & Badges", desc: "Earn badges as you hit milestones on your journey to financial freedom." },
  { icon: CalendarCheck, title: "Weekly Reports", desc: "Automated weekly summaries of your payments, savings, and overall financial progress.", pro: true },
  { icon: LineChart, title: "Analytics & Charts", desc: "Beautiful charts showing debt reduction, savings growth, and net worth trends over time.", pro: true },
  { icon: Globe, title: "Multi-Currency", desc: "Track finances in any currency with automatic exchange rate conversion.", pro: true },
];

const steps = [
  { icon: Wallet, title: "Add Your Finances", desc: "Add your debts, savings accounts, and goals in minutes. No complicated setup — just start where you are right now." },
  { icon: BarChart3, title: "Track Everything", desc: "Log payments, record savings deposits, and watch your net worth update automatically as your finances improve." },
  { icon: Rocket, title: "Reach Your Goals", desc: "Hit milestones, build streaks, and use the What-If Calculator to see exactly when you'll be debt-free and building wealth." },
];

const testimonials = [
  { name: "Alex R.", country: "Philippines 🇵🇭", quote: "I paid off ₱85,000 in 7 months using MoneyTrek. Seeing the progress bar move every time I recorded a payment kept me going. Finally feel in control of my finances.", rating: 5 },
  { name: "Maria S.", country: "Singapore 🇸🇬", quote: "I was juggling 3 debts and had no idea where to start. MoneyTrek showed me exactly which debt to pay first. My net worth went from -$12,000 to -$4,000 in under a year.", rating: 5 },
  { name: "John T.", country: "Australia 🇦🇺", quote: "As an OFW with accounts in different currencies, the multi-currency support is a lifesaver. Everything converts automatically and I always know exactly where I stand.", rating: 5 },
];

const journeySteps = [
  {
    title: "Track Your Debt",
    description: "Add debts, record payments, and watch your balances shrink. The debt monster gets smaller every time you pay.",
    icon: TrendingDown,
    character: "moneyTree" as const,
    secondaryCharacter: "debtMonster" as const,
    characterMessage: "Your journey starts here!",
    secondaryMessage: "We'll defeat debt together!",
    animation: "bounce" as const,
  },
  {
    title: "Build Your Savings",
    description: "Track savings accounts, set deposit goals, and watch your financial safety net grow month by month.",
    icon: PiggyBank,
    character: "savingsPig" as const,
    characterMessage: "Savings growing!",
    animation: "wiggle" as const,
  },
  {
    title: "Grow Your Net Worth",
    description: "Track assets vs. liabilities and watch your net worth trend upward. From negative to positive — one snapshot at a time.",
    icon: Landmark,
    character: "theClimber" as const,
    secondaryCharacter: "theBuilder" as const,
    characterMessage: "Keep climbing!",
    secondaryMessage: "You're building your future!",
    animation: "float" as const,
  },
  {
    title: "Master Your Money",
    description: "Set goals, use What-If calculators, review analytics, and take full control of your financial life.",
    icon: Zap,
    character: "goalRocket" as const,
    characterMessage: "Ready for launch!",
    animation: "pulse" as const,
  },
];

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
        <div className="absolute top-0 right-0 bg-accent text-accent-foreground text-[10px] font-bold px-3 py-1 rounded-bl-lg">7-Day Free Trial</div>
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
          <div className="bg-accent/10 border border-accent/20 rounded-lg p-3 mb-4">
            <p className="text-xs font-semibold text-accent flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5" /> Founding Member Pricing
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Sign up now and lock in this rate for life. Early adopters keep this price forever.
            </p>
          </div>
          <ul className="space-y-2.5 mb-4">
            {[
              "7-day free trial — no card needed",
              "Everything in Free",
              "Unlimited debts & savings accounts",
              "Financial goals tracking",
              "Net worth snapshots",
              "Weekly reports",
              "Advanced analytics & charts",
              "Multi-currency support",
              "CSV data export",
            ].map(f => (
              <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                {f}
              </li>
            ))}
          </ul>
          <Button className="w-full" asChild>
            <Link to="/signup">Start Free Trial</Link>
          </Button>
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

      {/* ==================== NAV ==================== */}
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
              <Button variant="ghost" size="sm" asChild><Link to="/demo"><Eye className="w-4 h-4 mr-1" /> Demo</Link></Button>
              <Button variant="ghost" size="sm" onClick={() => signOut()}>
                <LogOut className="w-4 h-4 mr-1" /> Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild><Link to="/login">Dashboard</Link></Button>
              <Button variant="ghost" size="sm" asChild><a href="#pricing">Pricing</a></Button>
              <Button variant="ghost" size="sm" asChild><Link to="/demo"><Eye className="w-4 h-4 mr-1" /> Demo</Link></Button>
              <Button variant="ghost" size="sm" asChild><Link to="/login">Log In</Link></Button>
              <Button size="sm" asChild><Link to="/signup">Get Started</Link></Button>
            </>
          )}
        </div>
      </nav>

      {/* ==================== HERO ==================== */}
      <section className="relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 py-16 sm:py-20 lg:py-28 relative z-10">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-accent/20 text-accent mb-6">
                <Zap className="w-3 h-3" /> 7-day free Pro trial — no credit card needed
              </span>
              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-[1.1] mb-5 text-primary-foreground">
                Debt. Savings. Net Worth. <span className="text-accent">Your Complete Financial Journey.</span>
              </h1>
              <p className="text-base sm:text-lg text-primary-foreground/70 mb-8 max-w-lg leading-relaxed">
                MoneyTrek tracks your entire financial life — pay off debt, grow your savings, set goals, and watch your net worth climb. One beautiful app for every step of your money journey.
              </p>
              <div className="flex flex-wrap gap-3">
                {user ? (
                  <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg shadow-accent/20" asChild>
                    <Link to="/dashboard">
                      Go to Dashboard <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
         
