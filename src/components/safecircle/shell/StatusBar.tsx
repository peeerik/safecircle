import { BatteryFull, SignalHigh, Wifi } from "lucide-react";
import { copy } from "@/lib/copy";

/**
 * iOS-style status bar — sticky to the top of the mobile shell.
 * Tabular numerals are enabled globally so the time digit width is stable.
 */
export function StatusBar() {
  return (
    <div className="sticky top-0 z-40 flex h-11 w-full items-center justify-between bg-[var(--color-navy-deep)]/90 px-6 text-white backdrop-blur-md">
      <span
        className="text-sm font-semibold"
        style={{ fontFeatureSettings: '"tnum"' }}
      >
        {copy.statusBar.time}
      </span>
      <div className="flex items-center gap-1.5">
        <SignalHigh className="h-4 w-4" aria-hidden="true" />
        <Wifi className="h-4 w-4" aria-hidden="true" />
        <BatteryFull className="h-5 w-5" aria-hidden="true" />
      </div>
    </div>
  );
}
