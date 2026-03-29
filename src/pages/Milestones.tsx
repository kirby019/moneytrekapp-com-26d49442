import { Trophy, Star, Flame, Award, Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import AppLayout from "@/components/AppLayout";
import { useMilestones } from "@/hooks/useMilestones";
import { useDebts } from "@/hooks/useDebts";

const badgeDefs = [
  { icon: Star, title: "First Step", desc: "Made your first payment", percent: 1 },
  { icon: Flame, title: "Getting Started", desc: "Eliminated 10% of total debt", percent: 10 },
  { icon: Trophy, title: "Quarter Done", desc: "Eliminated 25% of total debt", percent: 25 },
  { icon: Award, title: "Halfway Hero", desc: "Eliminated 50% of total debt", percent: 50 },
  { icon: Flame, title: "Almost There", desc: "Eliminated 75% of total debt", percent: 75 },
  { icon: Star, title: "Final Stretch", desc: "Eliminated 90% of total debt", percent: 90 },
  { icon: Trophy, title: "Debt Free!", desc: "Paid off all your debts!", percent: 100 },
];

export default function Milestones() {
  const { data: milestones } = useMilestones();
  const { data: debts } = useDebts();

  const totalOriginal = debts?.reduce((s, d) => s + (d.original_amount ?? 0), 0) ?? 0;
  const totalBalance = debts?.reduce((s, d) => s + (d.current_balance ?? 0), 0) ?? 0;
  const currentProgress = totalOriginal > 0 ? ((totalOriginal - totalBalance) / totalOriginal) * 100 : 0;

  const achievedPercents = new Set(milestones?.map(m => m.milestone_percent) ?? []);

  const badges = badgeDefs.map(b => ({
    ...b,
    unlocked: achievedPercents.has(b.percent) || currentProgress >= b.percent,
  }));

  const unlockedCount = badges.filter(b => b.unlocked).length;

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-bold">Milestones & Badges</h1>
          <p className="text-sm text-muted-foreground mt-1">{unlockedCount} of {badges.length} unlocked</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {badges.map(b => (
            <Card key={b.title} className={!b.unlocked ? "opacity-40" : ""}>
              <CardContent className="p-5 text-center">
                <div className={`w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center ${b.unlocked ? "bg-warning/10" : "bg-muted"}`}>
                  {b.unlocked ? <b.icon className="w-6 h-6 text-warning" /> : <Lock className="w-5 h-5 text-muted-foreground" />}
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
