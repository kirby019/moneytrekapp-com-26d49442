import { Crown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FoundingMemberBadgeProps {
  className?: string;
  size?: "sm" | "md";
}

export default function FoundingMemberBadge({ className = "", size = "sm" }: FoundingMemberBadgeProps) {
  return (
    <Badge
      className={`bg-gradient-to-r from-amber-500 to-yellow-400 text-white border-0 shadow-sm gap-1 ${
        size === "md" ? "text-sm px-3 py-1" : "text-[10px] px-2 py-0.5"
      } ${className}`}
    >
      <Crown className={size === "md" ? "w-3.5 h-3.5" : "w-3 h-3"} />
      Founding Member
    </Badge>
  );
}
