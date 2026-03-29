import { Trophy, Star, Flame, Award, Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import AppLayout from "@/components/AppLayout";
import { useJourneyProgress } from "@/hooks/useJourneyProgress";

const badgeDefs = [
  { icon: Star, title: "First Step", desc: "Made your first payment since joining", percent: 1 },
  { icon: Flame, title: "Getting Started", desc: "10% journey progress", percent: 10 },
  { icon: Trophy, title: "Quarter Done", desc: "25% journey progress", percent: 25 },
  { icon: Award, title: "Halfway Hero", desc: "50% journey progress", percent: 50 },
  { icon: Flame, title: "Almost There", desc: "75% journey progress", percent: 75 },
  { icon: Star, title: "Final Stretch", desc: "90% journey progress", percent: 90 },
  { icon: Trophy, title: "Debt Free!", desc: "Completed your journey!", percent: 100 },
];

export default function Milestones() {
  const { journeyProgress, hasJourneyData } = useJourneyProgress();

  const badges = badgeDefs.map((b) => ({
    ...b,
    unlocked: hasJourneyData && journeyProgress >= b.percent,
  }));

  const unlockedCount = badges.filter((b) => b.unlocked).length;

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-bold">Milestones & Badges</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {unlockedCount} of {badges.length} unlocked — based on your journey progress
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {badges.map((b) => (
            <Card key={b.title} className={!b.unlocked ? "opacity-40" : ""}>
              <CardContent className="p-5 text-center">
                <div
                  className={`w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center ${
                    b.unlocked ? "bg-warning/10" : "bg-muted"
                  }`}
                >
                  {b.unlocked ? (
                    <b.icon className="w-6 h-6 text-warning" />
                  ) : (
                    <Lock className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
                <p className="font-heading font-semibold text-sm">{b.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{b.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
