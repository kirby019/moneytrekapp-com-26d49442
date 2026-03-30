import { motion } from "framer-motion";
import { formatCurrency } from "@/lib/currency";
import TalkingCharacter from "@/components/TalkingCharacter";

interface Props {
  overallProgress: number;
  totalPaid: number;
  totalOriginal: number;
  currency: string;
}

export default function DashboardHero({ overallProgress, totalPaid, totalOriginal, currency }: Props) {
  const context = overallProgress >= 75 ? "celebration" : overallProgress >= 25 ? "progress" : "journey";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-2xl text-primary-foreground"
      style={{ background: "var(--gradient-hero)" }}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="hidden sm:block">
            <TalkingCharacter
              character="moneyTree"
              context={context}
              animation="float"
              size="md"
              showBubble={true}
              bubblePosition="top"
            />
          </div>
          <div>
            <p className="text-primary-foreground/70 text-sm font-medium">Overall Progress</p>
            <p className="text-4xl font-heading font-extrabold mt-1">{overallProgress}% Paid Off</p>
            <p className="text-primary-foreground/60 text-sm mt-1">
              {formatCurrency(totalPaid, currency)} of {formatCurrency(totalOriginal, currency)} eliminated
            </p>
          </div>
        </div>
        <div className="w-full md:w-64">
          <div className="h-3 rounded-full bg-primary-foreground/20 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-accent"
              initial={{ width: 0 }}
              animate={{ width: `${overallProgress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
