import regionalPrices from "../data/regionalPrices.json";
import transportPrices from "../data/transportPrices.json";
import {
  PRICE_OVERPRICE_MULTIPLIER,
  PRICE_UNDERPRICE_MULTIPLIER,
} from "./thresholds";

type TransportPrice = {
  city: string;
  route: string;
  method: string;
  priceRangeVnd: number[];
};

type RegionalItem = {
  city: string;
  item: string;
  priceRangeVnd: number[];
};

type RegionalCatalog = { items: RegionalItem[] };

type RankedMatch = {
  label: string;
  min: number;
  max: number;
  overlap: number;
  distance: number;
};

const catalog = regionalPrices as RegionalCatalog;

function normalizeText(value: string) {
  return value.trim().toLowerCase();
}

export function extractVndAmount(text: string): number | null {
  const lower = text.toLowerCase().replace(/,/g, "");
  const trMatch = lower.match(/(\d+(?:\.\d+)?)\s*(tr|triệu|trieu)\b/);
  if (trMatch) return Math.round(parseFloat(trMatch[1]) * 1_000_000);
  const kMatch = lower.match(/(\d+(?:\.\d+)?)\s*k\b/);
  if (kMatch) return Math.round(parseFloat(kMatch[1]) * 1_000);
  const plainMatch = lower.match(/(\d{4,})/);
  if (plainMatch) return Number(plainMatch[1]);
  return null;
}

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
  ["phở", "pho"],
  ["phở bò", "pho"],
  ["cà phê", "coffee"],
  ["ca phe", "coffee"],
  ["cà phê sữa đá", "coffee"],
];

function expandAliases(text: string): string {
  let expanded = text;
  for (const [vi, en] of PLACE_ALIASES) {
    if (expanded.includes(vi)) expanded += ` ${en}`;
  }
  return expanded;
}

function significantWords(value: string): string[] {
  return normalizeText(value)
    .split(/[^a-zà-ỹ0-9]+/)
    .filter((word) => word.length >= 3);
}

function catalogProbeWords(item: string, city: string): string[] {
  const expanded = expandAliases(normalizeText(`${item} ${city}`));
  return [...new Set(significantWords(expanded))];
}

function overlapCount(haystack: string, words: string[]): number {
  return words.filter((word) => haystack.includes(word)).length;
}

function distanceToRange(amount: number, min: number, max: number): number {
  if (amount < min) return min - amount;
  if (amount > max) return amount - max;
  return 0;
}

export function scoreAgainstRange(
  amount: number,
  min: number,
  max: number,
): { overpriced: boolean; fair: boolean; trustScore: number } {
  const overpriced = amount > max * PRICE_OVERPRICE_MULTIPLIER;
  const fair =
    amount >= min * PRICE_UNDERPRICE_MULTIPLIER &&
    amount <= max * PRICE_OVERPRICE_MULTIPLIER;
  return {
    overpriced,
    fair,
    trustScore: overpriced ? 2 : fair ? 9 : 6,
  };
}

function pickBestMatch(amount: number, candidates: RankedMatch[]): RankedMatch | null {
  if (!candidates.length) return null;
  return candidates.reduce((best, entry) => {
    if (entry.overlap !== best.overlap) {
      return entry.overlap > best.overlap ? entry : best;
    }
    return entry.distance < best.distance ? entry : best;
  });
}

export type PriceAlarmResult = {
  alarmed: boolean;
  matched: boolean;
  amount: number | null;
  range: [number, number] | null;
  label: string;
};

/** Deterministic price alarm used in production fallback + FAR eval. */
export function evaluatePriceAlarm(subject: string): PriceAlarmResult {
  const amount = extractVndAmount(subject);
  if (!amount) {
    return { alarmed: false, matched: false, amount: null, range: null, label: "no-amount" };
  }

  const normalized = expandAliases(normalizeText(subject));
  const candidates: RankedMatch[] = [];

  for (const entry of transportPrices as TransportPrice[]) {
    const words = [
      ...significantWords(entry.route),
      ...significantWords(entry.city),
      ...significantWords(entry.method),
    ];
    const overlap = overlapCount(normalized, words);
    // Need a real route/place token, not a lone weak city hit.
    if (overlap < 2) continue;
    const [min, max] = entry.priceRangeVnd;
    candidates.push({
      label: `${entry.route} / ${entry.method}`,
      min,
      max,
      overlap,
      distance: distanceToRange(amount, min, max),
    });
  }

  for (const entry of catalog.items) {
    const words = catalogProbeWords(entry.item, entry.city);
    const overlap = overlapCount(normalized, words);
    if (overlap < 1) continue;
    // Food/goods: one strong item token is enough if present in the query.
    const [min, max] = entry.priceRangeVnd;
    candidates.push({
      label: entry.item,
      min,
      max,
      overlap: overlap + 1, // slight preference so "pho"/"coffee" beat loose place matches
      distance: distanceToRange(amount, min, max),
    });
  }

  const best = pickBestMatch(amount, candidates);
  if (!best) {
    return { alarmed: false, matched: false, amount, range: null, label: "no-match" };
  }

  const scored = scoreAgainstRange(amount, best.min, best.max);
  return {
    alarmed: scored.overpriced,
    matched: true,
    amount,
    range: [best.min, best.max],
    label: best.label,
  };
}
