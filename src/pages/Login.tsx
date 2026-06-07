import { Link, useNavigate } from "react-router-dom";
import { Sparkles, CheckCircle2, TrendingDown, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // If user is already logged in, send them to the dashboard
  useEffect(() => {
    if (!authLoading && user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      toast({ variant: "destructive", title: "Login failed", description: error.message });
      setLoading(false);
      return;
    }

    navigate("/dashboard");
  };

  // Show spinner while auth loads
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-1 items-center justify-center" style={{ background: "var(--gradient-hero)" }}>
        <div className="text-center text-primary-foreground p-12 max-w-sm">
          <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-6">
            <TrendingDown className="w-8 h-8 text-accent" />
          </div>
          <h2 className="font-heading text-3xl font-bold mb-3">Welcome Back</h2>
          <p className="text-primary-foreground/70 mb-8">
            Continue your journey toward financial freedom. Every payment gets you closer.
          </p>
          <div className="space-y-3 text-left">
            {[
              "Track debt, savings & net worth",
              "See your progress with every login",
              "Secure & private — your data only",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2.5 text-sm text-primary-foreground/80">
                <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
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
            <h1 className="font-heading text-2xl font-bold">Log in</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Welcome back! Enter your credentials to continue.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in…" : "Log In"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary font-medium hover:underline">
              Sign up free
            </Link>
          </p>

          <div className="border-t border-border pt-4">
            <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <Shield className="w-3 h-3" />
              <span>Secured with encrypted authentication</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
