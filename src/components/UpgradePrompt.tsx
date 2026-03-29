import { Link } from "react-router-dom";
import { Crown, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface UpgradePromptProps {
  title?: string;
  message: string;
  /** If true, renders as a full-page block instead of an inline card */
  fullPage?: boolean;
}

export default function UpgradePrompt({
  title = "Pro Feature",
  message,
  fullPage = false,
}: UpgradePromptProps) {
  const content = (
    <Card className="border-accent/30 bg-accent/5">
      <CardContent className="flex flex-col items-center text-center p-6 sm:p-8 gap-4">
        <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
          <Crown className="w-6 h-6 text-accent" />
        </div>
        <div>
          <h3 className="font-heading font-semibold text-lg mb-1">{title}</h3>
          <p className="text-muted-foreground text-sm max-w-sm">{message}</p>
        </div>
        <Button asChild className="mt-2">
          <Link to="/subscription">
            <Lock className="w-4 h-4 mr-2" />
            Upgrade to Pro
          </Link>
        </Button>
      </CardContent>
    </Card>
  );

  if (fullPage) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        {content}
      </div>
    );
  }

  return content;
}
