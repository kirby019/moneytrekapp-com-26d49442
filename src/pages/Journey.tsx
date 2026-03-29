import { motion } from "framer-motion";
import { CheckCircle2, Circle, MapPin, Flag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import AppLayout from "@/components/AppLayout";

const milestones = [
  { label: "Started Journey", date: "Jan 2025", done: true },
  { label: "First Payment", date: "Jan 2025", done: true },
  { label: "Best Buy Card Paid Off", date: "Feb 2025", done: true },
  { label: "25% of Debt Eliminated", date: "Mar 2025", done: true },
  { label: "Medical Bill Paid Off", date: "Est. Jun 2025", done: false },
  { label: "50% of Debt Eliminated", date: "Est. Sep 2025", done: false },
  { label: "Chase Visa Paid Off", date: "Est. Dec 2025", done: false },
  { label: "Car Loan Paid Off", date: "Est. Aug 2026", done: false },
  { label: "Student Loan Paid Off", date: "Est. Mar 2028", done: false },
  { label: "DEBT FREE! 🎉", date: "Est. Mar 2028", done: false },
];

export default function Journey() {
  const completed = milestones.filter(m => m.done).length;
  const progress = Math.round((completed / milestones.length) * 100);

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-bold">Your Journey</h1>
          <p className="text-sm text-muted-foreground mt-1">Track your progress from start to debt-free.</p>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">{completed} of {milestones.length} milestones reached</span>
              <span className="text-sm font-bold text-primary">{progress}%</span>
            </div>
            <Progress value={progress} className="h-3" />
          </CardContent>
        </Card>

        <div className="relative pl-8">
          <div className="absolute left-3.5 top-0 bottom-0 w-0.5 bg-border" />
          {milestones.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="relative pb-6 last:pb-0"
            >
              <div className="absolute -left-[1.22rem] top-1">
                {i === milestones.length - 1 ? (
                  <Flag className="w-5 h-5 text-warning" />
                ) : m.done ? (
                  <CheckCircle2 className="w-5 h-5 text-success" />
                ) : (
                  <Circle className="w-5 h-5 text-muted-foreground/40" />
                )}
              </div>
              <div className={`p-3 rounded-lg ${m.done ? "bg-success/5 border border-success/20" : "bg-secondary/30 border border-border"}`}>
                <p className={`text-sm font-medium ${m.done ? "text-foreground" : "text-muted-foreground"}`}>{m.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{m.date}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
