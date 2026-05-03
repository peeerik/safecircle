"use client";

import { useState } from "react";
import { Target } from "lucide-react";
import { neighbors } from "@/components/safecircle/data/neighbors";
import { FilterPills } from "@/components/safecircle/map/FilterPills";
import { MapCanvas } from "@/components/safecircle/map/MapCanvas";
import { NeighborDot } from "@/components/safecircle/map/NeighborDot";
import { RadiusOverlay } from "@/components/safecircle/map/RadiusOverlay";
import { MobileShell } from "@/components/safecircle/shell/MobileShell";

type Filter = "alle" | "betrodde" | "online";

export default function MapPage() {
  const [filter, setFilter] = useState<Filter>("alle");
  const [selected, setSelected] = useState<(typeof neighbors)[0] | null>(null);

  // "betrodde" filters down to trusted neighbours only. "alle" and "online"
  // both show the full set in this demo (no online-state in mock data yet).
  const visible =
    filter === "betrodde"
      ? neighbors.filter((n) => n.badge === "betrodd")
      : neighbors;

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
    </MobileShell>
  );
}
