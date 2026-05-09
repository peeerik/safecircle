"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { neighbors } from "@/components/safecircle/data/neighbors";
import { MobileShell } from "@/components/safecircle/shell/MobileShell";
import { type ChatMessage, getLastMessage } from "@/lib/chat-store";

// Empty subscriber — we never push updates; we just want a server/client split
// for the snapshot so the component re-renders once on hydration.
const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export default function ChatListPage() {
  // True only on the client after hydration. Avoids SSR localStorage access
  // without using setState-in-effect (which the lint config disallows).
  const mounted = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );

  // Compute previews from the store on each render once mounted.
  // localStorage reads are cheap and this avoids setState-in-effect cascades.
  const lastMsgs: Record<string, ChatMessage | null> = {};
  if (mounted) {
    for (const n of neighbors) {
      lastMsgs[n.id] = getLastMessage(n.id);
    }
  }

  return (
    <MobileShell>
      <div className="px-5 py-6 space-y-4">
        <h1 className="text-2xl font-bold text-white">Meldinger</h1>

        <ul className="space-y-1">
          {neighbors.map((n) => {
            const last = lastMsgs[n.id];
            const isUnread = last?.from === "neighbor";

            return (
              <li key={n.id}>
                <Link
                  href={`/chat/${n.id}`}
                  className="flex items-center gap-3 rounded-2xl bg-[var(--color-navy-card)] px-4 py-3 transition-colors hover:bg-[var(--color-navy-light)]"
                >
                  {/* Avatar */}
                  <div
                    className="flex size-11 shrink-0 items-center justify-center rounded-full text-base font-bold text-[var(--color-navy-deep)]"
                    style={{ backgroundColor: "var(--color-gold)" }}
                    aria-hidden="true"
                  >
                    {n.name[0]}
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-semibold text-white">
                        {n.name}
                      </p>
                      <span className="shrink-0 text-[10px] text-white/40">
                        {last?.time ?? ""}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2 mt-0.5">
                      <p className="truncate text-xs text-white/50">
                        {last
                          ? (last.from === "me" ? "Du: " : "") + last.text
                          : "Ingen meldinger ennå"}
                      </p>
                      {isUnread && (
                        <span
                          className="size-2 shrink-0 rounded-full"
                          style={{ backgroundColor: "var(--color-gold)" }}
                          aria-label="Ulest melding"
                        />
                      )}
                    </div>
                  </div>

                  <ChevronRight className="h-4 w-4 shrink-0 text-white/20" aria-hidden="true" />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </MobileShell>
  );
}
