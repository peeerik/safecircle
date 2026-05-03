"use client";

import { usePathname } from "next/navigation";
import { motion, useReducedMotion, type Variants } from "framer-motion";

const ALERT_ROUTES = ["/fire-alert", "/burglary-alert", "/panic", "/dashcam"];

const slideRightVariants: Variants = {
  initial: { x: "100%", opacity: 0.6 },
  animate: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.35, ease: [0.32, 0.72, 0, 1] },
  },
};

const slideUpVariants: Variants = {
  initial: { y: "100%", opacity: 0.8 },
  animate: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.35, ease: [0.32, 0.72, 0, 1] },
  },
};

/**
 * App Router re-mounts a `template.tsx` on every navigation, so we use it as
 * the page-transition mount point. We accept enter-only animation (no exit
 * tween possible) because that mirrors iOS push perception.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className="min-h-dvh">{children}</div>;
  }

  const isAlert = ALERT_ROUTES.some((r) => path.startsWith(r));
  const variants = isAlert ? slideUpVariants : slideRightVariants;

  return (
    <motion.div
      key={path}
      variants={variants}
      initial="initial"
      animate="animate"
      className="min-h-dvh"
    >
      {children}
    </motion.div>
  );
}
