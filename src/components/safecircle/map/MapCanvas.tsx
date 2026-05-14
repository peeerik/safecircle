import { cn } from "@/lib/utils";

type MapCanvasProps = {
  children?: React.ReactNode;
  viewBox?: string;
  className?: string;
};

export function MapCanvas({ children, viewBox = "0 0 390 600", className }: MapCanvasProps) {
  return (
    <svg
      viewBox={viewBox}
      role="img"
      aria-label="Stilisert nabolagskart"
      className={cn("block h-full w-full", className)}
      preserveAspectRatio="xMidYMid slice"
    >
      {/* Base — slightly lighter than --color-navy for better contrast */}
      <rect x="-200" y="-200" width="790" height="1200" fill="#182538" />

      {/* Secondary streets — Parkveien (y=160) */}
      <line x1="0" y1="160" x2="390" y2="160" stroke="rgba(255,255,255,0.14)" strokeWidth="2.5" strokeLinecap="round" />
      {/* Secondary streets — Brugata (y=490) */}
      <line x1="0" y1="490" x2="390" y2="490" stroke="rgba(255,255,255,0.14)" strokeWidth="2.5" strokeLinecap="round" />
      {/* Secondary vertical — left (x=80) */}
      <line x1="80" y1="0" x2="80" y2="600" stroke="rgba(255,255,255,0.12)" strokeWidth="2" strokeLinecap="round" />
      {/* Secondary vertical — right (x=310) */}
      <line x1="310" y1="0" x2="310" y2="600" stroke="rgba(255,255,255,0.12)" strokeWidth="2" strokeLinecap="round" />

      {/* Main vertical street (x=195) */}
      <line x1="195" y1="0" x2="195" y2="600" stroke="rgba(255,255,255,0.22)" strokeWidth="4" strokeLinecap="round" />
      {/* Main horizontal street — Storgata (y=380) */}
      <line x1="0" y1="380" x2="390" y2="380" stroke="rgba(255,255,255,0.22)" strokeWidth="5" strokeLinecap="round" />

      {/* Fjellveien — northern horizontal street */}
      <line x1="-200" y1="-100" x2="590" y2="-100" stroke="rgba(255,255,255,0.14)" strokeWidth="2.5" strokeLinecap="round" />
      {/* Extend secondary verticals north */}
      <line x1="80" y1="-200" x2="80" y2="0" stroke="rgba(255,255,255,0.12)" strokeWidth="2" strokeLinecap="round" />
      <line x1="195" y1="-200" x2="195" y2="0" stroke="rgba(255,255,255,0.22)" strokeWidth="4" strokeLinecap="round" />
      <line x1="310" y1="-200" x2="310" y2="0" stroke="rgba(255,255,255,0.12)" strokeWidth="2" strokeLinecap="round" />

      {/* Havneveien — southern horizontal street */}
      <line x1="-200" y1="660" x2="590" y2="660" stroke="rgba(255,255,255,0.14)" strokeWidth="2.5" strokeLinecap="round" />
      {/* Extend secondary verticals south */}
      <line x1="80" y1="600" x2="80" y2="800" stroke="rgba(255,255,255,0.12)" strokeWidth="2" strokeLinecap="round" />
      <line x1="195" y1="600" x2="195" y2="800" stroke="rgba(255,255,255,0.22)" strokeWidth="4" strokeLinecap="round" />
      <line x1="310" y1="600" x2="310" y2="800" stroke="rgba(255,255,255,0.12)" strokeWidth="2" strokeLinecap="round" />

      {/* Lillegata — western vertical street */}
      <line x1="-80" y1="-200" x2="-80" y2="800" stroke="rgba(255,255,255,0.12)" strokeWidth="2" strokeLinecap="round" />
      {/* Granveien — short connector west */}
      <line x1="-80" y1="270" x2="80" y2="270" stroke="rgba(255,255,255,0.10)" strokeWidth="1.5" strokeLinecap="round" />

      {/* Åsveien — eastern vertical street */}
      <line x1="470" y1="-200" x2="470" y2="800" stroke="rgba(255,255,255,0.12)" strokeWidth="2" strokeLinecap="round" />
      {/* Granveien — short connector east */}
      <line x1="310" y1="270" x2="470" y2="270" stroke="rgba(255,255,255,0.10)" strokeWidth="1.5" strokeLinecap="round" />

      {/* Extend existing horizontals to new width */}
      <line x1="-200" y1="160" x2="-1" y2="160" stroke="rgba(255,255,255,0.14)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="391" y1="160" x2="590" y2="160" stroke="rgba(255,255,255,0.14)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="-200" y1="380" x2="-1" y2="380" stroke="rgba(255,255,255,0.22)" strokeWidth="5" strokeLinecap="round" />
      <line x1="391" y1="380" x2="590" y2="380" stroke="rgba(255,255,255,0.22)" strokeWidth="5" strokeLinecap="round" />
      <line x1="-200" y1="490" x2="-1" y2="490" stroke="rgba(255,255,255,0.14)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="391" y1="490" x2="590" y2="490" stroke="rgba(255,255,255,0.14)" strokeWidth="2.5" strokeLinecap="round" />

      {/* Building clusters at major intersections */}
      <g fill="#1e3550" opacity="0.9">
        {/* Parkveien × x=80 */}
        <rect x="88" y="168" width="12" height="12" rx="2" />
        <rect x="104" y="168" width="12" height="12" rx="2" />
        <rect x="88" y="184" width="12" height="10" rx="2" />
        {/* Parkveien × x=195 */}
        <rect x="203" y="168" width="12" height="12" rx="2" />
        <rect x="219" y="168" width="10" height="12" rx="2" />
        {/* Storgata × x=195 */}
        <rect x="203" y="388" width="12" height="12" rx="2" />
        <rect x="219" y="388" width="12" height="10" rx="2" />
        {/* Storgata × x=310 */}
        <rect x="318" y="388" width="12" height="12" rx="2" />
        <rect x="334" y="388" width="10" height="12" rx="2" />
        {/* Brugata × x=195 */}
        <rect x="203" y="498" width="12" height="12" rx="2" />
        <rect x="219" y="498" width="10" height="10" rx="2" />
      </g>

      {/* New building clusters at new intersections */}
      <g fill="#1e3550" opacity="0.9">
        {/* Fjellveien × x=195 */}
        <rect x="203" y="-92" width="12" height="12" rx="2" />
        <rect x="219" y="-92" width="10" height="10" rx="2" />
        {/* Fjellveien × x=80 */}
        <rect x="88" y="-92" width="12" height="12" rx="2" />
        {/* Havneveien × x=195 */}
        <rect x="203" y="668" width="12" height="12" rx="2" />
        {/* Lillegata × Storgata */}
        <rect x="-72" y="388" width="12" height="12" rx="2" />
        <rect x="-72" y="404" width="12" height="10" rx="2" />
        {/* Åsveien × Parkveien */}
        <rect x="478" y="168" width="12" height="12" rx="2" />
        {/* Åsveien × Brugata */}
        <rect x="478" y="498" width="12" height="12" rx="2" />
      </g>

      {/* Street labels */}
      <g fill="rgba(255,255,255,0.35)" fontSize="8" fontFamily="var(--font-geist-sans), system-ui, sans-serif">
        <text x="290" y="155" textAnchor="middle">Parkveien</text>
        <text x="290" y="375" textAnchor="middle">Storgata</text>
        <text x="290" y="485" textAnchor="middle">Brugata</text>
        <text x="195" y="-108" textAnchor="middle">Fjellveien</text>
        <text x="195" y="650" textAnchor="middle">Havneveien</text>
        <text x="-108" y="380" textAnchor="middle" transform="rotate(-90, -108, 380)">Lillegata</text>
        <text x="498" y="380" textAnchor="middle" transform="rotate(-90, 498, 380)">Åsveien</text>
        <text x="20" y="265" textAnchor="middle">Granveien</text>
        <text x="400" y="265" textAnchor="middle">Granveien</text>
      </g>

      {children}
    </svg>
  );
}
