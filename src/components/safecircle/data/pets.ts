export type Pet = {
  id: string;
  name: string;
  breed: string;
  ageYears: number;
  homeAlone: boolean;
  /** Where in the home the pet typically rests. */
  usualLocation: string;
  /** Personality / behavioural notes shared with trusted neighbours. */
  temperament: string;
  vet: string;
  /** Whether a key code is shared with trusted neighbours. */
  keyShared: string;
  meds: string;
};

/**
 * Demo pet — Dino, a 4-year-old Chihuahua. Surfaced on the home screen,
 * fire alert, and pets profile.
 */
export const dino: Pet = {
  id: "dino",
  name: "Dino",
  breed: "Chihuahua",
  ageYears: 4,
  homeAlone: true,
  usualLocation: "Stue / ved sofaen",
  temperament: "Redd for høye lyder",
  vet: "Hamar Dyreklinikk",
  keyShared: "Ja — kode delt med betrodde",
  meds: "Ingen",
};

export const pets: Pet[] = [dino];
