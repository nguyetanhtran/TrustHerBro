export type AppMode = "assistant" | "first-night" | "safety" | "emergency";

export type OnboardingAnswers = {
  destination: string;
  arrivalTime: string;
  transportPlan: string;
  stayType: string;
  budgetLevel: string;
  languageComfort: string;
  topConcern: string;
};

export type TimelineStep = {
  id: string;
  time: string;
  title: string;
  description: string;
  riskLevel: "low" | "medium" | "high";
};

export type SurvivalTimelinePayload = {
  title: string;
  summary: string;
  steps: TimelineStep[];
};

export type RiskAssessment = {
  level: "low" | "medium" | "high";
  score: number;
  summary: string;
  safeRoute: {
    destination: string;
    etaMinutes: number;
    instructions: string[];
  };
  actions: string[];
};

export type TrustCheckResult = {
  subject: string;
  trustScore: number;
  verdict: string;
  supportingReasons: string[];
  warnings: string[];
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
