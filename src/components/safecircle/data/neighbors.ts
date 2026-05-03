import type { NeighborBadge } from "@/components/safecircle/cards/NeighborCard";

export type Neighbor = {
  id: string;
  name: string;
  address: string;
  distance: string;
  badge: NeighborBadge;
  /** SVG x coordinate inside the 0..390 MapCanvas viewBox. */
  x: number;
  /** SVG y coordinate inside the 0..700 MapCanvas viewBox. */
  y: number;
};

/**
 * 14 SafeCircle neighbours rendered as dots on the map and as cards on the
 * home screen. The 5 named neighbours match the spec; the remaining 9 are
 * anonymised "Nabo i …" entries to give the map density without inventing
 * personal data.
 */
export const neighbors: Neighbor[] = [
  {
    id: "anne-lise-h",
    name: "Anne Lise H.",
    address: "Parkveien 8",
    distance: "30m unna",
    badge: "betrodd",
    x: 130,
    y: 200,
  },
  {
    id: "kristoffer-m",
    name: "Kristoffer M.",
    address: "Parkveien 14",
    distance: "60m unna",
    badge: "aktiv",
    x: 195,
    y: 230,
  },
  {
    id: "sara-b",
    name: "Sara B.",
    address: "Storgata 22",
    distance: "120m unna",
    badge: "betrodd",
    x: 250,
    y: 320,
  },
  {
    id: "thomas-k",
    name: "Thomas K.",
    address: "Storgata 18",
    distance: "150m unna",
    badge: "betrodd",
    x: 215,
    y: 360,
  },
  {
    id: "ingrid-f",
    name: "Ingrid F.",
    address: "Brugata 5",
    distance: "180m unna",
    badge: "aktiv",
    x: 290,
    y: 470,
  },
  {
    id: "nabo-storgata-8",
    name: "Nabo i Storgata 8",
    address: "Storgata 8",
    distance: "210m unna",
    badge: "aktiv",
    x: 95,
    y: 360,
  },
  {
    id: "nabo-brugata-3",
    name: "Nabo i Brugata 3",
    address: "Brugata 3",
    distance: "260m unna",
    badge: "aktiv",
    x: 320,
    y: 510,
  },
  {
    id: "nabo-toyengata-12",
    name: "Nabo i Tøyengata 12",
    address: "Tøyengata 12",
    distance: "320m unna",
    badge: "aktiv",
    x: 60,
    y: 480,
  },
  {
    id: "nabo-parkveien-2",
    name: "Nabo i Parkveien 2",
    address: "Parkveien 2",
    distance: "55m unna",
    badge: "aktiv",
    x: 80,
    y: 145,
  },
  {
    id: "nabo-parkveien-20",
    name: "Nabo i Parkveien 20",
    address: "Parkveien 20",
    distance: "95m unna",
    badge: "aktiv",
    x: 280,
    y: 165,
  },
  {
    id: "nabo-storgata-30",
    name: "Nabo i Storgata 30",
    address: "Storgata 30",
    distance: "170m unna",
    badge: "aktiv",
    x: 340,
    y: 345,
  },
  {
    id: "nabo-brugata-12",
    name: "Nabo i Brugata 12",
    address: "Brugata 12",
    distance: "240m unna",
    badge: "aktiv",
    x: 175,
    y: 555,
  },
  {
    id: "nabo-elvegata-7",
    name: "Nabo i Elvegata 7",
    address: "Elvegata 7",
    distance: "290m unna",
    badge: "aktiv",
    x: 110,
    y: 600,
  },
  {
    id: "nabo-fjellgata-4",
    name: "Nabo i Fjellgata 4",
    address: "Fjellgata 4",
    distance: "340m unna",
    badge: "aktiv",
    x: 360,
    y: 600,
  },
];
