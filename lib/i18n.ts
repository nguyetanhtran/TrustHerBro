// Language selection now lives in lib/i18n/ (LanguageContext + translations),
// shared across the whole app including this Welcome flow, so the choice
// actually carries over instead of being local to one wizard step.

// Travel interests used to personalize suggestions later on.
export const INTERESTS = [
  "Food",
  "Culture",
  "Nightlife",
  "Nature",
  "Shopping",
  "History",
] as const;

export type Interest = (typeof INTERESTS)[number];
