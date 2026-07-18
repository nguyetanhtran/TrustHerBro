export type AppMode = "assistant" | "first-night" | "safety" | "emergency";

export type OnboardingAnswers = {
  city: string;
  arrivalTime: string;
  accommodation: string;
  travelingAlone: boolean;
  firstTimeInVN: boolean;
  hasTransport: boolean;
  hasMobileData: boolean;
};

export type TimelineStep = {
  id: string;
  time: string;
  title: string;
  description: string;
  riskLevel: "low" | "medium" | "high";
  trustScore?: number;
};

export type SurvivalTimelinePayload = {
  title: string;
  summary: string;
  steps: TimelineStep[];
};

export type SafetyPhrase = {
  id?: string;
  category?: "boundary" | "cover" | "help" | "transport";
  vietnamese: string;
  phonetic?: string;
  english: string;
};

export type TransportSuggestion = {
  /** e.g. "Grab", "Be", "Taxi Mai Linh". */
  option: string;
  /** Reference price so she isn't overcharged, e.g. "80,000–120,000 VND". */
  priceRange: string;
  /** Short safety note, e.g. "Match the plate before getting in". */
  note: string;
  /** Optional deep link / URL to open the booking app. */
  bookingUrl?: string;
};

export type RiskAssessment = {
  level: "low" | "medium" | "high";
  score: number;
  /** Calm, reassuring summary — preventive, not alarming. */
  summary: string;
  /** The soft offer, e.g. "Would you like me to help you get back somewhere safe?" */
  offer: string;
  safeRoute: {
    destination: string;
    etaMinutes: number;
    /** Why this route is safer — well-lit, busy, staffed, etc. */
    description: string;
    instructions: string[];
  };
  /** Ways to get back safely, with reference prices. */
  transport: TransportSuggestion[];
  actions: string[];
  /** Short Vietnamese self-protection phrases she can say or play out loud. */
  phrases: SafetyPhrase[];
  /** How often the companion should check in on her, in minutes. */
  checkInMinutes: number;
};

export type ScamPattern = {
  id: string;
  title: string;
  category: string;
  description: string;
  /** Tell-tale cues used to recognize the pattern. */
  signals: string[];
  /** Concrete steps to handle it. */
  howToHandle: string[];
};

export type ScamMatch = {
  id: string;
  title: string;
  /** 0-1 — how confident we are this pattern applies. Guards false alarms. */
  confidence: number;
  /** Why this description matches the pattern. */
  why: string;
  howToHandle: string[];
};

export type ScamCheckResult = {
  /** True only when confidence is high enough — avoids distrusting honest sellers. */
  isLikelyScam: boolean;
  /** 0-1 overall confidence in the assessment. */
  confidence: number;
  matches: ScamMatch[];
  /** Calm, balanced advice on what to do next. */
  advice: string;
  /** Honest caveat shown to the user. */
  disclaimer: string;
};

export type TrustCheckResult = {
  subject: string;
  trustScore: number;
  verdict: string;
  supportingReasons: string[];
  warnings: string[];
};

export type NearbyPlace = {
  id: string;
  name: string;
  address: string;
  rating?: number;
  userRatingsTotal?: number;
  priceLevel?: number;
  mapsQuery: string;
  category: "food" | "fun";
};

export type NearbySuggestionsResult = {
  food: NearbyPlace[];
  fun: NearbyPlace[];
  areaLabel: string;
};

export type UserProfile = {
  /** BCP-47-ish language code, e.g. "en", "ko", "zh", "ru", "vi". */
  language: string;
  /** Chosen travel interests. */
  interests: string[];
  /** Whether she allowed location during onboarding. */
  locationEnabled: boolean;
  /** True once the welcome flow is complete. */
  onboarded: boolean;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export const sampleTimeline: TimelineStep[] = [
  {
    id: "airport",
    time: "0-20 min",
    title: "Exit with a transport plan",
    description: "Ignore unsolicited drivers and head toward the official pickup zone.",
    riskLevel: "medium",
  },
  {
    id: "hotel",
    time: "20-80 min",
    title: "Check in and secure essentials",
    description: "Lock passport, cash, and backup card before going back outside.",
    riskLevel: "low",
  },
  {
    id: "food",
    time: "80-120 min",
    title: "Find nearby food only",
    description: "Keep the first meal close to your stay and avoid isolated shortcuts.",
    riskLevel: "low",
  },
];
