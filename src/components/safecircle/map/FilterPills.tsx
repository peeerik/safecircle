"use client";

import { motion } from "framer-motion";

type Filter = "alle" | "betrodde" | "online";

interface Props {
  value: Filter;
  onChange: (v: Filter) => void;
}

const OPTIONS: { key: Filter; label: string }[] = [
  { key: "alle", label: "Alle" },
  { key: "betrodde", label: "Betrodde" },
  { key: "online", label: "Online nå" },
];

/**
 * iOS-style segmented control. The active pill is rendered with
 * `layoutId="filter-pill"` so framer-motion smoothly slides the gold
 * background between segments when the selection changes.
 */
export function FilterPills({ value, onChange }: Props) {
  return (
    <div className="flex rounded-full bg-[var(--color-navy-light)] p-1 gap-1">
      {OPTIONS.map((opt) => (
        <button
          key={opt.key}
          onClick={() => onChange(opt.key)}
          className="relative flex-1 rounded-full px-3 py-1.5 text-sm font-medium z-10 transition-colors"
          style={{
            color:
              value === opt.key
                ? "var(--color-navy-deep)"
                : "rgba(255,255,255,0.6)",
          }}
        >
          {value === opt.key && (
            <motion.div
              layoutId="filter-pill"
              className="absolute inset-0 rounded-full bg-[var(--color-gold)]"
              style={{ zIndex: -1 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          {opt.label}
        </button>
      ))}
    </div>
  );
}
