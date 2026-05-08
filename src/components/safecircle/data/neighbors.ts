import type { NeighborBadge } from "@/components/safecircle/cards/NeighborCard";

export type Neighbor = {
  id: string;
  name: string;
  address: string;
  distance: string;
  badge: NeighborBadge;
  x: number;
  y: number;
};

export const neighbors: Neighbor[] = [
  { id: "anne-lise-h",   name: "Anne Lise H.",       address: "Parkveien 8",  distance: "30m unna",  badge: "betrodd", x: 80,  y: 160 },
  { id: "kristoffer-m",  name: "Kristoffer M.",       address: "Parkveien 14", distance: "60m unna",  badge: "aktiv",   x: 195, y: 160 },
  { id: "sara-b",        name: "Sara B.",              address: "Storgata 22",  distance: "120m unna", badge: "betrodd", x: 250, y: 380 },
  { id: "thomas-k",      name: "Thomas K.",            address: "Storgata 18",  distance: "150m unna", badge: "betrodd", x: 310, y: 380 },
  { id: "ingrid-f",      name: "Ingrid F.",            address: "Brugata 5",    distance: "180m unna", badge: "aktiv",   x: 195, y: 490 },
  { id: "nabo-brugata",  name: "Nabo i Brugata 12",   address: "Brugata 12",   distance: "240m unna", badge: "aktiv",   x: 310, y: 490 },
];
