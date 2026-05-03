"use client";

import { motion, useReducedMotion } from "framer-motion";

type PulseRingProps = {
  /** Number of concentric rings (default 3). Each fires with a staggered delay. */
  count?: number;
  /** CSS color value for the ring border. Defaults to the alert red. */
  color?: string;
  /** Square size in px the rings expand from. Defaults to 64. */
  size?: number;
};

/**
 * A continuously-pulsing ring effect. Used inside the SOS button and on
 * panic-screen contacts. Rings scale 1 → 2.5 while fading 0.5 → 0, with a
 * staggered start so they appear to ripple outwards.
 *
 * Respects `prefers-reduced-motion` — renders nothing in that case so the
 * underlying button stays calm.
 */
export function PulseRing({
  count = 3,
  color = "var(--color-red-alert)",
  size = 64,
}: PulseRingProps) {
  const prefersReducedMotion = useReducedMotion();
  if (prefersReducedMotion) return null;

  return (
    <div
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
      aria-hidden="true"
    >
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border-2"
          style={{
            width: size,
            height: size,
            borderColor: color,
          }}
          initial={{ scale: 1, opacity: 0.5 }}
          animate={{ scale: 2.5, opacity: 0 }}
          transition={{
            duration: 2,
            delay: (i * 2) / count,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}
