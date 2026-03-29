import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, TrendingDown, Target, Trophy, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  { icon: TrendingDown, title: "Track Every Debt", desc: "Add all your debts in one place and watch balances shrink over time." },
  { icon: Target, title: "Smart Strategies", desc: "Choose Snowball or Avalanche method and get a personalized payoff plan." },
  { icon: Trophy, title: "Celebrate Wins", desc: "Unlock milestones and stay motivated with visual progress on your journey." },
];

const steps = [
  "Add your debts with balances and rates",
  "Pick your payoff strategy",
  "Record payments and watch progress",
  "Celebrate each debt eliminated",
];

export default function Landing() {
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 lg:px-12 py-4 bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-30">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--gradient-primary)" }}>
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-heading font-bold text-lg">Debt Free Journey</span>
        </Link>
        <div className="flex items-center gap-3">
          <Button variant="ghost" asChild><Link to="/login">Log in</Link></Button>
          <Button asChild><Link to="/signup">Get Started</Link></Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
        <div className="container mx-auto px-6 lg:px-12 py-24 lg:py-36 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl"
          >
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-accent/20 text-accent mb-6">
              Your path to financial freedom
            </span>
            <h1 className="font-heading text-4xl lg:text-6xl font-extrabold leading-tight mb-6 text-primary-foreground">
              Crush Your Debt,{" "}
              <span className="text-accent">One Payment</span> at a Time
            </h1>
            <p className="text-lg text-primary-foreground/70 mb-8 max-w-lg">
              Track debts, follow proven payoff strategies, and celebrate every milestone on your journey to becoming completely debt free.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90" asChild>
                <Link to="/signup">
                  Start Your Journey <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10" asChild>
                <Link to="/login">Log In</Link>
              </Button>
            </div>
          </motion.div>
        </div>
        {/* Decorative circles */}
        <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute bottom-10 right-1/3 w-48 h-48 rounded-full bg-primary-foreground/5 blur-2xl" />
      </section>

      {/* Features */}
      <section className="container mx-auto px-6 lg:px-12 py-20">
        <div className="text-center mb-14">
          <h2 className="font-heading text-3xl font-bold mb-3">Everything You Need to Get Free</h2>
          <p className="text-muted-foreground max-w-md mx-auto">Simple, powerful tools to help you take control of your finances and eliminate debt for good.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="p-6 rounded-xl bg-card border border-border shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ background: "var(--gradient-primary)" }}>
                <f.icon className="w-5 h-5 text-primary-foreground" />
              </div>
              <h3 className="font-heading font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-muted-foreground text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Steps */}
      <section className="bg-secondary/50 py-20">
        <div className="container mx-auto px-6 lg:px-12">
          <h2 className="font-heading text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="max-w-lg mx-auto space-y-4">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
                  {i + 1}
                </div>
                <p className="text-sm font-medium pt-1">{step}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-6 lg:px-12 py-20 text-center">
        <h2 className="font-heading text-3xl font-bold mb-4">Ready to Start?</h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">Join thousands who have taken control of their finances and are on their way to being debt free.</p>
        <Button size="lg" asChild>
          <Link to="/signup">Create Free Account <ArrowRight className="ml-2 w-4 h-4" /></Link>
        </Button>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Debt Free Journey. All rights reserved.
      </footer>
    </div>
  );
}
