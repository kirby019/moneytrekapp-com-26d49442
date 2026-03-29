import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AppLayout from "@/components/AppLayout";

export default function AppSettings() {
  return (
    <AppLayout>
      <div className="max-w-lg mx-auto space-y-6">
        <h1 className="font-heading text-2xl font-bold">Settings</h1>
        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Payment Reminders</Label>
                <p className="text-xs text-muted-foreground">Get notified before payments are due</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Milestone Celebrations</Label>
                <p className="text-xs text-muted-foreground">Show confetti on achievements</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Weekly Review Emails</Label>
                <p className="text-xs text-muted-foreground">Receive weekly progress summaries</p>
              </div>
              <Switch />
            </div>
            <div className="space-y-2">
              <Label>Currency</Label>
              <Select defaultValue="usd">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="usd">USD ($)</SelectItem>
                  <SelectItem value="eur">EUR (€)</SelectItem>
                  <SelectItem value="gbp">GBP (£)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
