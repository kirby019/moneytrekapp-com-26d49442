import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, TrendingUp, Wallet, Home } from "lucide-react";
import { motion } from "framer-motion";
import AppLayout from "@/components/AppLayout";

const projections = [
  { icon: Wallet, label: "Monthly Savings", value: "$890/mo", desc: "Once debt-free, your payments become savings" },
  { icon: TrendingUp, label: "Annual Savings", value: "$10,680", desc: "Invest this and watch it grow" },
  { icon: Home, label: "In 10 Years", value: "$158,000+", desc: "Potential investment growth at 7% return" },
];

export default function Future() {
  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-bold">Your Debt-Free Future</h1>
          <p className="text-sm text-muted-foreground mt-1">See what's possible after you're debt free.</p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-8 rounded-2xl text-center text-primary-foreground" style={{ background: "var(--gradient-hero)" }}
        >
          <Sparkles className="w-10 h-10 text-accent mx-auto mb-4" />
          <h2 className="font-heading text-3xl font-extrabold mb-2">March 2028</h2>
          <p className="text-primary-foreground/70">Your projected debt-free date</p>
        </motion.div>

        <div className="space-y-4">
          {projections.map((p, i) => (
            <motion.div key={p.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card>
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <p.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">{p.label}</p>
                    <p className="text-xl font-heading font-bold">{p.value}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{p.desc}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
