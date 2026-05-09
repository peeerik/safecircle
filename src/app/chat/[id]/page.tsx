"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Send } from "lucide-react";
import { neighbors } from "@/components/safecircle/data/neighbors";
import { MobileShell } from "@/components/safecircle/shell/MobileShell";
import { type ChatMessage, getThread, sendMessage } from "@/lib/chat-store";

export default function ChatThreadPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const neighbor = neighbors.find((n) => n.id === id);
  // Lazy initializer reads localStorage exactly once on the client.
  // On the server, getThread returns just the seed (window guard inside store).
  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    id ? getThread(id) : [],
  );
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    const text = input.trim();
    if (!text || !id) return;
    const msg = sendMessage(id, text);
    setMessages((prev) => [...prev, msg]);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!neighbor) {
    return (
      <MobileShell showNav={false}>
        <div className="flex h-full items-center justify-center text-white/40 text-sm">
          Samtale ikke funnet
        </div>
      </MobileShell>
    );
  }

  return (
    <MobileShell showNav={false}>
      {/* Header */}
      <div
        className="sticky top-0 z-20 flex items-center gap-3 px-4 py-3 backdrop-blur-md"
        style={{ backgroundColor: "color-mix(in oklab, var(--color-navy-deep) 90%, transparent)", borderBottom: "1px solid var(--color-border)" }}
      >
        <button
          type="button"
          aria-label="Tilbake"
          onClick={() => router.back()}
          className="flex size-8 items-center justify-center rounded-full text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <div
          className="flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-[var(--color-navy-deep)]"
          style={{ backgroundColor: "var(--color-gold)" }}
          aria-hidden="true"
        >
          {neighbor.name[0]}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold leading-none text-white">{neighbor.name}</p>
          <p className="mt-0.5 text-xs text-white/40">{neighbor.address}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex flex-col gap-2 overflow-y-auto px-4 py-4" style={{ flex: 1 }}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[78%] rounded-2xl px-3 py-2 text-sm leading-snug ${
                msg.from === "me"
                  ? "rounded-br-sm text-[var(--color-navy-deep)]"
                  : "rounded-bl-sm text-white/90"
              }`}
              style={{
                backgroundColor:
                  msg.from === "me"
                    ? "var(--color-gold)"
                    : "var(--color-navy-card)",
              }}
            >
              <p>{msg.text}</p>
              <p
                className={`mt-1 text-[10px] ${
                  msg.from === "me" ? "text-[var(--color-navy-deep)]/60 text-right" : "text-white/30"
                }`}
              >
                {msg.time}
              </p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div
        className="sticky bottom-0 z-20 flex items-center gap-2 px-4 py-3"
        style={{ backgroundColor: "var(--color-navy-deep)", borderTop: "1px solid var(--color-border)" }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Skriv en melding…"
          className="flex-1 rounded-full bg-[var(--color-navy-card)] px-4 py-2 text-sm text-white placeholder:text-white/30 outline-none border border-white/8 focus:border-white/20 transition-colors"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={!input.trim()}
          aria-label="Send"
          className="flex size-9 shrink-0 items-center justify-center rounded-full transition-all active:scale-95 disabled:opacity-40"
          style={{ backgroundColor: "var(--color-gold)" }}
        >
          <Send className="h-4 w-4 text-[var(--color-navy-deep)]" />
        </button>
      </div>
    </MobileShell>
  );
}
