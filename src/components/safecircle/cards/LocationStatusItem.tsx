"use client";

import { motion, type Variants } from "framer-motion";
import { Check } from "lucide-react";

type LocationStatusItemProps = {
  /** Contact / location display name. */
  name: string;
  /** Optional secondary line — e.g. distance ("120m unna") or call status ("Ringer nå…"). */
  distance?: string;
  /** Framer Motion variants — pass `staggerItemVariants` from `StaggerList` for orchestrated entrance. */
  variants?: Variants;
};

/**
 * Single row inside the panic-screen "contacts notified" list. Shows a green
 * check avatar, the contact name, an optional distance/status line, and a
 * "Varslet" tag on the right. Designed to be rendered inside a `StaggerList`
 * so it picks up the parent's staggered fade-in.
 */
export function LocationStatusItem({
  name,
  distance,
  variants,
}: LocationStatusItemProps) {
  return (
    <motion.div
      {...(variants !== undefined ? { variants } : {})}
      className="flex items-center gap-3 rounded-xl bg-[var(--color-navy-card)]/80 backdrop-blur-md p-3"
    >
      <div className="size-9 rounded-full bg-[var(--color-green-safe)]/20 flex items-center justify-center flex-shrink-0">
        <Check className="size-5 text-[var(--color-green-safe)]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white truncate">{name}</p>
        {distance && <p className="text-xs text-white/60">{distance}</p>}
      </div>
      <span className="text-xs text-[var(--color-green-safe)] font-semibold flex-shrink-0">
        Varslet
      </span>
    </motion.div>
  );
}
