"use client";

import { useRouter } from "next/navigation";
import { Video } from "lucide-react";
import { ActionButton } from "@/components/safecircle/buttons/ActionButton";
import { AlertHeader } from "@/components/safecircle/cards/AlertHeader";
import { MapCanvas } from "@/components/safecircle/map/MapCanvas";
import { NeighborDot } from "@/components/safecircle/map/NeighborDot";
import { RadiusOverlay } from "@/components/safecircle/map/RadiusOverlay";
import { MobileShell } from "@/components/safecircle/shell/MobileShell";
import { copy } from "@/lib/copy";

/**
 * Dashcam Request screen — a notification (NOT an emergency) asking the user
 * whether they captured anything during a recent incident window. Background
 * stays calm: plain navy, no pulsing alert layer. Bottom nav is hidden so the
 * user is funnelled into one of the three response actions.
 *
 * Layout mirrors the alert screens (header → context card → mini map →
 * vertical action stack → footer note) for consistency, but the chrome is
 * intentionally less urgent: gold icon, no animated background.
 *
 * All click handlers are demo no-ops except the dismiss action, which pops
 * the user back to the previous screen via `router.back()`.
 */
export default function DashcamPage() {
  const router = useRouter();

  // Demo handlers — intentional no-ops. No real upload / report flow exists
  // in the prototype; only `handleDismiss` does real work (route history).
  const handleUpload = () => {};
  const handleReport = () => {};
  const handleDismiss = () => {
    router.back();
  };

  return (
    <MobileShell showNav={false} showStatusBar={true}>
      {/* Calm navy surface — no AlertBackground here on purpose. This screen
          is a notification, not an in-progress emergency. */}
      <div className="min-h-full bg-[var(--color-navy-deep)] px-5 py-6 space-y-5">
        <AlertHeader
          icon={<Video className="size-16 text-[var(--color-gold)]" />}
          title={copy.dashcam.title}
          subtitle={copy.dashcam.description}
          timestamp={copy.dashcam.window}
        />

        {/* Context card — incident summary with label/value hierarchy.
            Labels sit at white/50 so the values (white/90) lead the eye. */}
        <section className="rounded-2xl bg-[var(--color-navy-card)] p-4 space-y-2">
          <p className="text-sm text-white/80">
            <span className="text-white/50">Hendelse: </span>
            <span className="text-white/90">{copy.dashcam.description}</span>
          </p>
          <p className="text-sm text-white/80">
            <span className="text-white/50">Tidsvindu: </span>
            <span className="text-white/90">{copy.dashcam.window}</span>
          </p>
          <p className="text-sm text-white/80">
            <span className="text-white/50">Spørsmål: </span>
            <span className="text-white/90">{copy.dashcam.question}</span>
          </p>
        </section>

        {/* Mini map — fixed-aspect 390x200 viewBox so the radius circle and
            incident dot render at predictable proportions. */}
        <div className="rounded-2xl overflow-hidden">
          <div className="aspect-[390/200] w-full">
            <MapCanvas viewBox="0 0 390 200">
              <RadiusOverlay cx={195} cy={100} r={70} />
              <NeighborDot
                x={195}
                y={100}
                color="var(--color-red-alert)"
                size={8}
              />
            </MapCanvas>
          </div>
        </div>

        {/* Vertical action stack — gold (primary positive action), then two
            secondary fallbacks. Dismiss pops back to the previous route. */}
        <div className="space-y-3">
          <ActionButton variant="gold" onClick={handleUpload}>
            {copy.dashcam.actions.upload}
          </ActionButton>
          <ActionButton variant="secondary" onClick={handleReport}>
            {copy.dashcam.actions.report}
          </ActionButton>
          <ActionButton variant="secondary" onClick={handleDismiss}>
            {copy.dashcam.actions.nothing}
          </ActionButton>
        </div>

        <p className="text-center text-xs text-[var(--white-40)]">
          {copy.dashcam.footer}
        </p>
      </div>
    </MobileShell>
  );
}
