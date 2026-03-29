import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import AppLayout from "@/components/AppLayout";
import { toast } from "sonner";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import { Skeleton } from "@/components/ui/skeleton";
import CurrencySelector from "@/components/CurrencySelector";
import { useSubscription } from "@/hooks/useSubscription";
import FoundingMemberBadge from "@/components/FoundingMemberBadge";

export default function Profile() {
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const { isFoundingMember } = useSubscription();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currency, setCurrency] = useState("USD");

  useEffect(() => {
    if (profile) {
      setName(profile.full_name ?? "");
      setEmail(profile.email ?? "");
      setCurrency((profile as any).default_currency ?? "USD");
    }
  }, [profile]);

  const initials = name
    ? name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  const handleSave = async () => {
    try {
      await updateProfile.mutateAsync({ full_name: name, default_currency: currency });
      toast.success("Profile updated!");
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="max-w-lg mx-auto space-y-6">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-lg mx-auto space-y-6">
        <h1 className="font-heading text-2xl font-bold">Profile</h1>
        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">{initials}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-heading font-semibold text-lg flex items-center gap-2">
                  {name || "Your Name"}
                  {isFoundingMember && <FoundingMemberBadge size="md" />}
                </p>
                <p className="text-sm text-muted-foreground">{email}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={email} type="email" disabled className="opacity-60" />
              </div>
              <div className="space-y-2">
                <Label>Default Currency</Label>
                <CurrencySelector value={currency} onValueChange={setCurrency} />
              </div>
            </div>
            <Button onClick={handleSave} disabled={updateProfile.isPending}>
              {updateProfile.isPending ? "Saving…" : "Save Changes"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
