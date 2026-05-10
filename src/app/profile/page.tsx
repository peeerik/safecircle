"use client";

import Link from "next/link";
import { Bell, ChevronRight, LogOut, PawPrint, Shield } from "lucide-react";
import { AwayModeToggle } from "@/components/safecircle/buttons/AwayModeToggle";
import { MobileShell } from "@/components/safecircle/shell/MobileShell";

/**
 * Profile screen. Shows the active user, an entry point to the pets section
 * (Dyr) and a dummy settings list. Pets is reachable from here now that the
 * bottom nav no longer links to /pets directly.
 */
export default function ProfilePage() {
  return (
    <MobileShell>
      <div className="space-y-5 px-5 py-6">
        <h1 className="text-2xl font-bold text-white">Profil</h1>

        {/* User card */}
        <section
          className="rounded-2xl bg-[var(--color-navy-card)] p-4"
          style={{ border: "1px solid var(--color-border)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex size-12 items-center justify-center rounded-full text-lg font-bold text-[var(--color-navy-deep)]"
              style={{ backgroundColor: "var(--color-gold)" }}
              aria-hidden="true"
            >
              P
            </div>
            <div className="flex-1">
              <p className="text-base font-semibold leading-none text-white">
                Perer
              </p>
              <p className="mt-1 text-sm text-[var(--white-80)]">
                Aktiv i SafeCircle
              </p>
            </div>
            <span
              className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
              style={{
                backgroundColor:
                  "color-mix(in oklab, var(--color-gold) 18%, transparent)",
                color: "var(--color-gold)",
                border:
                  "1px solid color-mix(in oklab, var(--color-gold) 40%, transparent)",
              }}
            >
              Betrodd
            </span>
          </div>
        </section>

        {/* Bortemodus */}
        <section
          className="rounded-2xl bg-[var(--color-navy-card)] p-4"
          style={{ border: "1px solid var(--color-border)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex size-10 items-center justify-center rounded-xl"
              style={{
                backgroundColor:
                  "color-mix(in oklab, var(--color-gold) 15%, transparent)",
              }}
              aria-hidden="true"
            >
              <span className="text-xl">🏖</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold leading-none text-white">
                Bortemodus
              </p>
              <p className="mt-1 text-xs text-[var(--white-80)]">
                Naboer ser at du er borte
              </p>
            </div>
            <AwayModeToggle />
          </div>
        </section>

        {/* Dyr (Pets) section */}
        <section
          className="overflow-hidden rounded-2xl bg-[var(--color-navy-card)]"
          style={{ border: "1px solid var(--color-border)" }}
        >
          <Link
            href="/pets"
            className="flex items-center gap-3 p-4 transition-colors hover:bg-white/5"
          >
            <div
              className="flex size-10 items-center justify-center rounded-xl"
              style={{
                backgroundColor:
                  "color-mix(in oklab, var(--color-gold) 15%, transparent)",
              }}
              aria-hidden="true"
            >
              <PawPrint
                className="h-5 w-5"
                style={{ color: "var(--color-gold)" }}
              />
            </div>
            <div className="flex-1">
              <p className="text-base font-semibold leading-none text-white">
                Mine kjæledyr
              </p>
              <p className="mt-1 text-sm text-[var(--white-80)]">
                Dino · Chihuahua
              </p>
            </div>
            <ChevronRight
              className="h-5 w-5 text-[var(--white-40)]"
              aria-hidden="true"
            />
          </Link>
        </section>

        {/* Innstillinger (dummy) */}
        <section
          className="rounded-2xl bg-[var(--color-navy-card)] p-4"
          style={{ border: "1px solid var(--color-border)" }}
        >
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--white-60)]">
            Innstillinger
          </h2>
          <ul className="mt-2">
            {[
              { icon: Bell, label: "Varsler" },
              { icon: Shield, label: "Personvern" },
              { icon: LogOut, label: "Logg ut" },
            ].map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="flex items-center justify-between border-b border-white/5 py-3 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className="h-5 w-5 text-[var(--white-80)]"
                    aria-hidden="true"
                  />
                  <span className="text-sm font-medium text-white">
                    {label}
                  </span>
                </div>
                <ChevronRight
                  className="h-5 w-5 text-[var(--white-40)]"
                  aria-hidden="true"
                />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </MobileShell>
  );
}
