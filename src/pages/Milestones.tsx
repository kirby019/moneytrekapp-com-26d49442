import { Trophy, Star, Flame, Award, Lock, Plus } from "lucide-react";
import { characters } from "@/lib/characters";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { useJourneyProgress } from "@/hooks/useJourneyProgress";
import { useDebts } from "@/hooks/useDebts";

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
  const { data: debts } = useDebts();

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

        {!debts || debts.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center space-y-4">
              <img
                src={characters.theBuilder.src}
                alt={characters.theBuilder.alt}
                width={96}
                height={96}
                loading="lazy"
                className="w-24 h-24 object-contain mx-auto"
              />
              <div>
                <p className="font-heading font-semibold">No milestones yet</p>
                <p className="text-sm text-muted-foreground mt-1">Add your first debt and start making payments to unlock badges.</p>
              </div>
              <Button asChild>
                <Link to="/add-debt"><Plus className="w-4 h-4 mr-2" />Add Your First Debt</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
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
        )}
      </div>
    </AppLayout>
  );
}
