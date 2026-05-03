"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Zap, X } from "lucide-react";

/**
 * Floating action button that exposes every demo route in a single tap.
 *
 * This is purely a presenter aid for live investor demos — the production
 * app would never ship a back-channel like this. Always rendered (no env
 * gate) because this entire codebase is the demo prototype.
 *
 * Behaviour:
 * - 48x48 gold circle pinned to bottom-right, sitting above the BottomNav.
 * - Tapping the FAB toggles a vertical stack of route chips that animates
 *   in from below with a small stagger.
 * - Tapping any chip navigates and closes the menu.
 * - Tapping anywhere outside the menu closes it (handled via a window
 *   pointerdown listener — the menu's own click is stopped at the root).
 */

type DemoRoute = {
  href: string;
  label: string;
};

// Order roughly matches the natural demo flow (home → alerts → tools).
const DEMO_ROUTES: ReadonlyArray<DemoRoute> = [
  { href: "/", label: "🏠 Hjem" },
  { href: "/fire-alert", label: "🔥 Brannvarsling" },
  { href: "/burglary-alert", label: "🚨 Innbruddsvarsling" },
  { href: "/panic", label: "🆘 Panikknapp aktiv" },
  { href: "/pets", label: "🐕 Kjæledyrprofil" },
  { href: "/map", label: "🗺 Kart" },
  { href: "/dashcam", label: "📹 Dashcam-forespørsel" },
];

export function DemoMenu() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Close the menu when the user taps anywhere outside the FAB / chip stack.
  // We attach to `pointerdown` (rather than `click`) so the menu collapses
  // before navigation handlers fire on a chip tap, avoiding a flash of the
  // menu after the route transition begins.
  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (
        rootRef.current &&
        target instanceof Node &&
        !rootRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };

    window.addEventListener("pointerdown", handlePointerDown);
    return () => window.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  return (
    <div
      ref={rootRef}
      className="fixed right-4 bottom-24 z-50 flex flex-col items-end gap-2"
    >
      {/* Route chip stack — rendered above the FAB, anchored to the right.
          AnimatePresence lets the whole stack fade/slide out cleanly when
          the menu closes. Reversed so the first route ends up nearest the
          FAB visually while still animating in from the bottom up. */}
      <AnimatePresence>
        {open && (
          <motion.ul
            // Reset native list styling so the chips lay out as a tight
            // column without bullets or default padding.
            className="flex flex-col-reverse items-end gap-2 p-0"
            initial="closed"
            animate="open"
            exit="closed"
            variants={{
              open: { transition: { staggerChildren: 0.03 } },
              closed: {
                transition: { staggerChildren: 0.02, staggerDirection: -1 },
              },
            }}
          >
            {DEMO_ROUTES.map((route) => (
              <motion.li
                key={route.href}
                variants={{
                  closed: { opacity: 0, y: 8 },
                  open: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.18, ease: "easeOut" }}
              >
                <Link
                  href={route.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-full bg-[var(--color-navy-card)]/95 px-4 py-2 text-sm font-medium text-[var(--color-gold)] shadow-lg backdrop-blur transition-colors hover:bg-[var(--color-navy-card)]"
                >
                  {route.label}
                </Link>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>

      {/* FAB toggle — gold circle with the same shadow as the chips so the
          stack reads as one unit. `aria-expanded` keeps screen readers in
          sync with the visible state. */}
      <button
        type="button"
        aria-label={open ? "Lukk demo-meny" : "Åpne demo-meny"}
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-gold)] text-[var(--color-navy-deep)] shadow-lg transition-transform active:scale-95"
      >
        {open ? <X className="size-5" /> : <Zap className="size-5" />}
      </button>
    </div>
  );
}
