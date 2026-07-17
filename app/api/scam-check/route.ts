import { NextResponse } from "next/server";
import { runOpenAIJson } from "../../../lib/ai/openai";
import { buildScamCheckPrompt } from "../../../lib/ai/prompts/scamCheckPrompt";
import scamWarnings from "../../../lib/data/scamWarnings.json";
import type { ScamCheckResult, ScamMatch, ScamPattern } from "../../../lib/ai/types";

const patterns = scamWarnings as ScamPattern[];
const patternById = new Map(patterns.map((pattern) => [pattern.id, pattern]));

const DISCLAIMER =
  "This is guidance, not certainty. Most sellers and drivers are honest — use it to decide how to verify, not to accuse anyone.";

// Raw shape the model returns before we enrich it from the catalog.
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

// Offline fallback: score each pattern by how many of its signal words appear
// in the description. Deliberately conservative so it doesn't over-flag.
function keywordFallback(description: string): RawScamResult {
  const text = description.toLowerCase();
  const scored = patterns
    .map((pattern) => {
      const hits = pattern.signals.filter((signal) =>
        signal
          .toLowerCase()
          .split(/[^a-z]+/)
          .filter((word) => word.length > 4)
          .some((word) => text.includes(word)),
      ).length;
      return { pattern, hits };
    })
    .filter((entry) => entry.hits > 0)
    .sort((a, b) => b.hits - a.hits)
    .slice(0, 3);

  const top = scored[0]?.hits ?? 0;
  const confidence = clamp01(top >= 2 ? 0.6 : top === 1 ? 0.35 : 0);

  return {
    isLikelyScam: confidence >= 0.6,
    confidence,
    matches: scored.map((entry) => ({
      id: entry.pattern.id,
      confidence: clamp01(entry.hits >= 2 ? 0.6 : 0.35),
      why: `Matches signals: ${entry.pattern.signals.slice(0, 2).join("; ")}.`,
    })),
    advice:
      confidence >= 0.6
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

export async function POST(request: Request) {
  const body = await request.json();
  const description = String(body?.description ?? "");

  if (!description.trim()) {
    return NextResponse.json(
      { error: "Description is required." },
      { status: 400 },
    );
  }

  const fallbackRaw = keywordFallback(description);

  let raw: RawScamResult;
  try {
    raw = await runOpenAIJson<RawScamResult>({
      systemPrompt: buildScamCheckPrompt(),
      userPrompt: description,
      fallback: fallbackRaw,
    });
  } catch {
    raw = fallbackRaw;
  }

  const matches = resolveMatches(raw);
  const confidence = clamp01(raw.confidence);

  // Guard against false alarms: only call it a scam on strong signal.
  const isLikelyScam = Boolean(raw.isLikelyScam) && confidence >= 0.6 && matches.length > 0;

  const result: ScamCheckResult = {
    isLikelyScam,
    confidence,
    matches,
    advice:
      raw.advice ??
      "Stay calm and verify the details before deciding — most interactions are legitimate.",
    disclaimer: DISCLAIMER,
  };

  return NextResponse.json(result);
}
