import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface CelebrationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  emoji: string;
  title: string;
  message: string;
}

export default function CelebrationModal({ open, onOpenChange, emoji, title, message }: CelebrationModalProps) {
  return (
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
          <DialogTitle className="text-2xl font-heading">{title}</DialogTitle>
          <DialogDescription className="text-base mt-2">{message}</DialogDescription>
        </DialogHeader>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="pt-4"
        >
          <Button onClick={() => onOpenChange(false)} className="w-full">
            Keep Going! 🚀
          </Button>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
