"use client";

import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import { ActionButton } from "@/components/safecircle/buttons/ActionButton";
import { AlertHeader } from "@/components/safecircle/cards/AlertHeader";
import { FirePetInfo } from "@/components/safecircle/cards/FirePetInfo";
import { AlertBackground } from "@/components/safecircle/effects/AlertBackground";
import {
  StaggerList,
  staggerItemVariants,
} from "@/components/safecircle/effects/StaggerList";
import { MobileShell } from "@/components/safecircle/shell/MobileShell";
import { copy } from "@/lib/copy";

/**
 * Fire Alert screen — full-bleed urgent alert with a pulsing red ambient
 * background, the triggering event metadata, key info about the pet left
 * home alone, and the three primary response actions. Bottom navigation is
 * intentionally hidden so the user is funnelled into a decision.
 *
 * All click handlers are demo no-ops; this is a pitch / UX prototype.
 */
export default function FireAlertPage() {
  // Demo handlers — intentional no-ops. This is a pitch / UX prototype, so
  // the action buttons need to feel pressable but should not wire up real
  // telephony / camera APIs.
  const handleCallFire = () => {};
  const handleChecking = () => {};
  const handleCapture = () => {};

  return (
    <MobileShell showNav={false} showStatusBar={true}>
      <div className="relative min-h-full">
        {/* Pulsing red ambient layer — sits behind everything. */}
        <AlertBackground tone="red" />

        {/* Foreground content. `relative z-10` lifts it above the bg layer. */}
        <StaggerList className="relative z-10 flex flex-col gap-5 px-5 py-6">
          <motion.div variants={staggerItemVariants}>
            <AlertHeader
              icon={
                // Subtle scale pulse on the icon so it feels alive without
                // distracting from the red background pulse.
                <motion.div
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="flex items-center justify-center"
                >
                  <Flame className="size-16 text-white drop-shadow" />
                </motion.div>
              }
              title={copy.fire.title}
              subtitle={copy.fire.location}
              timestamp={copy.fire.timestamp}
            />
          </motion.div>

          <motion.div variants={staggerItemVariants}>
            <FirePetInfo />
          </motion.div>

          <motion.div
            variants={staggerItemVariants}
            className="flex flex-col gap-3"
          >
            <ActionButton variant="primary" onClick={handleCallFire}>
              {copy.fire.actions.callFire}
            </ActionButton>
            <ActionButton variant="green" onClick={handleChecking}>
              {copy.fire.actions.checking}
            </ActionButton>
            <ActionButton variant="gold" onClick={handleCapture}>
              {copy.fire.actions.capture}
            </ActionButton>
          </motion.div>

          <motion.p
            variants={staggerItemVariants}
            className="text-center text-xs text-[var(--white-40)]"
          >
            {copy.fire.footer}
          </motion.p>
        </StaggerList>
      </div>
    </MobileShell>
  );
}
