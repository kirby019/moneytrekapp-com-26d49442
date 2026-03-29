import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  rotation: number;
  delay: number;
  shape: "circle" | "square" | "strip";
}

const COLORS = [
  "hsl(var(--accent))",
  "hsl(var(--primary))",
  "#FFD700",
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FF9FF3",
];

function createParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: -10 - Math.random() * 20,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    size: 6 + Math.random() * 8,
    rotation: Math.random() * 360,
    delay: Math.random() * 0.8,
    shape: (["circle", "square", "strip"] as const)[Math.floor(Math.random() * 3)],
  }));
}

interface ConfettiProps {
  active: boolean;
  intensity?: "low" | "medium" | "high";
  duration?: number;
  onComplete?: () => void;
}

export default function Confetti({
  active,
  intensity = "medium",
  duration = 3000,
  onComplete,
}: ConfettiProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  const counts = { low: 30, medium: 60, high: 100 };

  useEffect(() => {
    if (active) {
      setParticles(createParticles(counts[intensity]));
      const timer = setTimeout(() => {
        setParticles([]);
        onComplete?.();
      }, duration);
      return () => clearTimeout(timer);
    } else {
      setParticles([]);
    }
  }, [active, intensity, duration, onComplete]);

  if (!active && particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{
              left: `${p.x}%`,
              top: "-5%",
              rotate: 0,
              opacity: 1,
            }}
            animate={{
              top: "110%",
              rotate: p.rotation + 720,
              x: [0, (Math.random() - 0.5) * 200, (Math.random() - 0.5) * 100],
              opacity: [1, 1, 0.8, 0],
            }}
            transition={{
              duration: 2 + Math.random() * 1.5,
              delay: p.delay,
              ease: "easeIn",
            }}
            className="absolute"
            style={{
              width: p.shape === "strip" ? p.size * 0.4 : p.size,
              height: p.shape === "strip" ? p.size * 2 : p.size,
              backgroundColor: p.color,
              borderRadius: p.shape === "circle" ? "50%" : p.shape === "strip" ? "2px" : "2px",
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
