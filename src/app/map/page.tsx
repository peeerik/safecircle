"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Target } from "lucide-react";
import { ActionButton } from "@/components/safecircle/buttons/ActionButton";
import { neighbors } from "@/components/safecircle/data/neighbors";
import { FilterPills } from "@/components/safecircle/map/FilterPills";
import { MapCanvas } from "@/components/safecircle/map/MapCanvas";
import { NeighborDot } from "@/components/safecircle/map/NeighborDot";
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
type Simulation = "calm" | "burglary" | "fire";

function AlarmBanner({ simulation }: { simulation: "burglary" | "fire" }) {
  const isBurglary = simulation === "burglary";
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: [0.85, 1, 0.85], y: 0 }}
      transition={{
        y: { duration: 0.3, ease: "easeOut" },
        opacity: { duration: 2, repeat: Infinity, ease: "easeInOut", repeatType: "mirror" },
      }}
      className={`mx-5 mb-3 rounded-xl px-4 py-2.5 flex items-center gap-2 text-sm font-semibold text-white ${
        isBurglary
          ? "bg-[var(--color-red-dark)]"
          : "bg-[#C05200]"
      }`}
    >
      <span className="text-base">{isBurglary ? "🚨" : "🔥"}</span>
      <span>
        Aktiv alarm – {isBurglary ? "Innbrudd, Storgata 1" : "Brann, Parkveien 8"}
      </span>
    </motion.div>
  );
}

const BURGLAR_X = 115;
const BURGLAR_Y = 380;
const FIRE_X = 80;
const FIRE_Y = 160; // Anne Lise H.'s position on Parkveien

// Notification radius options (metres).
const RADIUS_OPTIONS = [500, 750, 1000, 1500] as const;
type RadiusM = (typeof RADIUS_OPTIONS)[number];
const RADIUS_STORAGE_KEY = "safecircle:notifyRadius";
// SVG units per metre — calibrated so 500m = 140 units (matches existing
// RadiusOverlay sizing in this codebase).
const SVG_PER_M = 140 / 500;

// Pinch-zoom limits relative to default zoom (1x).
const ZOOM_MIN = 0.5;
const ZOOM_MAX = 3;

