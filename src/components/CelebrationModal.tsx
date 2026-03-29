import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "@/components/Confetti";

export type CelebrationLevel = "toast" | "milestone" | "major" | "ultimate";

interface CelebrationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  emoji: string;
  title: string;
  message: string;
  level?: CelebrationLevel;
}

export default function CelebrationModal({
  open,
  onOpenChange,
  emoji,
  title,
  message,
  level = "milestone",
}: CelebrationModalProps) {
  const confettiIntensity = level === "ultimate" ? "high" : level === "major" ? "medium" : "low";

  return (
    <>
      <Confetti active={open} intensity={confettiIntensity} duration={level === "ultimate" ? 5000 : 3000} />
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md text-center">
          <DialogHeader className="items-center">
            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 12 }}
                  className="text-6xl mb-2"
                >
                  {emoji}
                </motion.div>
              )}
            </AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <DialogTitle className="text-2xl font-heading">{title}</DialogTitle>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <DialogDescription className="text-base mt-2">{message}</DialogDescription>
            </motion.div>
          </DialogHeader>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="pt-4"
          >
            <Button onClick={() => onOpenChange(false)} className="w-full">
              {level === "ultimate" ? "I'm Debt Free! 🎉" : "Keep Going! 🚀"}
            </Button>
          </motion.div>
        </DialogContent>
      </Dialog>
    </>
  );
}
