import { Trophy, Star, Flame, Award, Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import AppLayout from "@/components/AppLayout";

const badges = [
  { icon: Star, title: "First Step", desc: "Made your first payment", unlocked: true },
  { icon: Flame, title: "On Fire", desc: "3 consecutive monthly payments", unlocked: true },
  { icon: Trophy, title: "Debt Slayer", desc: "Paid off your first debt", unlocked: true },
  { icon: Award, title: "Quarter Done", desc: "Eliminated 25% of total debt", unlocked: true },
  { icon: Trophy, title: "Halfway Hero", desc: "Eliminated 50% of total debt", unlocked: false },
  { icon: Flame, title: "Unstoppable", desc: "6 consecutive monthly payments", unlocked: false },
  { icon: Star, title: "Almost There", desc: "Eliminated 75% of total debt", unlocked: false },
  { icon: Award, title: "Debt Free!", desc: "Paid off all your debts!", unlocked: false },
];

export default function Milestones() {
  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-bold">Milestones & Badges</h1>
          <p className="text-sm text-muted-foreground mt-1">{badges.filter(b => b.unlocked).length} of {badges.length} unlocked</p>
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
