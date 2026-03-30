import { motion } from "framer-motion";
import { CheckCircle2, Circle, MapPin, Flag, Plus } from "lucide-react";
import TalkingCharacter from "@/components/TalkingCharacter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { useJourneyProgress } from "@/hooks/useJourneyProgress";
import { useDebts } from "@/hooks/useDebts";
import { formatCurrency } from "@/lib/currency";
import { useProfile } from "@/hooks/useProfile";
import { format } from "date-fns";

const journeyMilestoneDefs = [
  { label: "Started Journey", percent: 0 },
  { label: "First Payment Made", percent: 1 },
  { label: "10% Journey Progress", percent: 10 },
  { label: "25% Journey Progress", percent: 25 },
  { label: "50% Journey Progress", percent: 50 },
  { label: "75% Journey Progress", percent: 75 },
  { label: "90% Journey Progress", percent: 90 },
  { label: "DEBT FREE! 🎉", percent: 100 },
];

export default function Journey() {
  const { journeyProgress, journeyStartDate, journeyStartingDebt, totalJourneyPaid, hasJourneyData, isLoading } = useJourneyProgress();
  const { data: debts } = useDebts();
  const { data: profile } = useProfile();
  const defaultCurrency = (profile as any)?.default_currency ?? "USD";

  const milestones = journeyMilestoneDefs.map((m) => ({
    ...m,
    done: hasJourneyData && journeyProgress >= m.percent,
    date: m.percent === 0 && journeyStartDate
      ? format(new Date(journeyStartDate + "T00:00:00"), "MMM yyyy")
      : m.percent <= journeyProgress && hasJourneyData
        ? "Achieved"
        : "Upcoming",
  }));

  const completed = milestones.filter((m) => m.done).length;

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <TalkingCharacter
            character="theClimber"
            context="journey"
            animation="float"
            size="sm"
            showBubble={true}
            bubblePosition="right"
          />
          <div>
            <h1 className="font-heading text-2xl font-bold">Your Journey</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Track your progress since you started using the app.
            </p>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            {hasJourneyData ? (
              <>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">
                    {completed} of {milestones.length} milestones reached
                  </span>
                  <span className="text-sm font-bold text-primary">{journeyProgress}%</span>
                </div>
                <Progress value={journeyProgress} className="h-3" animated />
                <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                  <span>Paid {formatCurrency(totalJourneyPaid, defaultCurrency)} since joining</span>
                  <span>of {formatCurrency(journeyStartingDebt, defaultCurrency)} starting debt</span>
                </div>
              </>
            ) : !debts || debts.length === 0 ? (
              <div className="text-center py-4 space-y-3">
                <p className="text-sm text-muted-foreground">Add your first debt to start tracking your journey.</p>
                <Button size="sm" asChild>
                  <Link to="/add-debt"><Plus className="w-3 h-3 mr-1" />Add Debt</Link>
                </Button>
              </div>
            ) : (
              <div className="text-center py-4 space-y-3">
                <p className="text-sm text-muted-foreground">Your journey progress will appear here once you record your first payment.</p>
                <Button size="sm" asChild>
                  <Link to="/record-payment">Record Payment</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {hasJourneyData && (
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
                <div
                  className={`p-3 rounded-lg ${
                    m.done
                      ? "bg-success/5 border border-success/20"
                      : "bg-secondary/30 border border-border"
                  }`}
                >
                  <p className={`text-sm font-medium ${m.done ? "text-foreground" : "text-muted-foreground"}`}>
                    {m.label}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{m.date}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
