import scamWarnings from "../data/scamWarnings.json";
import type { ScamPattern } from "../types";
import { SCAM_CONFIDENCE_THRESHOLD } from "./thresholds";

const patterns = scamWarnings as ScamPattern[];

export type RawScamEval = {
  isLikelyScam: boolean;
  confidence: number;
  matchIds: string[];
};

function clamp01(value: unknown): number {
  const n = typeof value === "number" ? value : 0;
  return Math.min(1, Math.max(0, n));
}

/** A signal counts only if enough of its distinctive words appear (cuts false alarms). */
function signalHits(signal: string, text: string): boolean {
  const words = signal
    .toLowerCase()
    .split(/[^a-z]+/)
    .filter((word) => word.length > 4);
  if (words.length === 0) return false;
  const matched = words.filter((word) => text.includes(word)).length;
  if (words.length === 1) return matched === 1;
  return matched >= 2;
}

/** Offline keyword scorer — same conservative logic as /api/scam-check fallback. */
export function keywordScamScore(description: string): RawScamEval {
  const text = description.toLowerCase();
  const scored = patterns
    .map((pattern) => {
      const hits = pattern.signals.filter((signal) => signalHits(signal, text)).length;
      return { pattern, hits };
    })
    .filter((entry) => entry.hits > 0)
    .sort((a, b) => b.hits - a.hits)
    .slice(0, 3);

  const top = scored[0]?.hits ?? 0;
  // Need at least two signal hits before we even approach the alarm threshold.
  const confidence = clamp01(top >= 2 ? 0.65 : top === 1 ? 0.35 : 0);

  return {
    isLikelyScam: confidence >= SCAM_CONFIDENCE_THRESHOLD,
    confidence,
    matchIds: scored.map((entry) => entry.pattern.id),
  };
}

/** Production false-alarm gate: confidence + at least one catalog match. */
export function applyScamGuard(raw: {
  isLikelyScam?: boolean;
  confidence?: number;
  matchIds: string[];
}): boolean {
  const confidence = clamp01(raw.confidence);
  return (
    Boolean(raw.isLikelyScam) &&
    confidence >= SCAM_CONFIDENCE_THRESHOLD &&
    raw.matchIds.length > 0
  );
}

export function evaluateScamAlarm(description: string): {
  alarmed: boolean;
  confidence: number;
  matchIds: string[];
} {
  const raw = keywordScamScore(description);
  return {
    alarmed: applyScamGuard(raw),
    confidence: raw.confidence,
    matchIds: raw.matchIds,
  };
}
