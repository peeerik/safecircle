import { cn } from "@/lib/utils";

type MapCanvasProps = {
  /** Optional overlay layers (dots, radius, markers) rendered on top. */
  children?: React.ReactNode;
  /** Override the SVG viewBox. Default "0 0 390 700". */
  viewBox?: string;
  className?: string;
};

/**
 * Stylised inline SVG "neighborhood map". No real cartography — just an
 * abstract representation with streets, parks, water, and clustered building
 * blocks. Children are rendered last so neighbour dots / radius overlays
 * appear above the base layers.
 */
export function MapCanvas({
  children,
  viewBox = "0 0 390 700",
  className,
}: MapCanvasProps) {
  return (
    <svg
      viewBox={viewBox}
      role="img"
      aria-label="Stilisert nabolagskart"
      className={cn("block h-full w-full", className)}
      preserveAspectRatio="xMidYMid slice"
    >
      {/* Base */}
      <rect width="390" height="700" fill="var(--color-navy)" />

      {/* Parks (organic blobs) */}
      <path
        d="M40 120 Q90 60 160 100 Q210 140 180 200 Q140 250 80 220 Q20 190 40 120 Z"
        fill="var(--color-green-dim)"
        opacity="0.3"
      />
      <path
        d="M260 420 Q320 400 350 460 Q360 510 320 540 Q270 555 250 510 Q235 470 260 420 Z"
        fill="var(--color-green-dim)"
        opacity="0.3"
      />

      {/* Water (bottom-left bezier) */}
      <path
        d="M0 600 Q60 580 130 605 Q90 660 30 685 L0 700 Z"
        fill="#1e3a5f"
      />

      {/* Streets — horizontals */}
      <g
        stroke="var(--white-08)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      >
        <line x1="0" y1="160" x2="390" y2="170" />
        <line x1="0" y1="280" x2="390" y2="270" />
        <line x1="0" y1="380" x2="390" y2="395" />
        <line x1="0" y1="480" x2="390" y2="475" />
        <line x1="0" y1="560" x2="390" y2="565" />
      </g>

      {/* Streets — diagonals */}
      <g
        stroke="var(--white-08)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      >
        <line x1="80" y1="0" x2="180" y2="700" />
        <line x1="220" y1="0" x2="320" y2="700" />
        <line x1="0" y1="80" x2="390" y2="640" />
      </g>

      {/* Main road (thicker) */}
      <line
        x1="0"
        y1="350"
        x2="390"
        y2="350"
        stroke="var(--white-08)"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Building clusters near intersections */}
      <g fill="var(--color-navy-light)">
        <rect x="100" y="180" width="14" height="14" rx="2" />
        <rect x="118" y="180" width="14" height="14" rx="2" />
        <rect x="100" y="198" width="14" height="14" rx="2" />

        <rect x="240" y="300" width="14" height="14" rx="2" />
        <rect x="258" y="300" width="14" height="14" rx="2" />
        <rect x="240" y="318" width="14" height="14" rx="2" />

        <rect x="60" y="430" width="14" height="14" rx="2" />
        <rect x="78" y="430" width="14" height="14" rx="2" />

        <rect x="300" y="520" width="14" height="14" rx="2" />
        <rect x="318" y="520" width="14" height="14" rx="2" />
      </g>

      {/* Street labels */}
      <g
        fill="var(--white-40)"
        fontSize="8"
        fontFamily="var(--font-geist-sans), system-ui, sans-serif"
      >
        <text x="200" y="345" textAnchor="middle">
          Storgata
        </text>
        <text x="190" y="155" textAnchor="middle">
          Parkveien
        </text>
        <text x="270" y="475" textAnchor="middle">
          Brugata
        </text>
      </g>

      {/* Overlay slot */}
      {children}
    </svg>
  );
}
