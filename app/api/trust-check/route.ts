import { NextResponse } from "next/server";
import { buildTrustCheckPrompt } from "../../../lib/ai/prompts/trustCheckPrompt";
import communityReports from "../../../lib/data/communityReports.json";
import scamWarnings from "../../../lib/data/scamWarnings.json";
import { formatCatalogMatch, loadPriceCatalog } from "../../../lib/data/priceCatalog";
import type { TrustCheckResult } from "../../../lib/ai/types";
import type { LanguageCode } from "../../../lib/i18n/translations";
import { evaluatePriceAlarm } from "../../../lib/eval/priceScore";

type RawTrustResult = {
  trustScore?: number;
  verdict?: string;
  supportingReasons?: string[];
  warnings?: string[];
  extractedItems?: Array<{ name?: string; priceVnd?: number }>;
  groundingMatch?: string;
};

const OPENAI_CHAT_URL = "https://api.openai.com/v1/chat/completions";

function formatVnd(value: number) {
  return value.toLocaleString("en-US");
}

function buildLiveEstimates(subject: string) {
  const q = encodeURIComponent(subject || "Vietnam taxi fare");
  return [
    {
      label: "Open Grab for a ride estimate",
      url: `https://www.grab.com/vn/en/transport/`,
    },
    {
      label: "Check the route on Google Maps",
      url: `https://www.google.com/maps/search/?api=1&query=${q}`,
    },
  ];
}

function buildFallback(subject: string, catalogUpdatedAt: string): {
  result: TrustCheckResult;
  priced: boolean;
} {
  const alarm = evaluatePriceAlarm(subject);
  const warnings = scamWarnings
    .filter((item) => {
      const n = subject.toLowerCase();
      return (
        item.title.toLowerCase().includes(n) ||
        n.includes(item.title.toLowerCase().slice(0, 12))
      );
    })
    .map((item) => item.title);

  if (alarm.matched && alarm.amount != null && alarm.range) {
    const [min, max] = alarm.range;
    const overpriced = alarm.alarmed;
    return {
      priced: true,
      result: {
        subject,
        trustScore: overpriced ? 2 : 9,
        verdict: overpriced
          ? `Overpriced — normal for ${alarm.label} is ${formatVnd(min)}-${formatVnd(max)} VND`
          : `Looks fair — normal for ${alarm.label} is ${formatVnd(min)}-${formatVnd(max)} VND`,
        supportingReasons: [
          `Typical range: ${formatVnd(min)}-${formatVnd(max)} VND.`,
          "We only flag prices that look clearly above the usual local range.",
        ],
        warnings,
        groundingMatches: [
          {
            label: alarm.label,
            rangeVnd: [min, max],
            updatedAt: catalogUpdatedAt,
            source: "catalog",
          },
        ],
        liveEstimates: buildLiveEstimates(subject),
      },
    };
  }

  const reports = communityReports
    .filter((item) => subject.toLowerCase().includes(item.subject.toLowerCase().slice(0, 8)))
    .map((item) => item.summary);

  return {
    priced: false,
    result: {
      subject,
      trustScore: warnings.length ? 2 : reports.length ? 8 : 6,
      verdict: warnings.length
        ? "Needs caution"
        : reports.length
          ? "Looks generally trusted"
          : "Not enough signal yet — compare with Grab or another stall",
      supportingReasons: [...reports, "Compared with typical local prices for this area."],
      warnings,
      liveEstimates: buildLiveEstimates(subject),
    },
  };
}

