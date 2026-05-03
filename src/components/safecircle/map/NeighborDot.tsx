"use client";

import { motion, useReducedMotion } from "framer-motion";

type NeighborDotProps = {
  x: number;
  y: number;
  /** Stroke / fill colour. Defaults to gold. */
  color?: string;
  /** Stagger delay so dots don't pulse in lockstep. */
  delay?: number;
  /** Circle radius in SVG units. Default 6. */
  size?: number;
  /** Optional small label rendered just below the dot. */
  label?: string;
};

/**
 * Pulsing dot used to plot neighbours on the `MapCanvas`. Designed to be
 * rendered as a child SVG element inside that canvas (so it inherits the
 * viewBox coordinate system).
 */
export function NeighborDot({
  x,
  y,
  color = "var(--color-gold)",
  delay = 0,
  size = 6,
  label,
}: NeighborDotProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <g>
      {prefersReducedMotion ? (
        <circle cx={x} cy={y} r={size} fill={color} opacity={0.8} />
      ) : (
        <motion.circle
          cx={x}
          cy={y}
          r={size}
          fill={color}
          animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
          transition={{
            duration: 2,
            delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ transformOrigin: `${x}px ${y}px` }}
        />
      )}
      {label ? (
        <text
          x={x}
          y={y + size + 10}
          textAnchor="middle"
          fontSize="8"
          fill="var(--white-80)"
          fontFamily="var(--font-geist-sans), system-ui, sans-serif"
        >
          {label}
        </text>
      ) : null}
    </g>
  );
}
