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
