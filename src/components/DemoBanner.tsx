import { useDemo } from "@/contexts/DemoContext";
import { Button } from "@/components/ui/button";
import { Eye, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function DemoBanner() {
  const { isDemo, exitDemo } = useDemo();
  const navigate = useNavigate();

  if (!isDemo) return null;

  return (
    <div className="bg-accent/15 border-b border-accent/30 px-4 py-2.5 flex items-center justify-between gap-3 sticky top-0 z-40">
      <div className="flex items-center gap-2 text-sm">
        <Eye className="w-4 h-4 text-accent" />
        <span className="font-medium text-accent-foreground">You are viewing demo data</span>
        <span className="text-muted-foreground hidden sm:inline">— Sign up to start tracking your own finances</span>
      </div>
      <div className="flex items-center gap-2">
        <Button size="sm" variant="default" asChild>
          <Link to="/signup">Sign Up Free</Link>
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            exitDemo();
            navigate("/");
          }}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
