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
      <rect width="390" height="600" fill="#182538" />

      {/* Parks */}
      <path d="M20 40 Q80 0 160 50 Q200 100 160 160 Q110 190 50 160 Q0 130 20 40 Z"
        fill="#2B8A3E" opacity="0.22" />
      <path d="M260 400 Q330 385 355 450 Q360 500 320 520 Q270 530 255 480 Q245 445 260 400 Z"
        fill="#2B8A3E" opacity="0.22" />

      {/* Water (bottom-left) */}
      <path d="M0 550 Q70 535 130 558 Q90 600 0 600 Z" fill="#1e3a5f" opacity="0.8" />

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

      {/* Street labels */}
      <g fill="rgba(255,255,255,0.35)" fontSize="8" fontFamily="var(--font-geist-sans), system-ui, sans-serif">
        <text x="290" y="155" textAnchor="middle">Parkveien</text>
        <text x="290" y="375" textAnchor="middle">Storgata</text>
        <text x="290" y="485" textAnchor="middle">Brugata</text>
      </g>

      {children}
    </svg>
  );
}
