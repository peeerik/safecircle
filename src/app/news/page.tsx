"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { MobileShell } from "@/components/safecircle/shell/MobileShell";

type NewsItem = {
  id: string;
  tag: string;
  tagLabel: string;
  title: string;
  summary: string;
  fullText: string;
  timestamp: string;
  hasImage?: boolean;
};

const NEWS: NewsItem[] = [
  {
    id: "politiet",
    tag: "🚔",
    tagLabel: "Politiet",
    title: "Mistenkelige forhold ved Universitetet i Innlandet",
    summary: "Politiet ber folk i området sjekke etter mistenkelige forhold mellom 22:30–23:15. Innbrudd hos lokal gullsmed.",
    fullText: "Politiet i Innlandet ber om hjelp fra publikum. Mellom klokken 22:30 og 23:15 natt til lørdag ble det begått innbrudd hos en lokal gullsmed. Politiet ber folk som var i området om å sjekke om de har observert mistenkelige personer eller kjøretøyer, og ta kontakt på telefon 02800.",
    timestamp: "2 timer siden",
  },
  {
    id: "asted",
    tag: "📺",
    tagLabel: "Åsted Norge",
    title: "Etterlysning – grovt tyveri hos Thune Gullsmed, Jessheim",
    summary: "To menn mistenkt for tyveri av smykker til 450 000 kr. Kjenner du dem igjen?",
    fullText: "Disse to mennene er mistenkt for et tyveri i Thune Gullsmed på Jessheim Storsenter på lørdag. Mens den ene mannen distraherer betjeningen, forsyner den andre seg med smykker til en verdi på 450 000 kr.\n\nHar du tips om hvem dette kan være?\nKontakt Åsted Norge: 22 38 98 98 / astednorge@tv2.no",
    timestamp: "1 dag siden",
    hasImage: true,
  },
];

export default function NewsPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<NewsItem | null>(null);

  return (
    <MobileShell showNav={false}>
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center gap-3 bg-[var(--color-navy-deep)]/95 backdrop-blur-md px-4 py-3 border-b border-white/5">
        <button
          onClick={() => router.back()}
          className="flex size-8 items-center justify-center rounded-full bg-white/10 text-white"
          aria-label="Tilbake"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <h1 className="text-base font-bold text-white">Nyhetssenter</h1>
      </div>

      {/* News cards */}
      <div className="space-y-4 px-5 py-5">
        {NEWS.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl bg-[var(--color-navy-card)] overflow-hidden border border-white/5 cursor-pointer hover:border-white/10 transition-colors"
            onClick={() => setSelected(item)}
          >
            {/* Åsted Norge etterlysning-bilde */}
            {item.hasImage && (
              <div className="w-full border-b border-white/5 overflow-hidden">
                <Image
                  src="/news/etterlysning.jpg"
                  alt="Etterlysning – to menn mistenkt for tyveri hos Thune Gullsmed"
                  width={390}
                  height={200}
                  className="w-full object-cover"
                  style={{ maxHeight: "200px" }}
                />
              </div>
            )}
            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[var(--color-gold)]">{item.tag} {item.tagLabel}</span>
                <span className="text-xs text-[var(--white-40)]">{item.timestamp}</span>
              </div>
              <h3 className="text-sm font-semibold text-white leading-snug">{item.title}</h3>
              <p className="text-xs text-[var(--white-80)] leading-relaxed">{item.summary}</p>
              <button className="text-xs font-semibold text-[var(--color-gold)] mt-1">Les mer →</button>
            </div>
          </div>
        ))}
      </div>

      {/* Full-text modal */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
            />
            <motion.div
              className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl bg-[var(--color-navy-card)] p-5 max-h-[80vh] overflow-y-auto"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <span className="text-xs font-semibold text-[var(--color-gold)]">{selected.tag} {selected.tagLabel}</span>
                  <h2 className="mt-1 text-base font-bold text-white leading-snug">{selected.title}</h2>
                  <p className="mt-0.5 text-xs text-[var(--white-40)]">{selected.timestamp}</p>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="mt-1 shrink-0 text-[var(--white-40)] hover:text-white"
                  aria-label="Lukk"
                >✕</button>
              </div>
              <p className="text-sm text-[var(--white-80)] leading-relaxed whitespace-pre-line">{selected.fullText}</p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </MobileShell>
  );
}
