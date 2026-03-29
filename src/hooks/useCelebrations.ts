import { useState, useCallback } from "react";
import { toast } from "sonner";
import {
  getPaymentEncouragement,
  getDebtPayoffMessage,
  MILESTONE_CELEBRATIONS,
  STREAK_CELEBRATIONS,
  getWeeklyReviewEncouragement,
  type MilestoneCelebration,
  type StreakCelebration,
} from "@/lib/celebrations";
import type { CelebrationLevel } from "@/components/CelebrationModal";

interface CelebrationState {
  open: boolean;
  emoji: string;
  title: string;
  message: string;
  level: CelebrationLevel;
}

export function useCelebrations() {
  const [celebration, setCelebration] = useState<CelebrationState>({
    open: false,
    emoji: "",
    title: "",
    message: "",
    level: "milestone",
  });

  const showModal = useCallback((emoji: string, title: string, message: string, level: CelebrationLevel = "milestone") => {
    setCelebration({ open: true, emoji, title, message, level });
  }, []);

  const closeCelebration = useCallback((open: boolean) => {
    if (!open) setCelebration(prev => ({ ...prev, open: false }));
  }, []);

  // Toast encouragement after payment
  const celebratePayment = useCallback((isExtra: boolean) => {
    const msg = getPaymentEncouragement(isExtra);
    toast.success(msg, { duration: 4000 });
  }, []);

  // Modal for debt payoff — major celebration
  const celebrateDebtPayoff = useCallback((debtName: string) => {
    const { emoji, title, message } = getDebtPayoffMessage(debtName);
    showModal(emoji, title, message, "major");
  }, [showModal]);

  // Check and celebrate journey milestones
  const checkMilestoneCelebration = useCallback((
    currentProgress: number,
    achievedMilestones: number[]
  ): MilestoneCelebration | null => {
    for (const milestone of MILESTONE_CELEBRATIONS) {
      if (currentProgress >= milestone.percent && !achievedMilestones.includes(milestone.percent)) {
        // 100% = ultimate (debt free), 50%+ = major, rest = milestone
        const level: CelebrationLevel =
          milestone.percent === 100 ? "ultimate" :
          milestone.percent >= 50 ? "major" : "milestone";
        showModal(milestone.emoji, milestone.title, milestone.message, level);
        return milestone;
      }
    }
    return null;
  }, [showModal]);

  // Check and celebrate streak milestones
  const checkStreakCelebration = useCallback((currentStreak: number) => {
    const milestone = STREAK_CELEBRATIONS.find(s => s.days === currentStreak);
    if (milestone) {
      const level: CelebrationLevel = milestone.days >= 90 ? "major" : "milestone";
      showModal(milestone.emoji, milestone.title, milestone.message, level);
    }
  }, [showModal]);

  // Weekly review encouragement toast
  const celebrateWeeklyReview = useCallback(() => {
    const msg = getWeeklyReviewEncouragement();
    toast.success(msg, { duration: 4000 });
  }, []);

  return {
    celebration,
    closeCelebration,
    celebratePayment,
    celebrateDebtPayoff,
    checkMilestoneCelebration,
    checkStreakCelebration,
    celebrateWeeklyReview,
  };
}
