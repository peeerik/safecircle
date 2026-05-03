"use client";

import { motion, useReducedMotion } from "framer-motion";

type Tone = "red" | "orange" | "gold";

type AlertBackgroundProps = {
  tone: Tone;
  className?: string;
};

/**
 * Two-tone pulsing background for alert screens. Pulses between two stops
 * every 1.5s with a mirrored repeat, creating an urgent ambient effect.
 *
 * Falls back to a static solid first-stop color when the user prefers
 * reduced motion.
 */
const TONES: Record<Tone, [string, string]> = {
  red: ["#1a0a0a", "#3a0a0a"],
  orange: ["#1a0f00", "#3a1f00"],
  gold: ["#1a1500", "#3a2f00"],
};

export function AlertBackground({ tone, className }: AlertBackgroundProps) {
  const prefersReducedMotion = useReducedMotion();
  const [from, to] = TONES[tone];

  if (prefersReducedMotion) {
    return (
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 ${className ?? ""}`}
        style={{ backgroundColor: from }}
      />
    );
  }

  return (
    <motion.div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 ${className ?? ""}`}
      animate={{ backgroundColor: [from, to] }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        repeatType: "mirror",
        ease: "easeInOut",
      }}
    />
  );
}
