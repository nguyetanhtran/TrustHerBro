import { NextResponse } from "next/server";
import { runOpenAIJson } from "../../../lib/ai/openai";
import { buildFirstNightPrompt } from "../../../lib/ai/prompts/firstNightPrompt";
import type { LanguageCode } from "../../../lib/i18n/translations";
import { fallbackTimelineText } from "../../../lib/i18n/fallbackTimeline";
import type { OnboardingAnswers, SurvivalTimelinePayload } from "../../../lib/ai/types";
import { sampleTimeline } from "../../../lib/ai/types";

function buildFallbackTimeline(
  answers: Partial<OnboardingAnswers>,
  language: LanguageCode,
): SurvivalTimelinePayload {
  const city = answers.city || "your destination";
  const hotel = answers.accommodation || "your accommodation";
  const text = fallbackTimelineText[language] ?? fallbackTimelineText.en;

  return {
    title: text.title(city),
    summary: text.summary,
    steps: [
      {
        id: "arrival",
        time: "0-30 min",
        title: text.arrivalTitle,
        description: text.arrivalDescription,
        riskLevel: "medium",
      },
      {
        id: "checkin",
        time: "30-90 min",
        title: text.checkinTitle(hotel),
        description: text.checkinDescription,
        riskLevel: "low",
      },
      {
        id: "essentials",
        time: "90-150 min",
        title: text.essentialsTitle,
        description: text.essentialsDescription,
        riskLevel: "low",
      },
      {
        id: "rest",
        time: "150-240 min",
        title: text.restTitle,
        description: text.restDescription,
        riskLevel: "low",
      },
    ],
  };
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    answers?: Partial<OnboardingAnswers>;
    language?: LanguageCode;
  };
  const answers = body.answers ?? {};
  const language = body.language ?? "en";
  const fallback = buildFallbackTimeline(answers, language);

  try {
    const result = await runOpenAIJson<SurvivalTimelinePayload>({
      systemPrompt: buildFirstNightPrompt(answers, language),
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
