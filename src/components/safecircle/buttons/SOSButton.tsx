"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { PulseRing } from "@/components/safecircle/effects/PulseRing";
import { cn } from "@/lib/utils";

const HOLD_DURATION_MS = 2000;

type SOSButtonProps = {
  /** Override the size of the central circle (px). Default 64. */
  size?: number;
  className?: string;
};

/**
 * Press-and-hold SOS button. Held for 2 seconds, navigates to `/panic`.
 *
 * Uses pointer events (works for mouse + touch + pen). On iOS Safari we also
 * suppress the native context menu and text selection that would otherwise
 * trigger on long-press.
 */
export function SOSButton({ size = 64, className }: SOSButtonProps) {
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isPressing, setIsPressing] = useState(false);

  const cancel = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsPressing(false);
  }, []);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      e.currentTarget.setPointerCapture(e.pointerId);
      setIsPressing(true);
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        setIsPressing(false);
        router.push("/panic");
      }, HOLD_DURATION_MS);
    },
    [router],
  );

  return (
    <div
      className={cn("relative flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      {!prefersReducedMotion && <PulseRing size={size} />}
      <motion.button
        type="button"
        aria-label="Aktiver SOS — hold inne i 2 sekunder"
        onPointerDown={handlePointerDown}
        onPointerUp={cancel}
        onPointerCancel={cancel}
        onPointerLeave={cancel}
        onContextMenu={(e) => e.preventDefault()}
        animate={{
          scale: isPressing ? 1.08 : 1,
          backgroundColor: isPressing
            ? "var(--color-red-dark)"
            : "var(--color-red-alert)",
        }}
        transition={{ duration: isPressing ? HOLD_DURATION_MS / 1000 : 0.18 }}
        className="relative z-10 flex items-center justify-center rounded-full font-bold text-white shadow-lg"
        style={{
          width: size,
          height: size,
          touchAction: "manipulation",
          userSelect: "none",
          WebkitUserSelect: "none",
        }}
      >
        SOS
      </motion.button>
    </div>
  );
}
