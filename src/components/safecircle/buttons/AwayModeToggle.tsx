"use client";

import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type AwayModeToggleProps = {
  /** Initial state when uncontrolled. Default false. */
  defaultOn?: boolean;
  /** Fires whenever the toggle flips. */
  onChange?: (on: boolean) => void;
  className?: string;
};

// Track measures 48x28 with 2px padding around a 24x24 knob, so the knob
// translates by exactly 20px between off (left) and on (right) positions.
const KNOB_TRAVEL_PX = 20;

/**
 * Sliding pill toggle used to enable "Borte-modus" (away mode) on the home
 * screen. Animates the knob between two end states and swaps colours so the
 * on-state reads as a clear gold "active" affordance.
 */
export function AwayModeToggle({
  defaultOn = false,
  onChange,
  className,
}: AwayModeToggleProps) {
  const [on, setOn] = useState<boolean>(defaultOn);

  const handleToggle = useCallback(() => {
    setOn((prev) => {
      const next = !prev;
      onChange?.(next);
      return next;
    });
  }, [onChange]);

  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label="Borte-modus"
      onClick={handleToggle}
      className={cn(
        "relative inline-flex h-7 w-12 shrink-0 items-center rounded-full p-0.5 transition-colors",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold)]",
        on ? "bg-[var(--color-gold)]" : "bg-[var(--color-navy-light)]",
        className,
      )}
    >
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        animate={{ x: on ? KNOB_TRAVEL_PX : 0 }}
        className={cn(
          "h-6 w-6 rounded-full shadow-sm",
          on ? "bg-[var(--color-navy-deep)]" : "bg-[var(--white-40)]",
        )}
      />
    </button>
  );
}
