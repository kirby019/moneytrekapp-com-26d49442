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

interface CelebrationState {
  open: boolean;
  emoji: string;
  title: string;
  message: string;
}

export function useCelebrations() {
  const [celebration, setCelebration] = useState<CelebrationState>({
    open: false,
    emoji: "",
    title: "",
    message: "",
  });

  const showModal = useCallback((emoji: string, title: string, message: string) => {
    setCelebration({ open: true, emoji, title, message });
  }, []);

  const closeCelebration = useCallback((open: boolean) => {
    if (!open) setCelebration(prev => ({ ...prev, open: false }));
  }, []);

  // Toast encouragement after payment
  const celebratePayment = useCallback((isExtra: boolean) => {
    const msg = getPaymentEncouragement(isExtra);
    toast.success(msg, { duration: 4000 });
  }, []);

  // Modal for debt payoff
  const celebrateDebtPayoff = useCallback((debtName: string) => {
    const { emoji, title, message } = getDebtPayoffMessage(debtName);
    showModal(emoji, title, message);
  }, [showModal]);

  // Check and celebrate journey milestones
  const checkMilestoneCelebration = useCallback((
    currentProgress: number,
    achievedMilestones: number[]
  ): MilestoneCelebration | null => {
    for (const milestone of MILESTONE_CELEBRATIONS) {
      if (currentProgress >= milestone.percent && !achievedMilestones.includes(milestone.percent)) {
        showModal(milestone.emoji, milestone.title, milestone.message);
        return milestone;
      }
    }
    return null;
  }, [showModal]);

  // Check and celebrate streak milestones
  const checkStreakCelebration = useCallback((currentStreak: number) => {
    const milestone = STREAK_CELEBRATIONS.find(s => s.days === currentStreak);
    if (milestone) {
      showModal(milestone.emoji, milestone.title, milestone.message);
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
