import transportPrices from "../../data/transportPrices.json";
import scamWarnings from "../../data/scamWarnings.json";
import communityReports from "../../data/communityReports.json";
import type { CatalogItem } from "../../data/priceCatalog";
import type { ScamPattern } from "../types";
import { LANGUAGE_NAMES, type LanguageCode } from "../../i18n/translations";

type TransportPrice = {
  city: string;
  route: string;
  method: string;
  priceRangeVnd: number[];
  etaMin: number;
  note?: string;
};

type CommunityReport = {
  city: string;
  subject: string;
  summary: string;
};

function formatVnd(value: number) {
  return value.toLocaleString("en-US");
}

export function buildTrustCheckPrompt(
  language: LanguageCode = "en",
  catalogItems: CatalogItem[] = [],
  catalogUpdatedAt = "n/a",
  catalogSource = "",
) {
  const languageName = LANGUAGE_NAMES[language] ?? LANGUAGE_NAMES.en;

  const transport = (transportPrices as TransportPrice[])
    .map(
      (entry) =>
        `- [${entry.city}] ${entry.route} via ${entry.method}: ${formatVnd(entry.priceRangeVnd[0])}-${formatVnd(entry.priceRangeVnd[1])} VND (~${entry.etaMin} min)${entry.note ? ` — ${entry.note}` : ""}`,
    )
    .join("\n");

  const goods = catalogItems
    .map(
      (entry) =>
        `- [${entry.city}] ${entry.item} (${entry.category}): ${formatVnd(entry.priceRangeVnd[0])}-${formatVnd(entry.priceRangeVnd[1])} VND${entry.note ? ` — ${entry.note}` : ""}${entry.source ? ` [source:${entry.source}]` : ""}`,
    )
    .join("\n");

  const scams = (scamWarnings as ScamPattern[])
    .map((entry) => `- ${entry.title} [${entry.category}]: ${entry.description}`)
    .join("\n");

  const reports = (communityReports as CommunityReport[])
    .map((entry) => `- [${entry.city}] ${entry.subject}: ${entry.summary}`)
    .join("\n");

  return [
    "You are a fair-price / trust-check assistant for solo female travelers in Vietnam.",
    `Write "verdict" and every string in "supportingReasons" and "warnings" entirely in ${languageName}.`,
    "The traveler may type a fare/quote OR attach ONLY a photo of a receipt, menu, price board, or meter (photo-only is allowed).",
    "If a photo is attached: OCR every visible item name and price first into extractedItems, then compare each to the reference ranges.",
    "Input may be Vietnamese, English, or mixed; shorthand like \"500k\" = 500,000 VND or \"1tr\" = 1,000,000 VND.",
    "Ground answers in the reference data — do not invent prices. Prefer saying \"not enough data\" over a false alarm.",
    "",
    `Reference data freshness: updated ${catalogUpdatedAt}. ${catalogSource}`,
    "",
    "Known transport fares:",
    transport,
    "",
    "Known food / goods reference prices (tourist areas + traveler overrides):",
    goods,
    "",
    "Known scam patterns:",
    scams,
    "",
    "Community reports from other female travelers:",
    reports,
    "",
    "Reasoning rules:",
    "- Compare quoted/photo prices to the closest matching range. Flag overpriced only if clearly above ~30% of the top of the range.",
    "- If within or near the range, say it looks fair and state the normal band.",
    "- Put the best catalog row label into groundingMatch (city + item + range).",
    "- If reference data does not cover the item, say so and suggest Grab estimate / another stall.",
    "",
    "trustScore: HIGH 8-10 fair; LOW 0-3 overpriced/scam; MID 4-7 uncertain.",
    "",
    "Return valid JSON only:",
    JSON.stringify({
      trustScore: "number 0-10",
      verdict: "short verdict with normal range when known",
      supportingReasons: ["short reasons grounded in reference data"],
      warnings: ["short warnings"],
      extractedItems: [{ name: "item from photo/text", priceVnd: 0 }],
      groundingMatch: "Phở bò · Hà Nội · 40000-70000 VND",
    }),
  ].join("\n");
}
