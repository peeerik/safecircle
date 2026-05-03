"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type HomeAloneToggleProps = {
  /** Whether the toggle starts in the "on" (gold / home alone) state. */
  defaultOn?: boolean;
  /** Fired with the new value whenever the user taps the toggle. */
  onChange?: (on: boolean) => void;
};

/**
 * Sliding pill toggle used on the Pets screen to broadcast that a pet
 * is currently home alone. "On" maps to gold (active state); "off" uses
 * the muted navy-light fill.
 */
export function HomeAloneToggle({
  defaultOn = true,
  onChange,
}: HomeAloneToggleProps) {
  const [on, setOn] = useState(defaultOn);

  const toggle = () => {
    const next = !on;
    setOn(next);
    onChange?.(next);
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={toggle}
      className="relative h-7 w-12 flex-shrink-0 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold)]"
      style={{
        background: on ? "var(--color-gold)" : "var(--color-navy-light)",
      }}
    >
      <motion.div
        className="absolute left-[2px] top-[2px] h-[22px] w-[22px] rounded-full"
        style={{
          background: on ? "var(--color-navy-deep)" : "rgba(255,255,255,0.4)",
        }}
        animate={{ x: on ? 20 : 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      />
    </button>
  );
}
