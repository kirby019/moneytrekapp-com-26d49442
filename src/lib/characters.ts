import moneyTree from "@/assets/characters/money-tree.png";
import debtMonster from "@/assets/characters/debt-monster.png";
import streakFlame from "@/assets/characters/streak-flame.png";
import theClimber from "@/assets/characters/the-climber.png";
import theBuilder from "@/assets/characters/the-builder.png";
import savingsPig from "@/assets/characters/savings-pig.png";
import goalRocket from "@/assets/characters/goal-rocket.png";

export const characters = {
  moneyTree: {
    src: moneyTree,
    name: "Money Tree",
    tagline: "Grow your financial progress",
    alt: "Money Tree character - represents financial growth",
    comingSoon: false,
  },
  debtMonster: {
    src: debtMonster,
    name: "Debt Monster",
    tagline: "Defeat your debts",
    alt: "Debt Monster character - represents debts to eliminate",
    comingSoon: false,
  },
  streakFlame: {
    src: streakFlame,
    name: "Streak Flame",
    tagline: "Stay consistent",
    alt: "Streak Flame character - represents payment streaks",
    comingSoon: false,
  },
  theClimber: {
    src: theClimber,
    name: "The Climber",
    tagline: "Your journey to financial freedom",
    alt: "The Climber character - represents the financial journey",
    comingSoon: false,
  },
  theBuilder: {
    src: theBuilder,
    name: "The Builder",
    tagline: "Build your financial future",
    alt: "The Builder character - represents building milestones",
    comingSoon: false,
  },
  savingsPig: {
    src: savingsPig,
    name: "Savings Pig",
    tagline: "Build your savings",
    alt: "Savings Pig character - coming soon",
    comingSoon: true,
  },
  goalRocket: {
    src: goalRocket,
    name: "Goal Rocket",
    tagline: "Reach your goals",
    alt: "Goal Rocket character - coming soon",
    comingSoon: true,
  },
} as const;

export type CharacterKey = keyof typeof characters;
