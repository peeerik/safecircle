"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
type Simulation = "burglary" | "fire";

const BURGLAR_X = 115;
const BURGLAR_Y = 380;
const FIRE_X = 80;
const FIRE_Y = 160; // Anne Lise H.'s position on Parkveien

export default function MapPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("alle");
  const [selected, setSelected] = useState<(typeof neighbors)[0] | null>(null);
  const [burglarOpen, setBurglarOpen] = useState<boolean>(false);
  const [fireOpen, setFireOpen] = useState<boolean>(false);
  const [simulation, setSimulation] = useState<Simulation>("burglary");

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

  const openFire = () => {
    setSelected(null);
    setFireOpen(true);
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
        {/* Simulation switcher — toggles between burglary and fire scenarios */}
        <button
          type="button"
          aria-label="Bytt simulering"
          onClick={() =>
            setSimulation((s) => (s === "burglary" ? "fire" : "burglary"))
          }
          className="absolute top-3 right-3 z-10 flex size-9 items-center justify-center rounded-full bg-[var(--color-navy-card)]/90 backdrop-blur-md border border-white/10 text-base shadow-md transition-all active:scale-95 cursor-pointer"
        >
          {simulation === "burglary" ? "🚨" : "🔥"}
        </button>

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

          {/* Burglary simulation layer */}
          {simulation === "burglary" && (
            <>
              {/* Burglar alert marker — rendered before neighbour dots so
                  trusted neighbours visually sit on top. Three staggered
                  pulsing rings radiate outward, with a static red dot at the
                  center and an oversized invisible hit-target for easier
                  tapping. */}
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

              {/* Animated escape route — east along Storgata, then north along
                  the main vertical street. Native SVG <animate> avoids extra
                  CSS. */}
              <path
                d="M 115 380 L 195 380 L 195 80"
                fill="none"
                stroke="#FF4444"
                strokeWidth="2.5"
                strokeDasharray="8 5"
                opacity="0.85"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  from="0"
                  to="-26"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </path>

              {/* Camera observation points along the escape route */}
              {[
                { cx: 165, cy: 380 },
                { cx: 195, cy: 295 },
                { cx: 195, cy: 180 },
              ].map(({ cx, cy }) => (
                <motion.g
                  key={`cam-${cx}-${cy}`}
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  {/* Camera body */}
                  <rect
                    x={cx - 7}
                    y={cy - 5}
                    width="14"
                    height="10"
                    rx="2"
                    fill="white"
                    opacity="0.9"
                  />
                  {/* Lens */}
                  <circle cx={cx} cy={cy} r="3.5" fill="#182538" />
                  {/* Viewfinder bump */}
                  <rect
                    x={cx - 2}
                    y={cy - 8}
                    width="4"
                    height="3"
                    rx="1"
                    fill="white"
                    opacity="0.9"
                  />
                </motion.g>
              ))}

              <circle
                cx={BURGLAR_X}
                cy={BURGLAR_Y}
                r={22}
                fill="transparent"
                style={{ cursor: "pointer" }}
                onClick={openBurglar}
              />
            </>
          )}

          {/* Fire simulation layer */}
          {simulation === "fire" && (
            <>
              {/* Orange pulsing aura — three staggered rings */}
              {[0, 0.6, 1.2].map((delay) => (
                <motion.circle
                  key={`fire-ring-${delay}`}
                  cx={FIRE_X}
                  cy={FIRE_Y}
                  fill="none"
                  stroke="#FF7800"
                  strokeWidth={1.5}
                  initial={{ r: 8, opacity: 0.6 }}
                  animate={{ r: 20, opacity: 0 }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay,
                  }}
                />
              ))}

              {/* Static fire origin dot */}
              <circle cx={FIRE_X} cy={FIRE_Y} r={6} fill="#FF7800" />

              {/* Fire hit-target */}
              <circle
                cx={FIRE_X}
                cy={FIRE_Y}
                r={22}
                fill="transparent"
                style={{ cursor: "pointer" }}
                onClick={openFire}
              />
            </>
          )}

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
            <div className="mt-3">
              <ActionButton
                variant="secondary"
                onClick={() => {
                  setSelected(null);
                  router.push(`/chat/${selected.id}`);
                }}
              >
                ✉️ Send melding
              </ActionButton>
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

      <Dialog open={fireOpen} onOpenChange={setFireOpen}>
        <DialogContent className="bg-[var(--color-navy-card)] border border-white/10 text-white max-w-sm mx-4">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-white">
              🔥 Pågående brann – Parkveien 8
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-sm text-white/80 space-y-3">
            <p>Hund hjemme alene. Hvis trygt: prøv å slipp den ut og redd et liv.</p>
            <p>Ring 110 hvis ikke allerede varslet.</p>
            <p className="text-[var(--color-red-alert)] font-medium">
              ❗ Ikke gå inn i bygningen.
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
