"use client";

import { motion } from "framer-motion";
import { Siren } from "lucide-react";
import { ActionButton } from "@/components/safecircle/buttons/ActionButton";
import { AlertHeader } from "@/components/safecircle/cards/AlertHeader";
import { SuspectCard } from "@/components/safecircle/cards/SuspectCard";
import { AlertBackground } from "@/components/safecircle/effects/AlertBackground";
import {
  StaggerList,
  staggerItemVariants,
} from "@/components/safecircle/effects/StaggerList";
import { MapCanvas } from "@/components/safecircle/map/MapCanvas";
import { NeighborDot } from "@/components/safecircle/map/NeighborDot";
import { MobileShell } from "@/components/safecircle/shell/MobileShell";
import { copy } from "@/lib/copy";

/**
 * Burglary Alert screen — full-bleed orange-toned alert surfaced when a
 * neighbour reports suspicious activity nearby. Shows the verified reporter's
 * description, a mini map locating the incident, and the three primary
 * response actions (document, call 112, confirm observation).
 *
 * Mirrors the structure of the fire-alert screen for visual consistency:
 * pulsing ambient background, animated header icon, and a staggered entrance
 * for each section. Bottom nav is hidden so the user is funnelled into a
 * decision; the iOS status bar stays visible to keep the "real device"
 * framing intact.
 *
 * All click handlers are demo no-ops; this is a pitch / UX prototype.
 */
export default function BurglaryAlertPage() {
  // Demo handlers — intentional no-ops. Mirrors fire-alert: action buttons
  // need to feel pressable but should not wire up real telephony / camera
  // APIs in this pitch / UX prototype.
  const handleDocument = () => {};
  const handleCallPolice = () => {};
  const handleConfirm = () => {};

  return (
    <MobileShell showNav={false} showStatusBar={true}>
      <div className="relative min-h-full">
        {/* Pulsing orange ambient layer — sits behind everything. */}
        <AlertBackground tone="orange" />

        {/* Foreground content. `relative z-10` lifts it above the bg layer. */}
        <StaggerList className="relative z-10 flex flex-col gap-5 px-5 py-6">
          <motion.div variants={staggerItemVariants}>
            <AlertHeader
              icon={
                // Subtle scale pulse on the siren icon — echoes the ambient
                // background pulse without becoming visually noisy.
                <motion.div
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="flex items-center justify-center"
                >
                  <Siren className="size-16 text-white drop-shadow" />
                </motion.div>
              }
              title={copy.burglary.title}
              subtitle={copy.burglary.description}
              timestamp={copy.burglary.timestamp}
            />
          </motion.div>

          <motion.div variants={staggerItemVariants}>
            <SuspectCard />
          </motion.div>

          <motion.div variants={staggerItemVariants}>
            {/* Mini map — fixed-aspect container so the 390x200 viewBox renders
                at a predictable height regardless of viewport. Rounded corners
                + border match the rest of the card surfaces on this screen. */}
            <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-navy-card)]/60">
              <div className="aspect-[390/200] w-full">
                <MapCanvas viewBox="0 0 390 200">
                  <NeighborDot
                    x={195}
                    y={100}
                    color="var(--color-red-alert)"
                    size={10}
                  />
                </MapCanvas>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={staggerItemVariants}
            className="flex flex-col gap-3"
          >
            <ActionButton variant="gold" onClick={handleDocument}>
              {copy.burglary.actions.document}
            </ActionButton>
            <ActionButton variant="primary" onClick={handleCallPolice}>
              {copy.burglary.actions.callPolice}
            </ActionButton>
            <ActionButton variant="secondary" onClick={handleConfirm}>
              {copy.burglary.actions.confirm}
            </ActionButton>
          </motion.div>

          <motion.p
            variants={staggerItemVariants}
            className="text-center text-xs text-[var(--white-40)]"
          >
            {copy.burglary.footer}
          </motion.p>
        </StaggerList>
      </div>
    </MobileShell>
  );
}
