import { NextResponse } from "next/server";
import { runOpenAIJson } from "../../../lib/ai/openai";
import { buildFirstNightPrompt } from "../../../lib/ai/prompts/firstNightPrompt";
import type { OnboardingAnswers, SurvivalTimelinePayload } from "../../../lib/ai/types";
import { sampleTimeline } from "../../../lib/ai/types";

function buildFallbackTimeline(answers: Partial<OnboardingAnswers>): SurvivalTimelinePayload {
  const city = answers.city || "your destination";
  const hotel = answers.accommodation || "your accommodation";

  return {
    title: `First night plan for ${city}`,
    summary: "Low-friction arrival plan focused on transport, check-in, food, and rest.",
    steps: [
      {
        id: "arrival",
        time: "0-30 min",
        title: "Secure transport first",
        description: `Use an official taxi stand or ride-hailing app and avoid informal offers inside the airport or station.`,
        riskLevel: "medium",
      },
      {
        id: "checkin",
        time: "30-90 min",
        title: `Reach ${hotel}`,
        description: "Check address in-app before moving, keep valuables zipped, and message one trusted contact when you arrive.",
        riskLevel: "low",
      },
      {
        id: "essentials",
        time: "90-150 min",
        title: "Get essentials nearby",
        description: "Buy water, a snack, and a local SIM or eSIM if needed, but stay within a short walk of your stay.",
        riskLevel: "low",
      },
      {
        id: "rest",
        time: "150-240 min",
        title: "Prep for tomorrow",
        description: "Charge devices, set an offline map, confirm tomorrow's route, and avoid late-night exploration on arrival day.",
        riskLevel: "low",
      },
    ],
  };
}

export async function POST(request: Request) {
  const body = (await request.json()) as { answers?: Partial<OnboardingAnswers> };
  const answers = body.answers ?? {};
  const fallback = buildFallbackTimeline(answers);

  try {
    const result = await runOpenAIJson<SurvivalTimelinePayload>({
      systemPrompt: buildFirstNightPrompt(answers),
      userPrompt: JSON.stringify(answers),
      fallback,
    });
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({
      ...fallback,
      steps: fallback.steps.length ? fallback.steps : sampleTimeline,
    });
  }
}
