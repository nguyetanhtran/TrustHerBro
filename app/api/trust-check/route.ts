import { NextResponse } from "next/server";
import { runOpenAIJson } from "../../../lib/ai/openai";
import { buildTrustCheckPrompt } from "../../../lib/ai/prompts/trustCheckPrompt";
import communityReports from "../../../lib/data/communityReports.json";
import scamWarnings from "../../../lib/data/scamWarnings.json";
import transportPrices from "../../../lib/data/transportPrices.json";
import type { TrustCheckResult } from "../../../lib/ai/types";
import type { LanguageCode } from "../../../lib/i18n/translations";

type TransportPrice = {
  city: string;
  route: string;
  method: string;
  priceRangeVnd: [number, number];
  etaMin: number;
  note?: string;
};

type RawTrustResult = {
  trustScore?: number;
  verdict?: string;
  supportingReasons?: string[];
  warnings?: string[];
};

function normalizeText(value: string) {
  return value.trim().toLowerCase();
}

function formatVnd(value: number) {
  return value.toLocaleString("en-US");
}

// Parses Vietnamese shorthand amounts: "500k" -> 500000, "1tr"/"1 triệu" -> 1000000,
// or a plain number of 4+ digits.
function extractVndAmount(text: string): number | null {
  const lower = text.toLowerCase();

  const trMatch = lower.match(/(\d+(?:[.,]\d+)?)\s*(tr|triệu|trieu)\b/);
  if (trMatch) return Math.round(parseFloat(trMatch[1].replace(",", ".")) * 1_000_000);

  const kMatch = lower.match(/(\d+(?:[.,]\d+)?)\s*k\b/);
  if (kMatch) return Math.round(parseFloat(kMatch[1].replace(",", ".")) * 1_000);

  const plainMatch = lower.match(/(\d{4,})/);
  if (plainMatch) return Number(plainMatch[1]);

  return null;
}

// Common Vietnamese names for the same places/routes used in transportPrices.json,
// so "500k đi Phố Cổ" matches the "Old Quarter" fare entries.
const PLACE_ALIASES: [string, string][] = [
  ["phố cổ", "old quarter"],
  ["pho co", "old quarter"],
  ["nội bài", "noi bai"],
  ["sân bay nội bài", "noi bai airport"],
  ["tân sơn nhất", "tan son nhat"],
  ["quận 1", "district 1"],
  ["quan 1", "district 1"],
  ["đà nẵng", "da nang"],
  ["sài gòn", "ho chi minh"],
  ["sai gon", "ho chi minh"],
];

function expandAliases(text: string): string {
  let expanded = text;
  for (const [vi, en] of PLACE_ALIASES) {
    if (expanded.includes(vi)) expanded += ` ${en}`;
  }
  return expanded;
}

function findMatchingFares(text: string): TransportPrice[] {
  const normalized = expandAliases(normalizeText(text));
  return (transportPrices as TransportPrice[]).filter((entry) => {
    const words = [
      ...normalizeText(entry.route).split(/[^a-zà-ỹ0-9]+/),
      ...normalizeText(entry.city).split(/[^a-zà-ỹ0-9]+/),
    ].filter((word) => word.length > 3);
    return words.some((word) => normalized.includes(word));
  });
}

function buildFallback(subject: string): { result: TrustCheckResult; priced: boolean } {
  const normalized = normalizeText(subject);
  const reports = communityReports.filter(
    (item) =>
      normalizeText(item.subject).includes(normalized) ||
      normalized.includes(normalizeText(item.subject)),
  );
  const warnings = scamWarnings.filter(
    (item) =>
      normalizeText(item.title).includes(normalized) ||
      normalizeText(item.description).includes(normalized),
  );

  const amount = extractVndAmount(subject);
  const fares = findMatchingFares(subject);

  if (amount && fares.length > 0) {
    // Pick the fare option the quoted amount actually fits closest to (e.g. a
    // Grab-range quote should compare against Grab, not the cheapest bus option).
    const distanceToRange = (entry: TransportPrice) => {
      const [min, max] = entry.priceRangeVnd;
      if (amount < min) return min - amount;
      if (amount > max) return amount - max;
      return 0;
    };
    const best = fares.reduce((a, b) => (distanceToRange(a) <= distanceToRange(b) ? a : b));
    const [min, max] = best.priceRangeVnd;
    const overpriced = amount > max * 1.3;
    const fair = amount >= min * 0.7 && amount <= max * 1.3;

    return {
      priced: true,
      result: {
        subject,
        trustScore: overpriced ? 2 : fair ? 9 : 6,
        verdict: overpriced
          ? `Overpriced — normal fare for ${best.route} is ${formatVnd(min)}-${formatVnd(max)} VND via ${best.method}`
          : `Looks fair — normal fare for ${best.route} is ${formatVnd(min)}-${formatVnd(max)} VND via ${best.method}`,
        supportingReasons: [
          `Reference fare (${best.method}, ${best.city}): ${formatVnd(min)}-${formatVnd(max)} VND, ~${best.etaMin} min.`,
          ...reports.map((item) => item.summary),
        ],
        warnings: warnings.map((item) => item.title),
      },
    };
  }

  const score = Math.min(10, Math.max(2, 10 - warnings.length * 2 + reports.length));
  return {
    priced: false,
    result: {
      subject,
      trustScore: Number(score.toFixed(1)),
      verdict:
        warnings.length > 0
          ? "Needs caution"
          : reports.length > 0
            ? "Looks generally trusted"
            : "Not enough signal yet",
      supportingReasons: reports.map((item) => item.summary),
      warnings: warnings.map((item) => item.title),
    },
  };
}

export async function POST(request: Request) {
  const body = await request.json();
  const subject = String(body?.subject ?? "");
  const language = (body?.language as LanguageCode) ?? "en";

  if (!subject.trim()) {
    return NextResponse.json(
      { error: "Subject is required." },
      { status: 400 },
    );
  }

  const { result: fallback, priced } = buildFallback(subject);

  let raw: RawTrustResult;
  try {
    raw = await runOpenAIJson<RawTrustResult>({
      systemPrompt: buildTrustCheckPrompt(language),
      userPrompt: subject,
      fallback,
    });
  } catch {
    raw = fallback;
  }

  const rawWarnings = Array.isArray(raw.warnings)
    ? raw.warnings.filter((item) => typeof item === "string" && item.trim().length > 0)
    : [];
  const rawReasons = Array.isArray(raw.supportingReasons)
    ? raw.supportingReasons.filter((item) => typeof item === "string" && item.trim().length > 0)
    : [];
  const warnings = rawWarnings.length > 0 ? rawWarnings : fallback.warnings;
  const supportingReasons = rawReasons.length > 0 ? rawReasons : fallback.supportingReasons;
  const verdict = raw.verdict?.trim() || fallback.verdict;

  // The model is reliable for text (verdict wording, semantic warning
  // matches) but not for the numeric trustScore — it sometimes reports a
  // high score for a situation its own verdict just called untrustworthy,
  // and it always writes *some* reasoning text even when there's no real
  // data (e.g. explaining that nothing matched). So the score always comes
  // from our own logic, anchored to our own keyword-matched reports rather
  // than the model's prose, never from the model's raw number.
  const hasReportSignal = fallback.supportingReasons.length > 0;
  const trustScore = priced
    ? fallback.trustScore
    : warnings.length > 0
      ? Math.max(1, 3 - warnings.length)
      : hasReportSignal
        ? 9
        : 6;

  const result: TrustCheckResult = {
    subject,
    trustScore,
    verdict,
    supportingReasons,
    warnings,
  };

  return NextResponse.json(result);
}
