import { NextResponse } from "next/server";
import { runOpenAIJson } from "../../../lib/ai/openai";
import { buildSafetyModePrompt } from "../../../lib/ai/prompts/safetyModePrompt";
import type { RiskAssessment } from "../../../lib/ai/types";
import { calculateRiskScore, scoreToLevel } from "../../../lib/utils/riskScore";

function buildFallbackAssessment(message: string): RiskAssessment {
  const score = calculateRiskScore(message);
  const level = scoreToLevel(score);

  return {
    level,
    score,
    summary:
      level === "high"
        ? "Situation may require immediate distancing and a move to a public, staffed place."
        : "Stay alert and keep moving toward a visible, well-lit route.",
    safeRoute: {
      destination: "nearest staffed public place",
      etaMinutes: 8,
      instructions: [
        "Move toward a busy, well-lit street.",
        "Enter a staffed cafe, pharmacy, hotel, or convenience store.",
        "Text or call a trusted contact once inside.",
      ],
    },
    actions: [
      "Do not share live location with strangers.",
      "Keep phone unlocked only if you need quick emergency access.",
      "Trust discomfort early and leave before the situation escalates.",
    ],
  };
}

export async function POST(request: Request) {
  const body = await request.json();
  const message = String(body?.message ?? "");

  if (!message.trim()) {
    return NextResponse.json(
      { error: "Message is required." },
      { status: 400 },
    );
  }

  const fallback = buildFallbackAssessment(message);

  try {
    const result = await runOpenAIJson<RiskAssessment>({
      systemPrompt: buildSafetyModePrompt(),
      userPrompt: message,
      fallback,
    });
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(fallback);
  }
}
