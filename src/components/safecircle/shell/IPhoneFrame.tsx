import { cn } from "@/lib/utils";

type IPhoneFrameProps = {
  children: React.ReactNode;
  className?: string;
};

/**
 * Desktop-only iPhone bezel. Wraps children in a 390x844 rounded "device"
 * with a notch hint at the top. On mobile we render full-bleed instead — see
 * `MobileShell` for the responsive switching logic.
 */
export function IPhoneFrame({ children, className }: IPhoneFrameProps) {
  return (
    <div
      className={cn(
        "relative w-[390px] h-[844px] rounded-[44px] bg-black p-[6px] shadow-2xl",
        className,
      )}
    >
      {/* Notch hint */}
      <div className="pointer-events-none absolute left-1/2 top-2 z-50 h-[24px] w-[110px] -translate-x-1/2 rounded-full bg-black" />
      <div className="rounded-[38px] overflow-hidden bg-[var(--color-navy-deep)] h-full w-full relative">
        {children}
      </div>
    </div>
  );
}
