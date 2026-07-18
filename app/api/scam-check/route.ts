import { NextResponse } from "next/server";
import { buildScamCheckPrompt } from "../../../lib/ai/prompts/scamCheckPrompt";
import scamWarnings from "../../../lib/data/scamWarnings.json";
import type { ScamCheckResult, ScamMatch, ScamPattern } from "../../../lib/ai/types";
import type { LanguageCode } from "../../../lib/i18n/translations";
import { applyScamGuard, keywordScamScore } from "../../../lib/eval/scamScore";
import { SCAM_CONFIDENCE_THRESHOLD } from "../../../lib/eval/thresholds";

const patterns = scamWarnings as ScamPattern[];
const patternById = new Map(patterns.map((pattern) => [pattern.id, pattern]));
const OPENAI_CHAT_URL = "https://api.openai.com/v1/chat/completions";

const DISCLAIMER =
  "This is guidance, not certainty. Most sellers and drivers are honest — use it to decide how to verify, not to accuse anyone.";

type RawScamResult = {
  isLikelyScam?: boolean;
  confidence?: number;
  matches?: { id: string; confidence?: number; why?: string }[];
  advice?: string;
};

function clamp01(value: unknown): number {
  const n = typeof value === "number" ? value : 0;
  return Math.min(1, Math.max(0, n));
}

function keywordFallback(description: string): RawScamResult {
  const scored = keywordScamScore(description);
  return {
    isLikelyScam: scored.isLikelyScam,
    confidence: scored.confidence,
    matches: scored.matchIds.map((id) => {
      const pattern = patternById.get(id);
      return {
        id,
        confidence: scored.confidence,
        why: pattern
          ? `Matches signals: ${pattern.signals.slice(0, 2).join("; ")}.`
          : "Matches a known catalog pattern.",
      };
    }),
    advice:
      scored.confidence >= SCAM_CONFIDENCE_THRESHOLD
        ? "This lines up with a known scam pattern. Follow the steps below and move to a safe, staffed place."
        : "Not enough to call it a scam. Verify the price/details calmly before deciding.",
  };
}

function resolveMatches(raw: RawScamResult): ScamMatch[] {
  const list = Array.isArray(raw.matches) ? raw.matches : [];
  return list
    .map((match) => {
      const pattern = patternById.get(match.id);
      if (!pattern) return null;
      return {
        id: pattern.id,
        title: pattern.title,
        confidence: clamp01(match.confidence),
        why: match.why ?? `Matches the ${pattern.title.toLowerCase()} pattern.`,
        howToHandle: pattern.howToHandle,
      } satisfies ScamMatch;
    })
    .filter((match): match is ScamMatch => Boolean(match))
    .sort((a, b) => b.confidence - a.confidence);
}

async function runScamCheckModel({
  description,
  image,
  language,
  fallback,
}: {
  description: string;
  image: string | null;
  language: LanguageCode;
  fallback: RawScamResult;
}): Promise<{ raw: RawScamResult; code: NonNullable<ScamCheckResult["code"]>; usedFallback: boolean }> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return { raw: fallback, code: "NO_API_KEY", usedFallback: true };

  const userContent = image
    ? [
        {
          type: "text",
          text:
            description.trim() ||
            "Look at this photo (receipt, menu, price board, meter, or message). Does it match a known scam pattern?",
        },
        { type: "image_url", image_url: { url: image } },
      ]
    : description;

  let response: Response;
  try {
    response = await fetch(OPENAI_CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: buildScamCheckPrompt(language) },
          { role: "user", content: userContent },
        ],
      }),
    });
  } catch {
    return { raw: fallback, code: image ? "VISION_FAILED" : "MODEL_FAILED", usedFallback: true };
  }

  if (!response.ok) {
    return { raw: fallback, code: image ? "VISION_FAILED" : "MODEL_FAILED", usedFallback: true };
  }
  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  if (typeof content !== "string") {
    return { raw: fallback, code: "MODEL_FAILED", usedFallback: true };
  }
  try {
    return { raw: JSON.parse(content) as RawScamResult, code: "OK", usedFallback: false };
  } catch {
    return { raw: fallback, code: "MODEL_FAILED", usedFallback: true };
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const description = String(body?.description ?? "");
  const image = typeof body?.image === "string" ? body.image : null;
  const language = (body?.language as LanguageCode) ?? "en";

  if (!description.trim() && !image) {
    return NextResponse.json(
      { error: "Description or a photo is required." },
      { status: 400 },
    );
  }

  const fallbackRaw = keywordFallback(description);

  let raw: RawScamResult;
  let code: NonNullable<ScamCheckResult["code"]> = "OK";
  let usedFallback = false;
  try {
    const model = await runScamCheckModel({
      description,
      image,
      language,
      fallback: fallbackRaw,
    });
    raw = model.raw;
    code = model.code;
    usedFallback = model.usedFallback;
  } catch {
    raw = fallbackRaw;
    code = "MODEL_FAILED";
    usedFallback = true;
  }

  const matches = resolveMatches(raw);
  const confidence = clamp01(raw.confidence);

  const isLikelyScam = applyScamGuard({
    isLikelyScam: raw.isLikelyScam,
    confidence,
    matchIds: matches.map((match) => match.id),
  });

  const result: ScamCheckResult = {
    isLikelyScam,
    confidence,
    matches,
    advice:
      raw.advice ??
      "Stay calm and verify the details before deciding — most interactions are legitimate.",
    disclaimer: DISCLAIMER,
    usedFallback,
    code,
  };

  return NextResponse.json(result);
}
