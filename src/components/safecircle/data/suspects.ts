export type Suspect = {
  id: string;
  /** Name of the SafeCircle user who filed the report. */
  reporter: string;
  description: string;
  /** Free-text time the suspicious activity was first observed. */
  observedAt: string;
  /** Last known location, displayed in the alert subtitle. */
  location: string;
  /** Path to a photo asset, or null if only a placeholder is shown. */
  photoUrl: string | null;
  /** Number of neighbours who have corroborated the sighting. */
  confirmations: number;
};

/**
 * Demo suspect record displayed on `/burglary-alert`. The photo is left null
 * so the UI renders a placeholder tile (Wave 2 owns the visual treatment).
 */
export const burglarySuspect: Suspect = {
  id: "parkveien-2026-05-01",
  reporter: "Thomas K.",
  description: "Mann, ca 30 år, mørk hettegenser, blå sekk",
  observedAt: "Kl 13:48",
  location: "Parkveien — prøver dører",
  photoUrl: null,
  confirmations: 4,
};
