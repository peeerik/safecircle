"use client";

import { dino } from "@/components/safecircle/data/pets";
import { copy } from "@/lib/copy";

/**
 * Compact pet info card surfaced on the fire alert screen so neighbours
 * immediately know an animal is home and where it usually rests. This is the
 * alert-context variant — a fuller, editable PetCard lives on the Pets
 * profile screen and is owned by a different module.
 *
 * Pulls the demo dog (`dino`) from the shared pets data file and falls back
 * to copy strings for any field the data shape does not yet describe (e.g.
 * the shared key code line).
 */
export function FirePetInfo() {
  // Compose the heading line from live pet data so changes to the data file
  // (breed, age, name) propagate without copy edits.
  const headingLine = `🐕 Hund hjemme — «${dino.name}», ${dino.breed.toLowerCase()}`;

  return (
    <div
      className="space-y-2 rounded-2xl border border-[var(--color-red-alert)]/30 bg-[var(--color-navy-card)]/80 p-4 backdrop-blur"
      role="group"
      aria-label={copy.fire.pet.heading}
    >
      <p className="font-semibold text-white">{headingLine}</p>
      <p className="text-sm text-[var(--white-80)]">
        📍 Vanlig plassering: {dino.usualLocation}
      </p>
      <p className="text-sm text-[var(--white-80)]">
        🔑 Nøkkelboks: {dino.keyShared}
      </p>
    </div>
  );
}
