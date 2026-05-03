"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

export type ActionButtonVariant =
  | "primary"
  | "secondary"
  | "danger"
  | "gold"
  | "green";

type ActionButtonProps = Omit<HTMLMotionProps<"button">, "ref" | "children"> & {
  variant?: ActionButtonVariant;
  /** Optional leading icon node. */
  icon?: React.ReactNode;
  children?: React.ReactNode;
};

const VARIANT_CLASSES: Record<ActionButtonVariant, string> = {
  primary: "bg-[var(--color-red-alert)] text-white",
  danger: "bg-[var(--color-red-dark)] text-white",
  gold: "bg-[var(--color-gold)] text-[var(--color-navy-deep)]",
  green: "bg-[var(--color-green-safe)] text-white",
  secondary:
    "bg-[var(--color-navy-light)] text-white border border-[var(--color-border)]",
};

/**
 * Full-width, tappable action button shared across all alert / decision
 * screens. Press feedback uses a small scale-down via framer-motion's
 * `whileTap` for that "real-app" feel.
 */
export function ActionButton({
  variant = "primary",
  icon,
  children,
  className,
  ...rest
}: ActionButtonProps) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.97 }}
      className={cn(
        "flex h-14 w-full items-center justify-center gap-2 rounded-2xl text-base font-semibold shadow-md transition-shadow",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold)]",
        VARIANT_CLASSES[variant],
        className,
      )}
      {...rest}
    >
      {icon ? <span className="flex items-center">{icon}</span> : null}
      <span>{children}</span>
    </motion.button>
  );
}
