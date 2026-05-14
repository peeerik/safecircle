"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { MobileShell } from "@/components/safecircle/shell/MobileShell";

type NotifMode = "all" | "critical";

const STORAGE_KEY = "safecircle-notif-mode";

// Read the persisted preference lazily on first render. Guarded against
// non-browser environments (SSR) where `window` is undefined.
function readStoredMode(): NotifMode {
  if (typeof window === "undefined") return "all";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "all" || stored === "critical" ? stored : "all";
}

export default function NotificationsSettingsPage() {
  const router = useRouter();
  const [mode, setMode] = useState<NotifMode>(readStoredMode);

  const handleSelect = (value: NotifMode) => {
    setMode(value);
    localStorage.setItem(STORAGE_KEY, value);
  };

  const options: { value: NotifMode; label: string; description: string }[] = [
    {
      value: "all",
      label: "Alle varsler",
      description: "Mottar alle nabolagsvarsler fra naboer i ditt område.",
    },
    {
      value: "critical",
      label: "Kun bekreftede akuttsituasjoner",
      description:
        "Mottar kun verifiserte alarmer: innbrudd, brann og medisinsk nødhjelp.",
    },
  ];

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
        <h1 className="text-base font-bold text-white">Varsler</h1>
      </div>

      <div className="space-y-3 px-5 py-5">
        <p className="text-xs text-[var(--white-40)]">
          Velg hvilke varsler du ønsker å motta fra SafeCircle.
        </p>

        <div className="space-y-3">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleSelect(opt.value)}
              className="w-full rounded-2xl bg-[var(--color-navy-card)] p-4 text-left border transition-colors"
              style={{
                borderColor:
                  mode === opt.value
                    ? "var(--color-gold)"
                    : "var(--color-border)",
              }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors"
                  style={{
                    borderColor:
                      mode === opt.value
                        ? "var(--color-gold)"
                        : "rgba(255,255,255,0.3)",
                    backgroundColor:
                      mode === opt.value ? "var(--color-gold)" : "transparent",
                  }}
                >
                  {mode === opt.value && (
                    <div className="size-2 rounded-full bg-[var(--color-navy-deep)]" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    {opt.label}
                  </p>
                  <p className="mt-0.5 text-xs text-[var(--white-80)]">
                    {opt.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </MobileShell>
  );
}
