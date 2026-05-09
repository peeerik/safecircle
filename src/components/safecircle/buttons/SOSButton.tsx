"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { PulseRing } from "@/components/safecircle/effects/PulseRing";
import { cn } from "@/lib/utils";

const PANIC_HOLD_MS = 2000;
const REPORT_HOLD_MS = 600;
const CONFIRMATION_MS = 2500;

type SOSButtonProps = {
  /** Override the size of the central circle (px). Default 64. */
  size?: number;
  className?: string;
};

type Category = {
  id: string;
  emoji: string;
  label: string;
};

const CATEGORIES: Category[] = [
  { id: "burglary", emoji: "🚨", label: "Innbrudd" },
  { id: "fire", emoji: "🔥", label: "Brann" },
  { id: "medical", emoji: "🚑", label: "Medisinsk nødhjelp" },
  { id: "other", emoji: "⚠️", label: "Annet" },
];

/**
 * Press-and-hold SOS button with two thresholds:
 * - 600ms → opens an "incident report" modal (bottom sheet).
 * - 2000ms → navigates to `/panic` (full SOS).
 *
 * Both timers start on pointerDown. When the 600ms fires we cancel the 2000ms
 * timer so the user is not navigated away while the modal opens. Both timers
 * are cleared on pointerUp / cancel / leave.
 */
export function SOSButton({ size = 64, className }: SOSButtonProps) {
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();

  // Separate refs so each threshold is independently cancellable.
  const reportTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const panicTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const confirmationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const [isPressing, setIsPressing] = useState(false);
  const [reportRegistered, setReportRegistered] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");
  const [confirmationVisible, setConfirmationVisible] = useState(false);

  const clearTimers = useCallback(() => {
    if (reportTimerRef.current) {
      clearTimeout(reportTimerRef.current);
      reportTimerRef.current = null;
    }
    if (panicTimerRef.current) {
      clearTimeout(panicTimerRef.current);
      panicTimerRef.current = null;
    }
  }, []);

  // Cleanup on unmount so stray timers can't fire after teardown.
  useEffect(() => {
    return () => {
      clearTimers();
      if (confirmationTimerRef.current) {
        clearTimeout(confirmationTimerRef.current);
      }
    };
  }, [clearTimers]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      e.currentTarget.setPointerCapture(e.pointerId);
      setIsPressing(true);
      setReportRegistered(false);

      // 600ms threshold: open the incident-report modal and cancel the panic
      // navigation so we don't redirect while the modal is opening.
      reportTimerRef.current = setTimeout(() => {
        reportTimerRef.current = null;
        if (panicTimerRef.current) {
          clearTimeout(panicTimerRef.current);
          panicTimerRef.current = null;
        }
        setIsPressing(false);
        setReportRegistered(true);
        setModalOpen(true);
        // The visual "registered" pulse is brief; reset shortly after.
        setTimeout(() => setReportRegistered(false), 220);
      }, REPORT_HOLD_MS);

      // 2000ms threshold: original panic navigation behavior.
      panicTimerRef.current = setTimeout(() => {
        panicTimerRef.current = null;
        setIsPressing(false);
        router.push("/panic");
      }, PANIC_HOLD_MS);
    },
    [router],
  );

  const handlePointerEnd = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      clearTimers();
      setIsPressing(false);
      try {
        if (e.currentTarget.hasPointerCapture?.(e.pointerId)) {
          e.currentTarget.releasePointerCapture(e.pointerId);
        }
      } catch {
        // No-op: releasePointerCapture can throw if the pointer is gone.
      }
    },
    [clearTimers],
  );

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setSelectedCategory(null);
    setCommentText("");
  }, []);

  const submitReport = useCallback(() => {
    closeModal();
    setConfirmationVisible(true);
    if (confirmationTimerRef.current) {
      clearTimeout(confirmationTimerRef.current);
    }
    confirmationTimerRef.current = setTimeout(() => {
      setConfirmationVisible(false);
      confirmationTimerRef.current = null;
    }, CONFIRMATION_MS);
  }, [closeModal]);

  return (
    <>
      <div
        className={cn("relative flex items-center justify-center", className)}
        style={{ width: size, height: size }}
      >
        {!prefersReducedMotion && <PulseRing size={size} />}
        <motion.button
          type="button"
          aria-label="Aktiver SOS — hold inne i 2 sekunder, eller hold kort for å melde hendelse"
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerEnd}
          onPointerCancel={handlePointerEnd}
          onPointerLeave={handlePointerEnd}
          onContextMenu={(e) => e.preventDefault()}
          animate={{
            scale: reportRegistered ? 0.92 : isPressing ? 1.08 : 1,
            backgroundColor: isPressing
              ? "var(--color-red-dark)"
              : "var(--color-red-alert)",
          }}
          transition={
            reportRegistered
              ? { type: "spring", stiffness: 500, damping: 18 }
              : {
                  duration: isPressing ? PANIC_HOLD_MS / 1000 : 0.18,
                }
          }
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

      {/* Bottom-sheet incident report modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            key="sos-report-overlay"
            className="fixed inset-0 z-50 flex items-end justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <button
              type="button"
              aria-label="Lukk"
              onClick={closeModal}
              className="absolute inset-0 bg-black/60"
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="sos-report-title"
              className="relative z-10 w-full max-w-md rounded-t-2xl px-5 pb-6 pt-4 text-white shadow-2xl"
              style={{ backgroundColor: "var(--color-navy-card)" }}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
            >
              {/* Drag handle */}
              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-white/20" />

              <h2
                id="sos-report-title"
                className="mb-4 text-lg font-semibold"
              >
                Meld hendelse
              </h2>

              <div className="mb-4 grid grid-cols-2 gap-3">
                {CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      aria-pressed={isSelected}
                      className={cn(
                        "flex h-20 flex-col items-center justify-center gap-1 rounded-xl border text-center transition-colors",
                        isSelected
                          ? "border-[var(--color-gold)] bg-[var(--color-gold)]/10"
                          : "border-white/10 bg-[var(--color-navy-light)] hover:border-white/20",
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className="text-2xl"
                        style={{ color: "var(--color-gold)" }}
                      >
                        {cat.emoji}
                      </span>
                      <span className="text-sm font-medium text-white">
                        {cat.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              <label htmlFor="sos-report-comment" className="sr-only">
                Kommentar
              </label>
              <textarea
                id="sos-report-comment"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Legg til kommentar (valgfritt)"
                rows={3}
                className="mb-4 w-full resize-none rounded-xl border border-white/10 bg-[var(--color-navy-light)] p-3 text-sm text-white placeholder:text-[var(--white-40)] focus:border-[var(--color-gold)] focus:outline-none"
              />

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 rounded-xl px-4 py-3 text-sm font-medium text-white/60 transition-colors hover:text-white"
                >
                  Avbryt
                </button>
                <button
                  type="button"
                  onClick={submitReport}
                  disabled={!selectedCategory}
                  className="flex-[2] rounded-xl px-4 py-3 text-sm font-semibold transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
                  style={{
                    backgroundColor: "var(--color-gold)",
                    color: "var(--color-navy-deep)",
                  }}
                >
                  Send varsel →
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation toast */}
      <AnimatePresence>
        {confirmationVisible && (
          <motion.div
            key="sos-report-confirmation"
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.25 }}
            className="pointer-events-none fixed inset-x-0 bottom-28 z-50 flex justify-center px-4"
          >
            <div
              className="rounded-full px-4 py-2 text-sm font-medium text-white shadow-lg"
              style={{ backgroundColor: "var(--color-navy-card)" }}
            >
              ✅ Varsel sendt til naboer
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
