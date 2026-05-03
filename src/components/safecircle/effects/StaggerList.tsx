"use client";

import { motion, type HTMLMotionProps, type Variants } from "framer-motion";

const containerVariants: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

/**
 * Variant pair children should opt-in to. Spread on each `motion.li` /
 * `motion.div` inside the list so it picks up the stagger orchestration.
 *
 * @example
 * <StaggerList>
 *   {items.map(it => (
 *     <motion.div key={it.id} variants={staggerItemVariants}>...</motion.div>
 *   ))}
 * </StaggerList>
 */
export const staggerItemVariants: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
};

type StaggerListProps = Omit<HTMLMotionProps<"div">, "ref">;

/**
 * Container that fans out children with a small staggered delay. Children
 * must be `motion.*` elements with `variants={staggerItemVariants}` to
 * participate.
 */
export function StaggerList({ children, ...rest }: StaggerListProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      {...rest}
    >
      {children}
    </motion.div>
  );
}
