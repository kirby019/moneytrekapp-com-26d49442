import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingDown, DollarSign, CheckCircle2, Target } from "lucide-react";
import AppLayout from "@/components/AppLayout";

export default function WeeklyReview() {
  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-bold">Weekly Review</h1>
          <p className="text-sm text-muted-foreground mt-1">Week of March 24 — March 30, 2025</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-5 text-center">
              <DollarSign className="w-6 h-6 text-success mx-auto mb-2" />
              <p className="text-2xl font-heading font-bold">$570</p>
              <p className="text-xs text-muted-foreground">Paid This Week</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 text-center">
              <TrendingDown className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-heading font-bold">$1,200</p>
              <p className="text-xs text-muted-foreground">Reduced This Month</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-6">
            <h2 className="font-heading font-semibold mb-4">This Week's Highlights</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-success mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Made extra payment on Chase Visa</p>
                  <p className="text-xs text-muted-foreground">$250 — above minimum payment</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-success mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Student Loan minimum payment</p>
                  <p className="text-xs text-muted-foreground">$280 — on schedule</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Target className="w-4 h-4 text-warning mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Next milestone approaching</p>
                  <p className="text-xs text-muted-foreground">Medical Bill payoff — $1,500 remaining</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="font-heading font-semibold mb-2">Motivation</h2>
            <p className="text-muted-foreground text-sm italic">"The secret of getting ahead is getting started." — Mark Twain</p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
