// Encouragement messages shown as toasts after recording a payment
const PAYMENT_ENCOURAGEMENTS = [
  "Every payment counts! You're making progress 💪",
  "Another step closer to freedom! Keep it up 🎯",
  "You're crushing it! Your future self will thank you 🌟",
  "Consistency is key, and you're nailing it! 🔑",
  "That payment just brought you closer to debt-free! 🚀",
  "Way to stay on track! Progress over perfection 📈",
  "Money well directed! You're taking control 💰",
  "Small wins lead to big victories! Keep going 🏆",
  "You showed up again — that's what winners do! 🥇",
  "Debt doesn't stand a chance against you! 🔥",
];

const EXTRA_PAYMENT_ENCOURAGEMENTS = [
  "An EXTRA payment?! You're going above and beyond! 🌟🌟",
  "Extra payments = faster freedom! You're accelerating! 🏎️",
  "Beyond the minimum — that's the debt destroyer mindset! 💥",
  "Extra effort, extra progress! You're unstoppable! ⚡",
];

export function getPaymentEncouragement(isExtra: boolean): string {
  const pool = isExtra ? EXTRA_PAYMENT_ENCOURAGEMENTS : PAYMENT_ENCOURAGEMENTS;
  return pool[Math.floor(Math.random() * pool.length)];
}

// Milestone celebration data
export interface MilestoneCelebration {
  percent: number;
  title: string;
  message: string;
  emoji: string;
}

export const MILESTONE_CELEBRATIONS: MilestoneCelebration[] = [
  { percent: 5, title: "First Steps!", emoji: "👣", message: "You've paid off 5% of your debt! The journey of a thousand miles begins with a single step." },
  { percent: 10, title: "Double Digits!", emoji: "🔟", message: "10% down! You're building real momentum now." },
  { percent: 25, title: "Quarter Way There!", emoji: "🎉", message: "25% of your debt is gone! A quarter of the mountain conquered." },
  { percent: 50, title: "Halfway Hero!", emoji: "🏔️", message: "HALF your debt is eliminated! You're past the tipping point." },
  { percent: 75, title: "The Home Stretch!", emoji: "🏃", message: "75% done! You can see the finish line from here." },
  { percent: 100, title: "DEBT FREE!", emoji: "🎊", message: "You did it! 100% of your journey debt is paid off. You're financially free!" },
];

// Debt payoff celebration
export function getDebtPayoffMessage(debtName: string): { title: string; message: string; emoji: string } {
  return {
    title: `${debtName} is PAID OFF!`,
    emoji: "🎉🎊🥳",
    message: `Congratulations! You've completely eliminated ${debtName}. One less debt, one step closer to freedom!`,
  };
}

// Streak milestones
export interface StreakCelebration {
  days: number;
  title: string;
  message: string;
  emoji: string;
}

export const STREAK_CELEBRATIONS: StreakCelebration[] = [
  { days: 7, title: "One Week Streak!", emoji: "🔥", message: "7 days of consistent activity! You're building a habit." },
  { days: 14, title: "Two Week Streak!", emoji: "🔥🔥", message: "14 days strong! This is becoming second nature." },
  { days: 30, title: "Monthly Master!", emoji: "⭐", message: "30 days! You've proven this isn't a phase — it's a lifestyle." },
  { days: 60, title: "Two Month Champion!", emoji: "🏅", message: "60 days of dedication! You're in the top tier." },
  { days: 90, title: "Quarter Year Legend!", emoji: "👑", message: "90 days! You're a financial warrior." },
  { days: 180, title: "Half Year Hero!", emoji: "🦸", message: "180 days! Half a year of financial discipline. Incredible!" },
  { days: 365, title: "One Year Titan!", emoji: "🏆", message: "365 days! A full year of consistent progress. You're legendary!" },
];

// Weekly review encouragements
const WEEKLY_REVIEW_MESSAGES = [
  "Reflection is the key to growth. Great job reviewing your week! 📊",
  "Awareness drives progress. You're in control! 🎯",
  "Another week reviewed, another week of progress! 💪",
  "Checking in weekly keeps you accountable. Well done! ✅",
];

export function getWeeklyReviewEncouragement(): string {
  return WEEKLY_REVIEW_MESSAGES[Math.floor(Math.random() * WEEKLY_REVIEW_MESSAGES.length)];
}
