import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import AppLayout from "@/components/AppLayout";
import { toast } from "sonner";

export default function Profile() {
  return (
    <AppLayout>
      <div className="max-w-lg mx-auto space-y-6">
        <h1 className="font-heading text-2xl font-bold">Profile</h1>
        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">JD</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-heading font-semibold text-lg">Jane Doe</p>
                <p className="text-sm text-muted-foreground">jane@example.com</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input defaultValue="Jane Doe" />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input defaultValue="jane@example.com" type="email" />
              </div>
            </div>
            <Button onClick={() => toast.success("Profile updated!")}>Save Changes</Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
