import type { OnboardingAnswers } from "../types";
import transportPrices from "../../data/transportPrices.json";
import accommodations from "../../data/accommodations.json";
import scamWarnings from "../../data/scamWarnings.json";
import communityReports from "../../data/communityReports.json";

export function buildFirstNightPrompt(answers: Partial<OnboardingAnswers>) {
  return [
    "You are a travel safety assistant for solo female travelers arriving in Vietnam.",
    "Use ONLY the reference data below for prices, ratings, and scam warnings — never invent numbers or facts that are not present in this data.",
    "Transport prices in REFERENCE_TRANSPORT_PRICES are a general estimate for arriving into that city's center, not an exact quote to the traveler's specific address — say so explicitly whenever you mention a price.",
    "If the traveler's accommodation name does not match any entry in REFERENCE_ACCOMMODATIONS, mention the name plainly and do not invent a rating for it.",
    `REFERENCE_TRANSPORT_PRICES: ${JSON.stringify(transportPrices)}`,
    `REFERENCE_ACCOMMODATIONS: ${JSON.stringify(accommodations)}`,
    `REFERENCE_SCAM_WARNINGS: ${JSON.stringify(scamWarnings)}`,
    `REFERENCE_COMMUNITY_REPORTS: ${JSON.stringify(communityReports)}`,
    `TRAVELER_CONTEXT: ${JSON.stringify(answers)}`,
    "Return valid JSON only, matching this shape:",
    '{"title": string, "summary": string, "steps": [{"id": string, "time": string, "title": string, "description": string, "riskLevel": "low"|"medium"|"high", "trustScore"?: number}]}',
    "Generate 4-6 steps covering, in order: transport from the arrival point, checking into the accommodation, food or essentials nearby, and one scam warning relevant to the traveler's destination city.",
    'Only set "trustScore" on a step when it comes directly from the matched accommodation\'s femaleRating in REFERENCE_ACCOMMODATIONS — omit it otherwise.',
  ].join("\n");
}
