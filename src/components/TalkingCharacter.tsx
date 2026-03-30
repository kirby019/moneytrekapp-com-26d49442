import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { characters, type CharacterKey } from "@/lib/characters";

// ── Animation presets ──────────────────────────────────────────────
const animationVariants: Record<string, Variants> = {
  bounce: {
    animate: {
      y: [0, -8, 0],
      transition: { duration: 1.4, repeat: Infinity, repeatType: "loop", ease: "easeInOut" },
    },
  },
  wiggle: {
    animate: {
      rotate: [0, -4, 4, -4, 4, 0],
      transition: { duration: 1.2, repeat: Infinity, repeatType: "loop", ease: "easeInOut", repeatDelay: 2 },
    },
  },
  pulse: {
    animate: {
      scale: [1, 1.08, 1],
      transition: { duration: 2, repeat: Infinity, repeatType: "loop", ease: "easeInOut" },
    },
  },
  float: {
    animate: {
      y: [0, -6, 0],
      rotate: [0, 1, -1, 0],
      transition: { duration: 3, repeat: Infinity, repeatType: "loop", ease: "easeInOut" },
    },
  },
  celebrate: {
    animate: {
      scale: [1, 1.2, 0.9, 1.1, 1],
      rotate: [0, -10, 10, -5, 0],
      transition: { duration: 0.8, ease: "easeOut" },
    },
  },
  entrance: {
    initial: { scale: 0, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 260, damping: 20 },
    },
  },
};

export type CharacterAnimation = keyof typeof animationVariants;

// ── Context-specific messages ──────────────────────────────────────
export const characterMessages: Record<string, string[]> = {
  progress: [
    "Keep going! 🌱",
    "Great progress!",
    "You're growing! 🌳",
    "Every step counts!",
    "Look how far you've come!",
  ],
  debt: [
    "Let's defeat this debt!",
    "One less monster to fight! 👊",
    "You're stronger than your debt!",
    "Shrink that balance!",
    "Almost there, keep pushing!",
  ],
  streak: [
    "Your streak is alive! 🔥",
    "Stay consistent!",
    "Don't break the chain!",
    "You're on fire!",
    "Consistency is key!",
  ],
  journey: [
    "One step at a time! 🧗",
    "The summit is getting closer!",
    "Enjoy the climb!",
    "You've got this!",
    "Keep climbing!",
  ],
  milestone: [
    "Milestone unlocked! 🏆",
    "You're building your future!",
    "Incredible achievement!",
    "Another brick laid! 🧱",
    "Look what you've built!",
  ],
  celebration: [
    "You did it! 🎉",
    "Amazing achievement!",
    "You defeated a debt! 💪",
    "Incredible progress!",
    "What a milestone!",
  ],
  empty: [
    "Let's get started! 🚀",
    "Your journey begins here!",
    "Ready for an adventure?",
    "First step is the hardest!",
    "Let's build something great!",
  ],
  savings: [
    "Your savings are growing! 🐷",
    "Save a little, gain a lot!",
    "Piggy bank is happy!",
    "Every penny matters!",
  ],
  goals: [
    "Your goal is getting closer! 🚀",
    "Aim high, reach higher!",
    "Launch sequence initiated!",
    "Destination: success!",
  ],
  weekly: [
    "Great week! 🔥",
    "Review and reflect!",
    "Progress check time!",
    "How did you do this week?",
    "Keep the momentum going!",
  ],
};

export type MessageContext = keyof typeof characterMessages;

// ── Helper to pick a random message ────────────────────────────────
function useRotatingMessage(context: MessageContext, intervalMs = 6000): string {
  const messages = characterMessages[context];
  const [index, setIndex] = useState(() => Math.floor(Math.random() * messages.length));

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => {
        let next: number;
        do {
          next = Math.floor(Math.random() * messages.length);
        } while (next === prev && messages.length > 1);
        return next;
      });
    }, intervalMs);
    return () => clearInterval(timer);
  }, [messages.length, intervalMs]);

  return messages[index];
}

// ── Speech bubble ──────────────────────────────────────────────────
function SpeechBubble({ message, position = "top" }: { message: string; position?: "top" | "right" | "bottom" }) {
  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  };

  const tailClasses = {
    top: "top-full left-1/2 -translate-x-1/2 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-card",
    right: "right-full top-1/2 -translate-y-1/2 border-t-[6px] border-b-[6px] border-r-[6px] border-t-transparent border-b-transparent border-r-card",
    bottom: "bottom-full left-1/2 -translate-x-1/2 border-l-[6px] border-r-[6px] border-b-[6px] border-l-transparent border-r-transparent border-b-card",
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={message}
        initial={{ opacity: 0, scale: 0.8, y: position === "top" ? 4 : position === "bottom" ? -4 : 0 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3 }}
        className={`absolute ${positionClasses[position]} z-10 pointer-events-none`}
      >
        <div className="relative bg-card border border-border rounded-lg px-3 py-1.5 shadow-lg whitespace-nowrap">
          <p className="text-xs font-medium text-foreground">{message}</p>
          <div className={`absolute w-0 h-0 ${tailClasses[position]}`} />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Main TalkingCharacter component ────────────────────────────────
interface TalkingCharacterProps {
  character: CharacterKey;
  context?: MessageContext;
  customMessage?: string;
  animation?: CharacterAnimation;
  size?: "sm" | "md" | "lg" | "xl";
  showBubble?: boolean;
  bubblePosition?: "top" | "right" | "bottom";
  className?: string;
  bubbleInterval?: number;
}

const sizeMap = {
  sm: { img: "w-10 h-10", px: 40 },
  md: { img: "w-16 h-16", px: 64 },
  lg: { img: "w-24 h-24", px: 96 },
  xl: { img: "w-32 h-32", px: 128 },
};

export default function TalkingCharacter({
  character,
  context = "progress",
  customMessage,
  animation = "float",
  size = "md",
  showBubble = true,
  bubblePosition = "top",
  className = "",
  bubbleInterval = 6000,
}: TalkingCharacterProps) {
  const char = characters[character];
  const rotatingMessage = useRotatingMessage(context, bubbleInterval);
  const displayMessage = customMessage ?? rotatingMessage;
  const { img, px } = sizeMap[size];
  const variant = animationVariants[animation];

  return (
    <div className={`relative inline-flex flex-col items-center ${className}`}>
      {showBubble && <SpeechBubble message={displayMessage} position={bubblePosition} />}
      <motion.div
        initial={variant.initial}
        animate={variant.animate}
        className="relative"
      >
        <img
          src={char.src}
          alt={char.alt}
          width={px}
          height={px}
          loading="lazy"
          className={`${img} object-contain`}
        />
      </motion.div>
    </div>
  );
}
