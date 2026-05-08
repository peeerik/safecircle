"use client";

import { motion } from "framer-motion";
import { MapPin, Users } from "lucide-react";
import { AwayModeToggle } from "@/components/safecircle/buttons/AwayModeToggle";
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

export default function Home() {
  // Spec: render only the first 5 named neighbours on the home list. The data
  // file already orders them — Anne Lise H., Kristoffer M., Sara B., Thomas K.,
  // Ingrid F. — so a simple slice is enough.
  const featuredNeighbors = neighbors.slice(0, 5);

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
              {/* Plot 14 neighbours — scaled into the cropped viewBox. */}
              {neighbors.map((n, i) => (
                <NeighborDot
                  key={n.id}
                  x={n.x}
                  y={n.y * Y_SCALE}
                  delay={i * 0.12}
                  size={5}
                />
              ))}

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

        {/* Borte-modus card */}
        <section className="rounded-2xl bg-[var(--color-navy-card)] p-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl" aria-hidden="true">
              🏖
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white">
                {copy.home.awayMode}
              </p>
              <p className="text-xs text-[var(--white-80)]">
                {copy.home.awayModeDescription}
              </p>
            </div>
            <AwayModeToggle />
          </div>
        </section>

        {/* Neighbours list */}
        <section className="space-y-3">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
            <MapPin
              className="h-4 w-4 text-[var(--color-gold)]"
              aria-hidden="true"
            />
            {copy.home.neighborsHeading}
          </h2>

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
        </section>
      </div>
    </MobileShell>
  );
}
