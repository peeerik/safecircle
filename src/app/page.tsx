"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, MapPin, Users } from "lucide-react";
import { NeighborCard } from "@/components/safecircle/cards/NeighborCard";
import { neighbors } from "@/components/safecircle/data/neighbors";
import {
  StaggerList,
  staggerItemVariants,
} from "@/components/safecircle/effects/StaggerList";
import { MapCanvas } from "@/components/safecircle/map/MapCanvas";
import { NeighborDot } from "@/components/safecircle/map/NeighborDot";
import { MobileShell } from "@/components/safecircle/shell/MobileShell";
import { copy } from "@/lib/copy";

// Neighbor coords live in a 0..390 x 0..700 coordinate space (full map). The
// home preview crops to a 280-tall viewBox so we squash the y axis to keep
// every dot visible in the smaller card.
const MAP_PREVIEW_HEIGHT = 280;
const FULL_MAP_HEIGHT = 600;
const Y_SCALE = MAP_PREVIEW_HEIGHT / FULL_MAP_HEIGHT;

const YOU_X = 195;
const YOU_Y = 120;

/**
 * Small house glyph rendered just below each neighbour dot. Kept tiny
 * (≈5 SVG units tall) so it supplements the dot rather than dominating
 * the preview.
 */
function MapHouse({
  x,
  y,
  color = "rgba(255, 200, 0, 0.75)",
}: {
  x: number;
  y: number;
  color?: string;
}) {
  return (
    <g transform={`translate(${x}, ${y})`} aria-hidden="true">
      {/* Pitched roof + body in a single shape */}
      <path
        d="M -2.5 -1 L 0 -3 L 2.5 -1 L 2.5 2 L -2.5 2 Z"
        fill={color}
        stroke="rgba(0, 0, 0, 0.25)"
        strokeWidth="0.3"
      />
    </g>
  );
}

const NEWS_ITEMS = [
  { id: "politiet", tag: "🚔", title: "Mistenkelige forhold ved Universitetet i Innlandet", timestamp: "2t siden" },
  { id: "asted", tag: "📺", title: "Etterlysning – grovt tyveri hos Thune Gullsmed, Jessheim", timestamp: "1d siden" },
];

export default function Home() {
  // Spec: render only the first 5 named neighbours on the home list. The data
  // file already orders them — Anne Lise H., Kristoffer M., Sara B., Thomas K.,
  // Ingrid F. — so a simple slice is enough.
  const featuredNeighbors = neighbors.slice(0, 5);
  const [neighborsOpen, setNeighborsOpen] = useState(false);

  return (
    <MobileShell>
      <div className="flex flex-col space-y-4 px-5 py-6">
        {/* Title section */}
        <header className="space-y-1">
          <h1 className="text-2xl font-bold text-white">{copy.home.title}</h1>
          <p className="text-sm text-[var(--white-80)]">
            {copy.brand.tagline}
          </p>
        </header>

        {/* Mini map card */}
        <section className="overflow-hidden rounded-2xl bg-[var(--color-navy-card)]">
          <div className="relative aspect-[390/280] w-full">
            <MapCanvas viewBox="0 0 390 280" className="absolute inset-0">
              {/* Plot 14 neighbours — scaled into the cropped viewBox.
                  Each gold dot gets a small house glyph just below it so
                  the preview reads as "houses along the streets" rather
                  than abstract dots in empty space. */}
              {neighbors.map((n, i) => {
                const y = n.y * Y_SCALE;
                return (
                  <g key={n.id}>
                    <NeighborDot
                      x={n.x}
                      y={y}
                      delay={i * 0.12}
                      size={5}
                    />
                    <MapHouse x={n.x} y={y + 9} />
                  </g>
                );
              })}

              {/* "You" dot — green, centred, slightly larger than neighbours. */}
              <NeighborDot
                x={YOU_X}
                y={YOU_Y}
                color="var(--color-green-safe)"
                size={7}
              />
            </MapCanvas>
          </div>

          <div className="flex items-center gap-2 px-4 py-3">
            <span
              className="inline-block h-2 w-2 rounded-full bg-[var(--color-gold)]"
              aria-hidden="true"
            />
            <p className="text-xs text-[var(--white-80)]">
              <Users
                className="mr-1 inline h-3 w-3 align-[-2px] text-[var(--white-80)]"
                aria-hidden="true"
              />
              {copy.home.subtitle}
            </p>
          </div>
        </section>

        {/* Nyhetssenter */}
        <section className="rounded-2xl bg-[var(--color-navy-card)] overflow-hidden">
          <div className="flex items-center justify-between px-4 pt-4 pb-2">
            <h2 className="text-sm font-semibold text-white">Nyhetssenter</h2>
            <Link href="/news" className="text-xs text-[var(--color-gold)]">Se alle</Link>
          </div>
          <ul className="divide-y divide-white/5">
            {NEWS_ITEMS.map((item) => (
              <li key={item.id}>
                <Link href="/news" className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors">
                  <span className="text-sm">{item.tag}</span>
                  <span className="flex-1 text-sm text-white truncate">{item.title}</span>
                  <span className="text-xs text-[var(--white-40)] shrink-0">{item.timestamp}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Neighbours list */}
        <section className="space-y-3">
          <button
            type="button"
            onClick={() => setNeighborsOpen((o) => !o)}
            className="flex w-full items-center justify-between"
          >
            <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
              <MapPin
                className="h-4 w-4 text-[var(--color-gold)]"
                aria-hidden="true"
              />
              {copy.home.neighborsHeading}
              <span className="text-sm font-normal text-[var(--white-40)]">
                ({featuredNeighbors.length})
              </span>
            </h2>
            <ChevronDown
              className={`h-4 w-4 text-[var(--white-40)] transition-transform duration-300 ${
                neighborsOpen ? "rotate-180" : ""
              }`}
              aria-hidden="true"
            />
          </button>

          <AnimatePresence initial={false}>
            {neighborsOpen && (
              <motion.div
                key="neighbors"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                style={{ overflow: "hidden" }}
              >
                <StaggerList className="space-y-2">
                  {featuredNeighbors.map((n) => (
                    <motion.div key={n.id} variants={staggerItemVariants}>
                      <NeighborCard
                        name={n.name}
                        address={n.address}
                        distance={n.distance}
                        badge={n.badge}
                      />
                    </motion.div>
                  ))}
                </StaggerList>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
    </MobileShell>
  );
}