async function runTrustModel({
  subject,
  image,
  language,
  catalogItems,
  catalogUpdatedAt,
  catalogSource,
  fallback,
}: {
  subject: string;
  image: string | null;
  language: LanguageCode;
  catalogItems: Awaited<ReturnType<typeof loadPriceCatalog>>["items"];
  catalogUpdatedAt: string;
  catalogSource: string;
  fallback: TrustCheckResult;
}): Promise<{ raw: RawTrustResult; code: TrustCheckResult["code"]; usedFallback: boolean }> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return { raw: fallback, code: "NO_API_KEY", usedFallback: true };
  }

  const userContent = image
    ? [
        {
          type: "text",
          text:
            subject.trim() ||
            "Photo-only check: OCR every visible item name and VND price from this receipt/menu/price board/meter, fill extractedItems, then compare to catalog ranges.",
        },
        { type: "image_url", image_url: { url: image } },
      ]
    : subject;

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
          {
            role: "system",
            content: buildTrustCheckPrompt(language, catalogItems, catalogUpdatedAt, catalogSource),
          },
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
    return { raw: JSON.parse(content) as RawTrustResult, code: "OK", usedFallback: false };
  } catch {
    return { raw: fallback, code: "MODEL_FAILED", usedFallback: true };
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const subject = String(body?.subject ?? "");
  const image = typeof body?.image === "string" ? body.image : null;
  const language = (body?.language as LanguageCode) ?? "en";

  if (!subject.trim() && !image) {
    return NextResponse.json({ error: "Subject or a photo is required." }, { status: 400 });
  }

  const catalog = await loadPriceCatalog();
  const subjectForFallback =
    subject.trim() ||
    (image ? "Photo price check" : "");
  const { result: fallback, priced } = buildFallback(subjectForFallback, catalog.updatedAt);

  const { raw, code, usedFallback } = await runTrustModel({
    subject,
    image,
    language,
    catalogItems: catalog.items,
    catalogUpdatedAt: catalog.updatedAt,
    catalogSource: catalog.source,
    fallback,
  });

  const rawWarnings = Array.isArray(raw.warnings)
    ? raw.warnings.filter((item) => typeof item === "string" && item.trim().length > 0)
    : [];
  const rawReasons = Array.isArray(raw.supportingReasons)
    ? raw.supportingReasons.filter((item) => typeof item === "string" && item.trim().length > 0)
    : [];
  const warnings = rawWarnings.length > 0 ? rawWarnings : fallback.warnings;
  const supportingReasons = rawReasons.length > 0 ? rawReasons : fallback.supportingReasons;
  const verdict = raw.verdict?.trim() || fallback.verdict;

  const extractedItems = Array.isArray(raw.extractedItems)
    ? raw.extractedItems
        .map((entry) => ({
          name: String(entry?.name ?? "").trim(),
          priceVnd: Number(entry?.priceVnd),
        }))
        .filter((entry) => entry.name && Number.isFinite(entry.priceVnd) && entry.priceVnd > 0)
    : [];

  // Prefer deterministic catalog match when text/photo extract yields an amount+item.
  const probeText =
    subject.trim() ||
    extractedItems.map((entry) => `${entry.name} ${entry.priceVnd}`).join(" ");
  const alarm = evaluatePriceAlarm(probeText || subjectForFallback);
  const groundingMatches =
    alarm.matched && alarm.range
      ? [
          {
            label: alarm.label,
            rangeVnd: alarm.range,
            updatedAt: catalog.updatedAt,
            source: "catalog",
          },
        ]
      : fallback.groundingMatches;

  if (raw.groundingMatch?.trim() && (!groundingMatches || groundingMatches.length === 0)) {
    // Keep model citation as a soft match line in reasons.
    supportingReasons.unshift(raw.groundingMatch.trim());
  }

  const hasCommunitySignal = communityReports.some((item) =>
    (probeText || subjectForFallback)
      .toLowerCase()
      .includes(item.subject.toLowerCase().slice(0, 8)),
  );
  const trustScore = priced
    ? fallback.trustScore
    : alarm.matched
      ? alarm.alarmed
        ? 2
        : 9
      : warnings.length > 0
        ? Math.max(1, 3 - warnings.length)
        : hasCommunitySignal
          ? 9
          : 6;

  const result: TrustCheckResult = {
    subject: subject.trim() || (extractedItems[0] ? `${extractedItems[0].name} ${extractedItems[0].priceVnd}` : "Photo price check"),
    trustScore,
    verdict,
    supportingReasons,
    warnings,
    groundingMatches,
    extractedItems: extractedItems.length ? extractedItems : undefined,
    liveEstimates: buildLiveEstimates(probeText || subjectForFallback),
    usedFallback,
    code,
  };

  // Surface explicit citation string first in reasons when we have a match.
  if (groundingMatches?.[0]) {
    const cite = formatCatalogMatch({
      city: groundingMatches[0].city ?? "",
      category: "goods",
      item: groundingMatches[0].label,
      priceRangeVnd: groundingMatches[0].rangeVnd,
      updatedAt: groundingMatches[0].updatedAt,
      source: groundingMatches[0].source,
    });
    if (!result.supportingReasons.some((line) => line.startsWith("Matched:"))) {
      result.supportingReasons = [cite, ...result.supportingReasons];
    }
  }

  return NextResponse.json({
    ...result,
    catalogUpdatedAt: catalog.updatedAt,
    catalogSource: catalog.source,
  });
}
