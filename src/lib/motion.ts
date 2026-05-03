import type { TargetAndTransition, Transition } from "framer-motion";

/**
 * Routes that animate from the bottom of the screen (alert / panic / dashcam),
 * matching the iOS pattern for emergency / urgent presentations.
 */
const ALERT_ROUTES = ["/fire-alert", "/burglary-alert", "/panic", "/dashcam"];

const slideRightInitial: TargetAndTransition = { x: "100%", opacity: 0.6 };
const slideRightAnimate: TargetAndTransition = { x: 0, opacity: 1 };

const slideUpInitial: TargetAndTransition = { y: "100%", opacity: 0.8 };
const slideUpAnimate: TargetAndTransition = { y: 0, opacity: 1 };

/** iOS-default easing curve for page push transitions. */
const TRANSITION: Transition = {
  duration: 0.35,
  ease: [0.32, 0.72, 0, 1],
};

export type PageMotionProps = {
  initial: TargetAndTransition;
  animate: TargetAndTransition;
  transition: Transition;
};

/**
 * Returns the framer-motion props (initial / animate / transition) for a given
 * pathname. Alert-style routes slide up; everything else slides in from the right.
 */
export function variantsFor(path: string): PageMotionProps {
  const isAlert = ALERT_ROUTES.some((r) => path.startsWith(r));
  return isAlert
    ? {
        initial: slideUpInitial,
        animate: slideUpAnimate,
        transition: TRANSITION,
      }
    : {
        initial: slideRightInitial,
        animate: slideRightAnimate,
        transition: TRANSITION,
      };
}
