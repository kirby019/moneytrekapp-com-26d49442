import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Target, TrendingDown, Zap } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { cn } from "@/lib/utils";

const strategies = [
  {
    id: "snowball",
    name: "Debt Snowball",
    icon: TrendingDown,
    desc: "Pay off smallest balances first for quick wins and motivation.",
    order: ["Medical Bill ($1,500)", "Chase Visa ($4,200)", "Car Loan ($6,150)", "Student Loan ($12,500)"],
    pros: ["Quick wins boost motivation", "Simpler to follow", "Psychological momentum"],
  },
  {
    id: "avalanche",
    name: "Debt Avalanche",
    icon: Zap,
    desc: "Pay off highest interest rates first to save the most money.",
    order: ["Chase Visa (19.99%)", "Student Loan (5.5%)", "Car Loan (4.2%)", "Medical Bill (0%)"],
    pros: ["Saves most on interest", "Mathematically optimal", "Faster total payoff"],
  },
];

export default function Strategy() {
  const [selected, setSelected] = useState("snowball");

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-bold">Payoff Strategy</h1>
          <p className="text-sm text-muted-foreground mt-1">Choose the approach that works best for you.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {strategies.map(s => (
            <Card
              key={s.id}
              className={cn("cursor-pointer transition-all", selected === s.id ? "ring-2 ring-primary shadow-md" : "hover:shadow-sm")}
              onClick={() => setSelected(s.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <s.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-heading font-semibold">{s.name}</p>
                    {selected === s.id && <Badge className="mt-1 bg-primary text-primary-foreground text-xs">Active</Badge>}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{s.desc}</p>
                <div className="space-y-1">
                  {s.pros.map(p => (
                    <p key={p} className="text-xs text-muted-foreground flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-success flex-shrink-0" /> {p}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardContent className="p-6">
            <h2 className="font-heading font-semibold mb-4 flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" />
              Payoff Order ({strategies.find(s => s.id === selected)?.name})
            </h2>
            <div className="space-y-2">
              {strategies.find(s => s.id === selected)?.order.map((item, i) => (
                <div key={item} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                  <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">{i + 1}</span>
                  <span className="text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
