"use client";

import { ActionButton } from "@/components/safecircle/buttons/ActionButton";
import { PetCard } from "@/components/safecircle/cards/PetCard";
import { MobileShell } from "@/components/safecircle/shell/MobileShell";
import { copy } from "@/lib/copy";

/**
 * Pets profile screen. Shows the user's emergency-info card for each pet
 * (currently just Dino) and an entry point to edit the profile. The data
 * here is what neighbours see when a fire alert fires — keeping it
 * accurate is the whole point of the screen.
 */
export default function PetsPage() {
  return (
    <MobileShell>
      <div className="space-y-5 px-5 py-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-white">{copy.pets.title}</h1>
          <p className="text-sm text-white/80">{copy.pets.subtitle}</p>
        </div>
        <PetCard />
        <ActionButton variant="gold">{copy.pets.editProfile}</ActionButton>
      </div>
    </MobileShell>
  );
}
