import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, DollarSign, BarChart3, Trophy, PartyPopper, ArrowRight, Sparkles } from "lucide-react";

const howSteps = [
  {
    icon: CreditCard,
    title: "Add Your Debts",
    desc: "Enter your debts with balances, interest rates, and minimum payments. MoneyTrek keeps everything organized in one place.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: DollarSign,
    title: "Record Your Payments",
    desc: "Log every payment you make. Your balances update automatically and your progress grows with each payment.",
    color: "bg-accent/10 text-accent",
  },
  {
    icon: BarChart3,
    title: "Track Your Progress",
    desc: "See your debt shrink over time with visual charts, progress bars, and detailed analytics that show how far you've come.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Trophy,
    title: "Reach Milestones",
    desc: "Earn badges and celebrate milestones as you hit 10%, 25%, 50%, 75%, and 100% of your journey. Stay motivated!",
    color: "bg-accent/10 text-accent",
  },
  {
    icon: PartyPopper,
    title: "Become Debt Free",
    desc: "Keep going until all your debts are paid off. MoneyTrek tracks your entire journey to financial freedom.",
    color: "bg-primary/10 text-primary",
  },
];

interface Props {
  onContinue?: () => void;
}

export default function HowItWorks({ onContinue }: Props) {
  const navigate = useNavigate();

  const handleContinue = () => {
    if (onContinue) {
      onContinue();
    } else {
      navigate("/onboarding");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardContent className="p-6 sm:p-8 space-y-6">
              <div className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-7 h-7 text-primary" />
                </div>
                <h1 className="font-heading text-2xl font-bold">How MoneyTrek Works</h1>
                <p className="text-muted-foreground text-sm mt-2">
                  Five simple steps to track your journey to financial freedom.
                </p>
              </div>

              <div className="space-y-3">
                {howSteps.map((step, i) => (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.1 }}
                    className="flex items-start gap-3 p-3 rounded-lg border border-border hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                        {i + 1}
                      </span>
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${step.color}`}>
                        <step.icon className="w-4.5 h-4.5" />
                      </div>
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm">{step.title}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{step.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <Button onClick={handleContinue} className="w-full" size="lg">
                Let's Get Started <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
