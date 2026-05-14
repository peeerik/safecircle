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
  // New neighbors on extended streets
  { id: "magnus-h",    name: "Magnus H.",    address: "Fjellveien 3",   distance: "280m unna", badge: "betrodd", x: 195, y: -100 },
  { id: "kari-n",      name: "Kari N.",      address: "Lillegata 4",    distance: "310m unna", badge: "aktiv",   x: -80, y: 270  },
  { id: "ole-b",       name: "Ole B.",       address: "Lillegata 8",    distance: "340m unna", badge: "aktiv",   x: -80, y: 380  },
  { id: "mette-r",     name: "Mette R.",     address: "Storgata 35",    distance: "290m unna", badge: "betrodd", x: 420, y: 380  },
  { id: "lars-e",      name: "Lars E.",      address: "Havneveien 2",   distance: "380m unna", badge: "aktiv",   x: 195, y: 660  },
  { id: "hanne-s",     name: "Hanne S.",     address: "Åsveien 7",      distance: "350m unna", badge: "aktiv",   x: 470, y: 160  },
  { id: "petter-v",    name: "Petter V.",    address: "Åsveien 12",     distance: "400m unna", badge: "aktiv",   x: 470, y: 490  },
];
