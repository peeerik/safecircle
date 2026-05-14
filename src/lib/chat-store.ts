/**
 * Minimal localStorage-backed chat store for the SafeCircle demo.
 * Seed messages give each thread life without a backend.
 */

export type ChatMessage = {
  id: string;
  from: "me" | "neighbor";
  text: string;
  time: string; // display string, e.g. "14:32"
};

/** Pre-seeded messages that always appear first in each thread. */
const SEED: Record<string, ChatMessage[]> = {
  "anne-lise-h": [
    { id: "s1", from: "neighbor", text: "Hei! Har du sett bilen som parkerer foran garasjen min igjen?", time: "14:12" },
  ],
  "kristoffer-m": [
    { id: "s1", from: "neighbor", text: "God morgen! Jeg er hjemme hele dagen om noe skjer 👍", time: "08:45" },
    { id: "s2", from: "neighbor", text: "Husk nabolagsmøtet på fredag!", time: "08:47" },
  ],
  "sara-b": [
    { id: "s1", from: "neighbor", text: "Pakken din ble levert til meg. Kom og hent når du vil 📦", time: "11:30" },
  ],
  "thomas-k": [
    { id: "s1", from: "neighbor", text: "Holder øye med gata nå. Alt ser greit ut 👀", time: "13:20" },
  ],
  "ingrid-f": [
    { id: "s1", from: "neighbor", text: "Er det greit at jeg lar hunden løpe i hagen din et par timer?", time: "13:55" },
  ],
  "nabo-brugata": [
    { id: "s1", from: "neighbor", text: "Hei nabo! 👋 Ny her i gata.", time: "10:20" },
  ],
  "magnus-h": [
    { id: "s1", from: "neighbor", text: "Hei! Bare for å si ifra – det var en fremmed bil parkert utenfor huset mitt i natt.", time: "07:15" },
  ],
  "kari-n": [
    { id: "s1", from: "neighbor", text: "God dag! Bare å si ifra hvis du trenger hjelp med noe 😊", time: "12:00" },
    { id: "s2", from: "neighbor", text: "Jeg passer på katten min hjemme hele dagen.", time: "12:02" },
  ],
  "ole-b": [
    { id: "s1", from: "neighbor", text: "Har du sett naboavisen? Det er møte om fartsdumper på Lillegata neste uke.", time: "09:30" },
  ],
  "mette-r": [
    { id: "s1", from: "neighbor", text: "Hei! Jeg er ny i gata. Hyggelig å bli med i SafeCircle 👋", time: "16:45" },
    { id: "s2", from: "neighbor", text: "Har dere noen anbefaling på god pizzarestaurant i nærheten?", time: "16:47" },
  ],
  "lars-e": [
    { id: "s1", from: "neighbor", text: "Sjekk ut utsikten her nede! Havna er vakker om morgenen 🌅", time: "06:55" },
  ],
  "hanne-s": [
    { id: "s1", from: "neighbor", text: "Hei fra Åsveien! Holder øye med innkjørselen vår.", time: "15:10" },
  ],
  "petter-v": [
    { id: "s1", from: "neighbor", text: "Hei! Er det noen som vet når søppelbilen kommer denne uken?", time: "08:20" },
    { id: "s2", from: "neighbor", text: "Søppelbilen kom forresten – bare for å si ifra 🗑️", time: "10:05" },
  ],
};

const STORAGE_KEY = "safecircle-chats-v1";

function loadStored(): Record<string, ChatMessage[]> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, ChatMessage[]>) : {};
  } catch {
    return {};
  }
}

function saveStored(data: Record<string, ChatMessage[]>): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore quota errors
  }
}

/** Returns seed + any user-sent messages for a given neighbor. */
export function getThread(neighborId: string): ChatMessage[] {
  const seed = SEED[neighborId] ?? [];
  const stored = loadStored();
  const extra = stored[neighborId] ?? [];
  return [...seed, ...extra];
}

/** Appends a sent message, persists to localStorage, and returns the new message. */
export function sendMessage(neighborId: string, text: string): ChatMessage {
  const msg: ChatMessage = {
    id: `m-${Date.now()}`,
    from: "me",
    text,
    time: new Date().toLocaleTimeString("nb-NO", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
  const stored = loadStored();
  stored[neighborId] = [...(stored[neighborId] ?? []), msg];
  saveStored(stored);
  return msg;
}

/** Returns the last message in a thread (for the chat list preview). */
export function getLastMessage(neighborId: string): ChatMessage | null {
  const msgs = getThread(neighborId);
  return msgs.length > 0 ? msgs[msgs.length - 1] ?? null : null;
}