export default function MapPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("alle");
  const [selected, setSelected] = useState<(typeof neighbors)[0] | null>(null);
  const [burglarOpen, setBurglarOpen] = useState<boolean>(false);
  const [fireOpen, setFireOpen] = useState<boolean>(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [simulation, setSimulation] = useState<Simulation>("calm");
  // SVG viewBox panning state. Panning shifts the viewBox origin so that
  // every element inside the SVG (dots, overlays, alarms) moves together
  // without needing a CSS transform on the wrapper.
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const dragRef = useRef<{
    startX: number;
    startY: number;
    panX: number;
    panY: number;
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  // Pinch-zoom state — applied by scaling the SVG viewBox dimensions.
  const [zoom, setZoom] = useState(1);
  const pinchRef = useRef<{ startDist: number; startZoom: number } | null>(
    null,
  );

  // Notification radius (persisted to localStorage).
  const [radius, setRadius] = useState<RadiusM>(500);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(RADIUS_STORAGE_KEY);
    const parsed = Number(stored);
    if (stored && (RADIUS_OPTIONS as readonly number[]).includes(parsed)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRadius(parsed as RadiusM);
    }
  }, []);
  const updateRadius = (next: RadiusM) => {
    setRadius(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(RADIUS_STORAGE_KEY, String(next));
    }
  };

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
          <Target className="size-3" /> {radius}m
        </span>
      </div>

      {/* Filter */}
      <div className="px-5 pb-3">
        <FilterPills value={filter} onChange={setFilter} />
      </div>

      {simulation !== "calm" && (
        <AlarmBanner simulation={simulation} />
      )}

      {/* Full map — takes remaining space */}
      <div
        className="flex-1 relative"
        style={{
          cursor: isDragging ? "grabbing" : "grab",
          touchAction: "none",
        }}
        onPointerDown={(e) => {
          // Don't initiate panning when the user is interacting with
          // overlay UI (simulation switcher, detail card buttons). Those
          // sit on top of the wrapper with their own pointer handlers.
          e.currentTarget.setPointerCapture(e.pointerId);
          dragRef.current = {
            startX: e.clientX,
            startY: e.clientY,
            panX: pan.x,
            panY: pan.y,
          };
        }}
        onPointerMove={(e) => {
          if (!dragRef.current) return;
          const dx = e.clientX - dragRef.current.startX;
          const dy = e.clientY - dragRef.current.startY;
          // Promote to dragging state after a small threshold so a quick
          // tap still feels like a tap (cursor doesn't flicker).
          if (!isDragging && Math.abs(dx) + Math.abs(dy) > 3) {
            setIsDragging(true);
          }
          // Convert pixel deltas to SVG user-space units using the actual
          // rendered size of the container.
          const rect = e.currentTarget.getBoundingClientRect();
          const scaleX = 390 / (rect.width || 390);
          const scaleY = 600 / (rect.height || 600);
          const newX = Math.max(
            -200,
            Math.min(200, dragRef.current.panX - dx * scaleX),
          );
          const newY = Math.max(
            -200,
            Math.min(180, dragRef.current.panY - dy * scaleY),
          );
          setPan({ x: newX, y: newY });
        }}
        onPointerUp={() => {
          dragRef.current = null;
          setIsDragging(false);
        }}
        onPointerCancel={() => {
          dragRef.current = null;
          setIsDragging(false);
        }}
        onTouchStart={(e) => {
          if (e.touches.length >= 2) {
            const a = e.touches.item(0);
            const b = e.touches.item(1);
            if (a && b) {
              pinchRef.current = {
                startDist: Math.hypot(
                  b.clientX - a.clientX,
                  b.clientY - a.clientY,
                ),
                startZoom: zoom,
              };
              // Cancel any in-progress single-finger pan
              dragRef.current = null;
              setIsDragging(false);
            }
          }
        }}
        onTouchMove={(e) => {
          if (pinchRef.current && e.touches.length >= 2) {
            const a = e.touches.item(0);
            const b = e.touches.item(1);
            if (a && b && pinchRef.current.startDist > 0) {
              const dist = Math.hypot(
                b.clientX - a.clientX,
                b.clientY - a.clientY,
              );
              const next = Math.min(
                ZOOM_MAX,
                Math.max(
                  ZOOM_MIN,
                  pinchRef.current.startZoom *
                    (dist / pinchRef.current.startDist),
                ),
              );
              setZoom(next);
            }
          }
        }}
        onTouchEnd={(e) => {
          if (e.touches.length < 2) {
            pinchRef.current = null;
          }
        }}
      >
        {/* Simulation switcher — toggles between burglary and fire scenarios */}
        <button
          type="button"
          aria-label="Bytt simulering"
          onClick={() =>
            setSimulation((s) =>
              s === "calm" ? "burglary" : s === "burglary" ? "fire" : "calm",
            )
          }
          className="absolute top-3 right-3 z-10 flex size-9 items-center justify-center rounded-full bg-[var(--color-navy-card)]/90 backdrop-blur-md border border-white/10 text-base shadow-md transition-all active:scale-95 cursor-pointer"
        >
          {simulation === "calm" ? "✅" : simulation === "burglary" ? "🚨" : "🔥"}
        </button>

        {/* Radius selector — chip control, bottom-left. Stops touch/pointer
            propagation so picking a chip doesn't trigger a pan or pinch. */}
        <div
          className="absolute bottom-3 left-3 z-10 flex items-center gap-1 rounded-full bg-[var(--color-navy-card)]/90 backdrop-blur-md border border-white/10 p-1 shadow-md"
          onPointerDown={(e) => e.stopPropagation()}
          onPointerMove={(e) => e.stopPropagation()}
          onPointerUp={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          onTouchEnd={(e) => e.stopPropagation()}
        >
          {RADIUS_OPTIONS.map((opt) => {
            const active = opt === radius;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => updateRadius(opt)}
                aria-pressed={active}
                className={`px-2.5 py-1 text-xs font-medium rounded-full transition-colors cursor-pointer ${
                  active
                    ? "bg-[var(--color-gold)] text-[var(--color-navy-deep)]"
                    : "text-white/70 hover:text-white"
                }`}
              >
                {opt < 1000 ? `${opt}m` : `${opt / 1000}km`}
              </button>
            );
          })}
        </div>

        <MapCanvas
          viewBox={`${pan.x} ${pan.y} ${390 / zoom} ${600 / zoom}`}
        >
          {/* Notification radius around user — yellow filled circle that
              animates smoothly when the user switches preset. */}
          <motion.circle
            cx={195}
            cy={300}
            fill="rgba(255, 200, 0, 0.15)"
            stroke="rgba(255, 200, 0, 0.5)"
            strokeWidth={2}
            initial={false}
            animate={{ r: radius * SVG_PER_M }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          />

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
                animate={{ r: 45, opacity: 0 }}
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
                animate={{ r: 45, opacity: 0 }}
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
                animate={{ r: 45, opacity: 0 }}
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
            </>
          )}

          {/* Fire simulation layer */}
          {simulation === "fire" && (
            <>
              {/* Soft outer glow — large, low-opacity pulse that radiates
                  from beneath the neighbour dot. */}
              <circle
                cx={FIRE_X}
                cy={FIRE_Y}
                r={18}
                fill="#FF7800"
                opacity={0.25}
              />
              <motion.circle
                cx={FIRE_X}
                cy={FIRE_Y}
                r={28}
                fill="#FF7800"
                animate={{ opacity: [0.15, 0.35, 0.15] }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

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
                  animate={{ r: 45, opacity: 0 }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay,
                  }}
                />
              ))}

              {/* Static fire origin dot — sits at Anne Lise H.'s position */}
              <circle cx={FIRE_X} cy={FIRE_Y} r={7} fill="#FF7800" />

              {/* Flame emoji sparks rising upward, staggered */}
              {[
                { dx: -6, delay: 0 },
                { dx: 0, delay: 0.45 },
                { dx: 6, delay: 0.9 },
              ].map(({ dx, delay }) => (
                <motion.text
                  key={`flame-${dx}`}
                  x={FIRE_X + dx}
                  fontSize="9"
                  textAnchor="middle"
                  initial={{ y: FIRE_Y - 10, opacity: 1 }}
                  animate={{ y: FIRE_Y - 30, opacity: 0 }}
                  transition={{
                    duration: 1.4,
                    repeat: Infinity,
                    ease: "easeOut",
                    delay,
                  }}
                >
                  🔥
                </motion.text>
              ))}

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

          {/* Camera icons on neighbours during burglary — tap for evidence tips */}
          {simulation === "burglary" &&
            visible.map((n) => (
              <text
                key={`cam-${n.id}`}
                x={n.x + 10}
                y={n.y - 8}
                fontSize="10"
                style={{ cursor: "pointer", userSelect: "none" }}
                onClick={(e) => {
                  e.stopPropagation();
                  setCameraOpen(true);
                }}
              >
                📷
              </text>
            ))}

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

      <Dialog open={cameraOpen} onOpenChange={setCameraOpen}>
        <DialogContent className="bg-[var(--color-navy-card)] border border-white/10 text-white max-w-sm mx-4">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-white">
              📷 Sikre bevis
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-sm text-white/80 leading-relaxed">
            Ta bilde/video, eller finn opptak fra overvåkningskameraer eller biler. Lagre dette, og kontakt politiet hvis du sitter på noe verdifullt.
          </DialogDescription>
          <DialogClose asChild>
            <ActionButton variant="secondary">OK</ActionButton>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </MobileShell>
  );
}
