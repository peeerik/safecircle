import { copy } from "@/lib/copy";
import { cn } from "@/lib/utils";

export type NeighborBadge = "betrodd" | "aktiv";

type NeighborCardProps = {
  name: string;
  address: string;
  distance: string;
  badge: NeighborBadge;
  className?: string;
};

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const BADGE_CLASSES: Record<NeighborBadge, string> = {
  betrodd:
    "bg-[var(--color-gold)]/15 text-[var(--color-gold)] border border-[var(--color-gold)]/30",
  aktiv:
    "bg-[var(--color-green-safe)]/15 text-[var(--color-green-safe)] border border-[var(--color-green-safe)]/30",
};

const BADGE_LABEL: Record<NeighborBadge, string> = {
  betrodd: copy.badges.trusted,
  aktiv: copy.badges.active,
};

/**
 * Compact horizontal card representing a neighbour. Used on the home screen
 * neighbour list.
 */
export function NeighborCard({
  name,
  address,
  distance,
  badge,
  className,
}: NeighborCardProps) {
  return (
    <article
      className={cn(
        "flex items-center gap-3 rounded-2xl bg-[var(--color-navy-card)] p-3 shadow-sm",
        className,
      )}
    >
      <div
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--color-navy-light)] text-sm font-semibold text-[var(--white-80)]"
        aria-hidden="true"
      >
        {initials(name)}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-white">{name}</p>
        <p className="truncate text-xs text-[var(--white-80)]">
          {address} · {distance}
        </p>
      </div>

      <span
        className={cn(
          "shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
          BADGE_CLASSES[badge],
        )}
      >
        {BADGE_LABEL[badge]}
      </span>
    </article>
  );
}
