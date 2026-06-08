import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  CreditCard, PiggyBank, Target, Landmark, Calculator, BarChart3, History,
  CalendarCheck, Trophy, Flame, Map, Globe, Download, Shield, Sparkles, ArrowRight,
  TrendingUp, Zap, CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const featureGroups = [
  {
    title: "Track Everything in One Place",
    desc: "Your complete financial picture — debts, savings, goals, and net worth — all in a single dashboard.",
    features: [
      {
        icon: CreditCard,
        title: "Debt Tracking",
        desc: "Add all your debts — credit cards, student loans, car loans, personal loans — with balances, interest rates, minimum payments, and due dates. Record every payment and watch your balances update automatically.",
        free: true,
      },
      {
        icon: PiggyBank,
        title: "Savings Tracking",
        desc: "Track your savings accounts in one place. Log deposits and withdrawals, watch your balances grow, and see exactly how much you've saved.",
        free: true,
      },
      {
        icon: Target,
        title: "Financial Goals",
        desc: "Set specific financial goals — a vacation fund, emergency fund, down payment, or anything else. Track progress with visual progress bars and see how many days remain until your target date.",
        free: true,
      },
      {
        icon: Landmark,
        title: "Net Worth Snapshots",
        desc: "MoneyTrek calculates your live net worth (total savings minus total active debt) and lets you save dated snapshots. Take a snapshot monthly to track how your net worth grows over time.",
        free: true,
      },
    ],
  },
  {
    title: "Pay Off Debt Smarter",
    desc: "Choose a proven strategy and use the built-in calculators to find the fastest path to becoming debt-free.",
    features: [
      {
        icon: Zap,
        title: "Debt Payoff Strategies",
        desc: "Choose between the Debt Snowball (smallest balance first — for motivation) or Debt Avalanche (highest interest rate first — for maximum interest savings). MoneyTrek shows you the recommended payoff order for your strategy.",
        free: true,
      },
      {
        icon: Calculator,
        title: "What-If Calculator",
        desc: "Instantly model 'what if I paid $X extra per month?' — see how many months faster you'd be debt-free and how much interest you'd save. Adjust the number in real time and watch the results update instantly.",
        free: true,
      },
      {
        icon: TrendingUp,
        title: "Investment Projector",
        desc: "Once you're debt-free, those payments become savings. Use the Investment Projector to see how a monthly investment could grow at a chosen annual return over 5, 10, 20, or 30 years.",
        free: true,
      },
    ],
  },
  {
    title: "Stay Motivated",
    desc: "Gamification features designed to keep you consistent and celebrate your progress.",
    features: [
      {
        icon: Flame,
        title: "Payment Streaks",
        desc: "Track how many consecutive periods you've made payments. Streaks build the habit of consistency — and breaking a streak hurts just enough to keep you going.",
        free: true,
      },
      {
        icon: Trophy,
        title: "Milestone Badges",
        desc: "Earn badges as you hit real milestones — your first payment, first debt paid off, first $1,000 saved, and more. Milestones give you something to celebrate along the way.",
        free: true,
      },
      {
        icon: Map,
        title: "Journey Map",
        desc: "Your personal debt-free journey visualized as a path. See where you started, where you are now, and how far you have to go.",
        free: true,
      },
    ],
  },
  {
    title: "Analytics & Reporting",
    desc: "Understand your progress with beautiful charts, automated reports, and exportable data.",
    features: [
      {
        icon: BarChart3,
        title: "Analytics Dashboard",
        desc: "Beautiful charts showing your debt reduction over time, payment frequency, total interest paid, and progress toward being debt-free. Visualize your journey at a glance.",
        free: false,
        pro: true,
      },
      {
        icon: History,
        title: "Payment History",
        desc: "A complete log of every payment you've ever recorded, with dates, amounts, and notes. Filter by debt or date range.",
        free: true,
      },
      {
        icon: CalendarCheck,
        title: "Weekly Reports",
        desc: "Automated weekly summaries sent to your email — how much you paid, what changed, and what your next goal is. Stay informed without logging in every day.",
        free: false,
        pro: true,
      },
      {
        icon: Globe,
        title: "Multi-Currency Support",
        desc: "Track finances in any currency with automatic exchange rate conversion. Perfect for OFWs, expats, and anyone managing money across multiple countries.",
        free: false,
        pro: true,
      },
      {
        icon: Download,
        title: "Data Export (CSV)",
        desc: "Export your complete debt and payment history as a CSV file at any time. Your data, your control.",
        free: false,
        pro: true,
      },
    ],
  },
  {
    title: "Private & Secure",
    desc: "Your financial data is sensitive. MoneyTrek takes security seriously.",
    features: [
      {
        icon: Shield,
        title: "Row-Level Security",
        desc: "MoneyTrek uses Supabase with row-level security (RLS), which means each user can only ever access their own data — even at the database level. No one else can see your finances.",
        free: true,
      },
    ],
  },
];

const featuresSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "MoneyTrek Features",
  "url": "https://moneytrekapp.com/features",
  "description": "Full list of MoneyTrek features: debt tracking, savings, financial goals, net worth, what-if calculators, investment projector, streaks, milestones, analytics, weekly reports, multi-currency support, and CSV export.",
  "isPartOf": { "@id": "https://moneytrekapp.com/#website" }
};

export default function Features() {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "features-schema";
    script.text = JSON.stringify(featuresSchema);
    document.head.appendChild(script);

    document.title = "MoneyTrek Features — Debt Tracking, Savings, Net Worth & More";
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", "MoneyTrek features: debt tracking with snowball/avalanche strategies, savings tracking, financial goals, net worth snapshots, what-if calculators, investment projector, streaks, milestones, analytics, and more.");

    return () => {
      const el = document.getElementById("features-schema");
      if (el) el.remove();
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b border-border bg-card sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-heading font-bold text-lg">
            <Sparkles className="w-5 h-5 text-primary" />
            MoneyTrek
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild><Link to="/login">Log in</Link></Button>
            <Button size="sm" asChild><Link to="/signup">Start Free</Link></Button>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-gradient-to-b from-primary/5 to-background border-b border-border py-12 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="font-heading text-3xl md:text-4xl font-extrabold mb-3">
            Everything You Need to Reach Financial Freedom
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-6">
            MoneyTrek combines debt payoff tools, savings tracking, net worth monitoring, and motivational features — all in one app. Here's everything it can do.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              Free plan available
            </div>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              7-day Pro trial on signup
            </div>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              No credit card required
            </div>
          </div>
        </div>
      </div>

      {/* Feature Groups */}
      <main className="max-w-5xl mx-auto px-4 py-12 space-y-14">
        {featureGroups.map((group) => (
          <section key={group.title}>
            <div className="mb-6">
              <h2 className="font-heading text-2xl font-bold">{group.title}</h2>
              <p className="text-muted-foreground mt-1">{group.desc}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {group.features.map((f) => (
                <div key={f.title} className="border border-border rounded-xl p-5 bg-card hover:border-primary/30 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <f.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <h3 className="font-semibold">{f.title}</h3>
                        {f.pro && (
                          <Badge variant="secondary" className="text-xs px-1.5 py-0">Pro</Badge>
                        )}
                        {f.free && !f.pro && (
                          <Badge variant="outline" className="text-xs px-1.5 py-0 text-green-600 border-green-200">Free</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>

      {/* CTA */}
      <div className="border-t border-border bg-card py-12 px-4 text-center">
        <h2 className="font-heading text-2xl font-bold mb-2">Start your journey today</h2>
        <p className="text-muted-foreground mb-6">
          Free plan, 7-day Pro trial on signup. No credit card needed.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Button size="lg" asChild>
            <Link to="/signup">
              Get Started Free <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/demo">Try the Demo</Link>
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          Have questions? <Link to="/faq" className="underline">Read the FAQ</Link>
        </p>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-6 px-4">
        <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <Link to="/faq" className="hover:text-foreground">FAQ</Link>
          <Link to="/how-it-works" className="hover:text-foreground">How It Works</Link>
          <Link to="/privacy" className="hover:text-foreground">Privacy</Link>
          <Link to="/terms" className="hover:text-foreground">Terms</Link>
        </div>
        <p className="text-center text-xs text-muted-foreground mt-4">© {new Date().getFullYear()} MoneyTrek. All rights reserved.</p>
      </footer>
    </div>
  );
}
