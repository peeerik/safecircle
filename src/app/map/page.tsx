"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Target } from "lucide-react";
import { ActionButton } from "@/components/safecircle/buttons/ActionButton";
import { neighbors } from "@/components/safecircle/data/neighbors";
import { FilterPills } from "@/components/safecircle/map/FilterPills";
import { MapCanvas } from "@/components/safecircle/map/MapCanvas";
import { NeighborDot } from "@/components/safecircle/map/NeighborDot";
import { RadiusOverlay } from "@/components/safecircle/map/RadiusOverlay";
import { MobileShell } from "@/components/safecircle/shell/MobileShell";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Filter = "alle" | "betrodde" | "online";

const BURGLAR_X = 115;
const BURGLAR_Y = 380;

export default function MapPage() {
  const [filter, setFilter] = useState<Filter>("alle");
  const [selected, setSelected] = useState<(typeof neighbors)[0] | null>(null);
  const [burglarOpen, setBurglarOpen] = useState<boolean>(false);

  // "betrodde" filters down to trusted neighbours only. "alle" and "online"
  // both show the full set in this demo (no online-state in mock data yet).
  const visible =
    filter === "betrodde"
      ? neighbors.filter((n) => n.badge === "betrodd")
      : neighbors;

  // Opening the burglar alert dialog should also dismiss any open neighbour
  // detail card so the two surfaces don't visually fight each other.
  const openBurglar = () => {
    setSelected(null);
    setBurglarOpen(true);
  };

  return (
    <MobileShell>
      {/* Header */}
      <div className="px-5 py-3 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Kart</h1>
        <span className="text-xs text-white/40 flex items-center gap-1">
          <Target className="size-3" /> 500m
        </span>
      </div>

      {/* Filter */}
      <div className="px-5 pb-3">
        <FilterPills value={filter} onChange={setFilter} />
      </div>

      {/* Full map — takes remaining space */}
      <div className="flex-1 relative">
        <MapCanvas viewBox="0 0 390 600">
          {/* 500m radius around user */}
          <RadiusOverlay cx={195} cy={300} r={140} />

          {/* User position — green center dot */}
          <NeighborDot
            x={195}
            y={300}
            color="var(--color-green-safe)"
            size={12}
          />

          {/* Burglar alert marker — rendered before neighbour dots so trusted
              neighbours visually sit on top. Three staggered pulsing rings
              radiate outward, with a static red dot at the center and an
              oversized invisible hit-target for easier tapping. */}
          <motion.circle
            cx={BURGLAR_X}
            cy={BURGLAR_Y}
            fill="none"
            stroke="#FF4444"
            strokeWidth={1.5}
            initial={{ r: 8, opacity: 0.6 }}
            animate={{ r: 20, opacity: 0 }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0,
            }}
          />
          <motion.circle
            cx={BURGLAR_X}
            cy={BURGLAR_Y}
            fill="none"
            stroke="#FF4444"
            strokeWidth={1.5}
            initial={{ r: 8, opacity: 0.6 }}
            animate={{ r: 20, opacity: 0 }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.6,
            }}
          />
          <motion.circle
            cx={BURGLAR_X}
            cy={BURGLAR_Y}
            fill="none"
            stroke="#FF4444"
            strokeWidth={1.5}
            initial={{ r: 8, opacity: 0.6 }}
            animate={{ r: 20, opacity: 0 }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.2,
            }}
          />
          <circle cx={BURGLAR_X} cy={BURGLAR_Y} r={6} fill="#FF4444" />
          <circle
            cx={BURGLAR_X}
            cy={BURGLAR_Y}
            r={22}
            fill="transparent"
            style={{ cursor: "pointer" }}
            onClick={openBurglar}
          />

          {/* Neighbour dots */}
          {visible.map((n, i) => (
            <NeighborDot
              key={n.id}
              x={n.x}
              y={n.y}
              color={
                n.badge === "betrodd"
                  ? "var(--color-gold)"
                  : "var(--color-gold-dim)"
              }
              delay={i * 0.05}
              size={7}
            />
          ))}

          {/* Invisible hit-target circles for tap detection. Rendered after
              the dots so they sit on top and capture pointer events without
              affecting the visual layout. */}
          {visible.map((n) => (
            <circle
              key={`hit-${n.id}`}
              cx={n.x}
              cy={n.y}
              r={18}
              fill="transparent"
              style={{ cursor: "pointer" }}
              onClick={() => setSelected(n)}
            />
          ))}
        </MapCanvas>

        {/* Tap-to-detail floating card */}
        {selected && (
          <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-[var(--color-navy-card)]/95 backdrop-blur-md p-4 shadow-xl border border-white/10">
            <div className="flex items-start justify-between">
              <div className="space-y-0.5">
                <p className="font-semibold text-white">{selected.name}</p>
                <p className="text-sm text-white/70">{selected.address}</p>
                <p className="text-xs text-white/50">{selected.distance}</p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                    selected.badge === "betrodd"
                      ? "bg-[var(--color-gold)]/20 text-[var(--color-gold)]"
                      : "bg-[var(--color-green-safe)]/20 text-[var(--color-green-safe)]"
                  }`}
                >
                  {selected.badge === "betrodd" ? "Betrodd" : "Aktiv"}
                </span>
                <button
                  onClick={() => setSelected(null)}
                  className="text-white/40 hover:text-white"
                  aria-label="Lukk"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Dialog open={burglarOpen} onOpenChange={setBurglarOpen}>
        <DialogContent className="bg-[var(--color-navy-card)] border border-white/10 text-white max-w-sm mx-4">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-white">
              ⚠️ Pågående innbrudd – Storgata 1
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-sm text-white/80 space-y-3">
            <p>
              Ta bilde av gjerningsmann og kjøretøy/regnr hvis mulig — fra
              trygg avstand. Overlever bildet til politiet.
            </p>
            <p className="text-[var(--color-gold)] font-medium">
              ❗ Ikke heng ut bilde av personen offentlig — dette kan være
              ulovlig.
            </p>
          </DialogDescription>
          <DialogClose asChild>
            <ActionButton variant="secondary">Lukk</ActionButton>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </MobileShell>
  );
}
