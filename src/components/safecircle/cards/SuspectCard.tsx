"use client";

import { ShieldCheck } from "lucide-react";
import { burglarySuspect } from "@/components/safecircle/data/suspects";
import { copy } from "@/lib/copy";

/**
 * Suspect description card surfaced on the burglary alert screen.
 *
 * Pulls the demo report (`burglarySuspect`) from the shared suspects data file
 * so changes to the witness/description/timing propagate without copy edits.
 * Falls back to copy strings (`copy.burglary.suspect.*`) for any field the
 * data shape does not yet describe — keeping the card resilient if Wave 3
 * extends the type.
 *
 * The reporter row carries a gold "BankID-verifisert" pill to visually echo
 * Norway's national identity scheme; the photo slot renders an inert
 * placeholder when no asset has been uploaded yet (the Wave 2 visual pass
 * owns the real treatment).
 */
export function SuspectCard() {
  // Prefer live data; fall back to localized copy so the card always renders
  // something sensible even if a field is empty or removed later.
  const description =
    burglarySuspect.description || copy.burglary.suspect.details;
  const observedAt = burglarySuspect.observedAt;
  const location = burglarySuspect.location;
  const reporter = burglarySuspect.reporter;
  const photoUrl = burglarySuspect.photoUrl;

  return (
    <section
      className="space-y-3 rounded-2xl border border-[var(--color-gold-dim)]/30 bg-[var(--color-navy-card)]/80 p-4 backdrop-blur"
      aria-label={copy.burglary.suspect.heading}
    >
      {/* Reporter row — name on the left, BankID verification pill on the right. */}
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-white">{reporter}</p>
        <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-gold)]/15 px-2.5 py-0.5 text-xs font-semibold text-[var(--color-gold)]">
          <ShieldCheck className="size-3" aria-hidden="true" />
          BankID-verifisert
        </span>
      </div>

      {/* Description heading + free-text details. */}
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--white-40)]">
          {copy.burglary.suspect.heading}
        </p>
        <p className="text-sm leading-6 text-[var(--white-80)]">
          {description}
        </p>
      </div>

      {/* Time + location meta line — matches the alert subtitle vocabulary. */}
      <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-[var(--white-40)]">
        <span>🕒 {observedAt}</span>
        <span>📍 {location}</span>
      </div>

      {/* Photo slot. Wave 2 will swap this for a real <Image>; for now we keep
          a clearly-inert placeholder so the layout reads correctly in demos. */}
      {photoUrl ? (
        // Intentional: real photo wiring is owned by Wave 2. We leave a typed
        // branch here so the swap is a one-line change.
        <div
          className="flex aspect-video w-full items-center justify-center overflow-hidden rounded-lg bg-[var(--color-navy-light)] text-xs text-[var(--white-40)]"
          aria-label={copy.burglary.suspect.photoLabel}
        >
          {copy.burglary.suspect.photoLabel}
        </div>
      ) : (
        <div className="flex aspect-video w-full items-center justify-center rounded-lg bg-[var(--color-navy-light)] text-xs text-[var(--white-40)]">
          Ingen bilder ennå
        </div>
      )}
    </section>
  );
}
