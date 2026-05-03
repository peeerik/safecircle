"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Map as MapIcon, PawPrint, User } from "lucide-react";
import { SOSButton } from "@/components/safecircle/buttons/SOSButton";
import { copy } from "@/lib/copy";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  icon: typeof Home;
  label: string;
};

const LEFT: NavItem[] = [
  { href: "/", icon: Home, label: copy.nav.home },
  { href: "/map", icon: MapIcon, label: copy.nav.map },
];

const RIGHT: NavItem[] = [
  { href: "/pets", icon: PawPrint, label: copy.nav.pets },
  { href: "/profile", icon: User, label: copy.nav.profile },
];

function NavLink({ href, icon: Icon, label }: NavItem) {
  const pathname = usePathname();
  const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={cn(
        "flex size-12 flex-col items-center justify-center gap-0.5 rounded-xl transition-colors",
        isActive
          ? "text-[var(--color-gold)]"
          : "text-[var(--white-40)] hover:text-[var(--white-80)]",
      )}
      aria-current={isActive ? "page" : undefined}
    >
      <Icon className="h-5 w-5" aria-hidden="true" />
      <span className="text-[10px] font-medium leading-none">{label}</span>
    </Link>
  );
}

/**
 * Sticky-bottom mobile nav bar with the central SOS press-and-hold button
 * sitting raised above the row. Glass-blur background mimics iOS bars.
 */
export function BottomNav() {
  return (
    <nav
      aria-label="Hovednavigasjon"
      className="sticky bottom-0 z-30 flex h-20 w-full items-center justify-around bg-[var(--color-navy-card)]/80 px-4 backdrop-blur-md"
      style={{
        borderTop: "1px solid var(--color-border)",
      }}
    >
      {LEFT.map((item) => (
        <NavLink key={item.href} {...item} />
      ))}

      {/* Raised SOS center item */}
      <div className="-mt-7 flex flex-col items-center gap-1">
        <SOSButton size={64} />
        <span className="text-[10px] font-medium leading-none text-[var(--color-red-alert)]">
          {copy.nav.sos}
        </span>
      </div>

      {RIGHT.map((item) => (
        <NavLink key={item.href} {...item} />
      ))}
    </nav>
  );
}
