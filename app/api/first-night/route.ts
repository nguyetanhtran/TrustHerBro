import { NextResponse } from "next/server";
import { runOpenAIJson } from "../../../lib/ai/openai";
import { buildFirstNightPrompt } from "../../../lib/ai/prompts/firstNightPrompt";
import type { LanguageCode } from "../../../lib/i18n/translations";
import { fallbackTimelineText } from "../../../lib/i18n/fallbackTimeline";
import type { OnboardingAnswers, SurvivalTimelinePayload } from "../../../lib/ai/types";
import { sampleTimeline } from "../../../lib/ai/types";

// Turns an offset in minutes-from-arrival into a 12-hour clock reading, e.g.
// arrivalTime "23:45" + 30 -> "12:15 AM". Falls back to midnight if the
// traveler's arrival time is missing or malformed, rather than throwing.
function clockAt(arrivalTime: string, minutesFromArrival: number): string {
  const [h, m] = arrivalTime.split(":").map(Number);
  const base = new Date(2000, 0, 1, h || 0, m || 0);
  base.setMinutes(base.getMinutes() + minutesFromArrival);

  let hours = base.getHours();
  const minutes = base.getMinutes();
  const period = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

  return `${hours}:${String(minutes).padStart(2, "0")} ${period}`;
}

function timeRange(arrivalTime: string, startMinutes: number, endMinutes: number): string {
  return `${clockAt(arrivalTime, startMinutes)} – ${clockAt(arrivalTime, endMinutes)}`;
}

function buildFallbackTimeline(
  answers: Partial<OnboardingAnswers>,
  language: LanguageCode,
): SurvivalTimelinePayload {
  const city = answers.city || "your destination";
  const hotel = answers.accommodation || "your accommodation";
  const arrivalTime = answers.arrivalTime || "00:00";
  const text = fallbackTimelineText[language] ?? fallbackTimelineText.en;

  return {
    title: text.title(city),
    summary: text.summary,
    steps: [
      {
        id: "arrival",
        time: timeRange(arrivalTime, 0, 30),
        title: text.arrivalTitle,
        description: text.arrivalDescription,
        riskLevel: "medium",
      },
      {
        id: "checkin",
        time: timeRange(arrivalTime, 30, 90),
        title: text.checkinTitle(hotel),
        description: text.checkinDescription,
        riskLevel: "low",
      },
      {
        id: "essentials",
        time: timeRange(arrivalTime, 90, 150),
        title: text.essentialsTitle,
        description: text.essentialsDescription,
        riskLevel: "low",
      },
      {
        id: "rest",
        time: timeRange(arrivalTime, 150, 240),
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
