import { HomeAloneToggle } from "@/components/safecircle/buttons/HomeAloneToggle";
import { dino } from "@/components/safecircle/data/pets";

type InfoRowProps = {
  label: string;
  value: string;
};

/**
 * Two-column row used inside the emergency info section. The label sits
 * left in muted text; the value right-aligns so longer values wrap nicely
 * without breaking the alignment grid.
 */
function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex justify-between gap-4">
      <span className="flex-shrink-0 text-xs text-white/40">{label}</span>
      <span className="text-right text-sm text-white/90">{value}</span>
    </div>
  );
}

/**
 * Full pet profile card surfaced on the Pets screen. Shows Dino's avatar,
 * identity, emergency information neighbours can see during a fire alert,
 * and a toggle to broadcast the "home alone" state.
 *
 * Reads the demo pet (`dino`) directly from the shared pets data module so
 * the card stays in lockstep with the home / fire screens that reference
 * the same record.
 */
export function PetCard() {
  const pet = dino;

  return (
    <div className="space-y-4 rounded-2xl bg-[var(--color-navy-card)] p-5">
      {/* Identity row */}
      <div className="flex items-center gap-4">
        <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-gold-dim)] text-4xl">
          🐕
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">{pet.name}</h2>
          <p className="text-sm text-white/80">
            {pet.breed} · {pet.ageYears} år
          </p>
          <span className="mt-1 inline-flex items-center gap-1 rounded-full border border-[var(--color-gold)] bg-[var(--color-gold)]/10 px-2.5 py-0.5 text-xs text-[var(--color-gold)]">
            🏠 Hjemme alene nå
          </span>
        </div>
      </div>

      {/* Emergency information */}
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-white/50">
          Nødinformasjon
        </p>
        <div className="space-y-2">
          <InfoRow
            label="Vanlig plassering"
            value={pet.usualLocation || "Stue / ved sofaen"}
          />
          <InfoRow
            label="Spesielle behov"
            value={pet.temperament || "Redd for høye lyder"}
          />
          <InfoRow label="Veterinær" value={pet.vet || "Hamar Dyreklinikk"} />
          <InfoRow
            label="Nøkkelboks"
            value={pet.keyShared || "Ja — kode delt med betrodde"}
          />
          <InfoRow label="Allergier / medisin" value={pet.meds || "Ingen"} />
        </div>
      </div>

      {/* Home-alone toggle */}
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-white/50">
          Tilstand
        </p>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-white">
              🏠 Hjemme alene-status
            </p>
            <p className="text-xs text-white/60">
              Vis naboer at Dino er hjemme
            </p>
          </div>
          <HomeAloneToggle defaultOn={true} />
        </div>
      </div>
    </div>
  );
}
