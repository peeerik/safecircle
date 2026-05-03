import { cn } from "@/lib/utils";

type AlertHeaderProps = {
  /** Large icon node — usually a Lucide icon sized via parent props. */
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  timestamp?: string;
  className?: string;
};

/**
 * Centred header used at the top of every alert screen. Displays a large
 * icon, a bold title, an optional subtitle (typically the location), and an
 * optional timestamp line in a quieter colour.
 */
export function AlertHeader({
  icon,
  title,
  subtitle,
  timestamp,
  className,
}: AlertHeaderProps) {
  return (
    <header
      className={cn(
        "flex flex-col items-center gap-3 px-6 text-center",
        className,
      )}
    >
      <div className="flex h-16 w-16 items-center justify-center" aria-hidden="true">
        {icon}
      </div>
      <h1 className="text-3xl font-bold leading-tight tracking-tight text-white">
        {title}
      </h1>
      {subtitle ? (
        <p className="text-base text-[var(--white-80)]">{subtitle}</p>
      ) : null}
      {timestamp ? (
        <p className="text-sm text-[var(--white-40)]">{timestamp}</p>
      ) : null}
    </header>
  );
}
