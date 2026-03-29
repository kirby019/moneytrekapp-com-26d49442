import { Link, useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex flex-1 items-center justify-center" style={{ background: "var(--gradient-hero)" }}>
        <div className="text-center text-primary-foreground p-12">
          <Sparkles className="w-12 h-12 mx-auto mb-4 text-accent" />
          <h2 className="font-heading text-3xl font-bold mb-3">Welcome Back</h2>
          <p className="text-primary-foreground/70 max-w-sm">Continue your journey toward financial freedom.</p>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm space-y-6">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-8">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "var(--gradient-primary)" }}>
                <Sparkles className="w-3.5 h-3.5 text-primary-foreground" />
              </div>
              <span className="font-heading font-bold">Debt Free Journey</span>
            </Link>
            <h1 className="font-heading text-2xl font-bold">Log in</h1>
            <p className="text-sm text-muted-foreground mt-1">Enter your credentials to continue</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in…" : "Log In"}
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground">
            Don't have an account? <Link to="/signup" className="text-primary font-medium hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
