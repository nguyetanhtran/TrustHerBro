import { NextResponse } from "next/server";
import { runOpenAIJson } from "../../../lib/ai/openai";
import { buildSafetyModePrompt } from "../../../lib/ai/prompts/safetyModePrompt";
import vietnamesePhrases from "../../../lib/data/vietnamesePhrases.json";
import type {
  RiskAssessment,
  SafetyPhrase,
  TransportSuggestion,
} from "../../../lib/ai/types";
import { normalizeCoordinates, findNearestCity } from "../../../lib/utils/geolocation";
import { calculateRiskScore, scoreToLevel } from "../../../lib/utils/riskScore";

const phraseCatalog = vietnamesePhrases as SafetyPhrase[];
const phraseById = new Map(phraseCatalog.map((phrase) => [phrase.id, phrase]));
const defaultPhrases = phraseCatalog.slice(0, 4);

// Turn the model's chosen catalog ids (+ any custom phrases) into full phrase
// objects — keeping the vetted Vietnamese + phonetics from the dataset. The
// model matches her situation semantically, so this works for any wording,
// not just the exact example sentences.
function resolvePhrases(raw: {
  phraseIds?: unknown;
  phrases?: unknown;
}): SafetyPhrase[] {
  const ids = Array.isArray(raw.phraseIds) ? (raw.phraseIds as string[]) : [];
  const picked = ids
    .map((id) => phraseById.get(id))
    .filter((phrase): phrase is SafetyPhrase => Boolean(phrase));

  const custom = Array.isArray(raw.phrases) ? (raw.phrases as SafetyPhrase[]) : [];
  const merged = [...picked, ...custom].filter((phrase) => phrase?.vietnamese);

  return merged.length >= 2 ? merged.slice(0, 4) : defaultPhrases;
}

const defaultTransport: TransportSuggestion[] = [
  {
    option: "Grab",
    priceRange: "reference in-app before you book",
    note: "Book in the app and match the plate plus driver photo before getting in.",
    bookingUrl: "https://www.grab.com/vn/en/",
  },
  {
    option: "Be",
    priceRange: "reference in-app before you book",
    note: "Another trusted ride app used widely by locals.",
    bookingUrl: "https://be.com.vn/",
  },
];

function buildFallbackAssessment(message: string): RiskAssessment {
  const score = calculateRiskScore(message);
  const level = scoreToLevel(score);

  return {
    level,
    score,
    summary:
      level === "high"
        ? "That does sound unsettling. Let's calmly get you back somewhere safe and familiar."
        : "It's okay to feel uneasy - trust that instinct. Let's move you toward a brighter, busier spot.",
    offer: "Would you like me to help you get back somewhere safe?",
    safeRoute: {
      destination: "nearest staffed public place",
      etaMinutes: 8,
      description:
        "Head for the brightest, busiest street with people around. Staffed shops give you light, witnesses, and a place to wait.",
      instructions: [
        "Walk toward a busy, well-lit street - keep a steady, confident pace.",
        "Step into a staffed cafe, hotel lobby, pharmacy, or convenience store.",
        "Message a trusted contact your location once you're inside.",
      ],
    },
    transport: defaultTransport,
    actions: [
      "Keep walking with purpose - looking lost marks you as a target.",
      "Do not share your live location with strangers.",
      "Trust your discomfort and leave early - you are not overreacting.",
    ],
    phrases: defaultPhrases,
    checkInMinutes: level === "high" ? 3 : 5,
  };
}

export async function POST(request: Request) {
  const body = await request.json();
  const message = String(body?.message ?? "");
  const coords = normalizeCoordinates(body?.location);

  if (!message.trim()) {
    return NextResponse.json({ error: "Message is required." }, { status: 400 });
  }

  const fallback = buildFallbackAssessment(message);
  const nearestCity = coords ? findNearestCity(coords) : null;
  const userPrompt = coords
    ? `${message}\n\nLocation: lat ${coords.lat}, lng ${coords.lng}${
        nearestCity ? ` (near ${nearestCity})` : ""
      }.`
    : message;

  try {
    const result = await runOpenAIJson<RiskAssessment & { phraseIds?: string[] }>({
      systemPrompt: buildSafetyModePrompt(),
      userPrompt,
      fallback,
    });

    // Resolve the model's catalog picks back into full, vetted phrases.
    result.phrases = resolvePhrases(result);
    delete result.phraseIds;

    if (!Array.isArray(result.transport) || result.transport.length === 0) {
      result.transport = defaultTransport;
    }
    if (!result.offer) {
      result.offer = fallback.offer;
    }
    if (typeof result.checkInMinutes !== "number") {
      result.checkInMinutes = fallback.checkInMinutes;
    }

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(fallback);
  }
}
