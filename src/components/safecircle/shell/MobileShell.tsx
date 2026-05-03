import { cn } from "@/lib/utils";
import { BottomNav } from "./BottomNav";
import { IPhoneFrame } from "./IPhoneFrame";
import { StatusBar } from "./StatusBar";
import { DemoMenu } from "../demo/DemoMenu";

type MobileShellProps = {
  children: React.ReactNode;
  /** Render the bottom navigation bar (default true). Disabled on alert screens. */
  showNav?: boolean;
  /** Render the iOS-style top status bar (default true). */
  showStatusBar?: boolean;
  /** Additional classes for the inner scroll area. */
  className?: string;
};

/**
 * Outer shell every screen wraps in. On mobile widths we render full-bleed
 * (with sticky StatusBar / BottomNav). On desktop (>=md) we centre the same
 * content inside an iPhone bezel for the demo / pitch context.
 *
 * The shell owns scrolling: the bezel uses `overflow-hidden` while the
 * children pane scrolls vertically as the user expects from a native app.
 */
export function MobileShell({
  children,
  showNav = true,
  showStatusBar = true,
  className,
}: MobileShellProps) {
  const inner = (
    <div className="flex h-full min-h-dvh w-full flex-col bg-[var(--color-navy-deep)]">
      {showStatusBar && <StatusBar />}
      <div
        className={cn(
          "flex-1 overflow-y-auto overscroll-contain",
          className,
        )}
      >
        {children}
      </div>
      {showNav && <BottomNav />}
    </div>
  );

  return (
    <>
      {/* Mobile (<md): full-bleed */}
      <div className="md:hidden">{inner}</div>

      {/* Desktop (>=md): centred iPhone frame */}
      <div className="hidden min-h-dvh w-full items-center justify-center bg-black/70 p-8 md:flex">
        <IPhoneFrame>{inner}</IPhoneFrame>
      </div>

      {/* Demo-only FAB exposing every route — fixed-position, so it floats
          regardless of where it sits in the DOM. Always rendered (the entire
          app is a demo prototype). */}
      <DemoMenu />
    </>
  );
}
