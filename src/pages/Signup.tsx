import { Link, useNavigate } from "react-router-dom";
import { Sparkles, CheckCircle2, Shield, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function Signup() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        // After email confirmation, send user directly into the app
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      toast({ variant: "destructive", title: "Signup failed", description: error.message });
      setLoading(false);
      return;
    }

    if (data.session) {
      // Email confirmation is disabled — user is immediately signed in
      toast({ title: "Welcome to MoneyTrek! 🎉", description: "Let's set up your financial journey." });
      navigate("/onboarding");
    } else {
      // Email confirmation is required — instruct user to check email
      toast({ title: "Account created! 🎉", description: "Check your email to confirm your account, then log in." });
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel — visible on large screens */}
      <div className="hidden lg:flex flex-1 items-center justify-center" style={{ background: "var(--gradient-hero)" }}>
        <div className="text-center text-primary-foreground p-12 max-w-sm">
          <Sparkles className="w-12 h-12 mx-auto mb-4 text-accent" />
          <h2 className="font-heading text-3xl font-bold mb-3">Start Your Journey</h2>
          <p className="text-primary-foreground/70 mb-8">
            Take the first step toward financial freedom — track debt, savings, and your net worth all in one place.
          </p>
          <div className="space-y-3 text-left">
            {[
              "7-day free Pro trial included",
              "No credit card required",
              "Secure & encrypted",
              "Cancel anytime",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2.5 text-sm text-primary-foreground/80">
                <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — signup form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm space-y-6">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-8">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: "var(--gradient-primary)" }}
              >
                <Sparkles className="w-3.5 h-3.5 text-primary-foreground" />
              </div>
              <span className="font-heading font-bold">MoneyTrek</span>
            </Link>
            <h1 className="font-heading text-2xl font-bold">Create account</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Track debt, savings &amp; net worth — free forever
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account…" : "Create Account"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Log in
            </Link>
          </p>

          <div className="border-t border-border pt-4 space-y-2">
            <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <Lock className="w-3 h-3" />
              <span>Secured with encrypted authentication</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <Shield className="w-3 h-3" />
              <span>Your data is private and never shared</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <CheckCircle2 className="w-3 h-3" />
              <span>No credit card required · Cancel anytime</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
