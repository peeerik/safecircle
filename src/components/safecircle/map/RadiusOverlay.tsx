type RadiusOverlayProps = {
  cx: number;
  cy: number;
  r: number;
};

/**
 * Dashed gold circle used to indicate a radius (e.g. 500m around the user).
 * Render as a child of `MapCanvas` so it inherits the viewBox coordinate
 * system.
 */
export function RadiusOverlay({ cx, cy, r }: RadiusOverlayProps) {
  return (
    <circle
      cx={cx}
      cy={cy}
      r={r}
      stroke="var(--color-gold)"
      strokeDasharray="4 4"
      strokeWidth="1.5"
      fill="var(--color-gold)"
      fillOpacity="0.05"
    />
  );
}
