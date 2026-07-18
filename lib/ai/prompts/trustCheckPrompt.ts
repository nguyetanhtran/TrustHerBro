import transportPrices from "../../data/transportPrices.json";
import scamWarnings from "../../data/scamWarnings.json";
import communityReports from "../../data/communityReports.json";
import type { ScamPattern } from "../types";

type TransportPrice = {
  city: string;
  route: string;
  method: string;
  priceRangeVnd: [number, number];
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

export function buildTrustCheckPrompt() {
  const prices = (transportPrices as TransportPrice[])
    .map(
      (entry) =>
        `- [${entry.city}] ${entry.route} via ${entry.method}: ${formatVnd(entry.priceRangeVnd[0])}-${formatVnd(entry.priceRangeVnd[1])} VND (~${entry.etaMin} min)${entry.note ? ` — ${entry.note}` : ""}`,
    )
    .join("\n");

  const scams = (scamWarnings as ScamPattern[])
    .map((entry) => `- ${entry.title} [${entry.category}]: ${entry.description}`)
    .join("\n");

  const reports = (communityReports as CommunityReport[])
    .map((entry) => `- [${entry.city}] ${entry.subject}: ${entry.summary}`)
    .join("\n");

  return [
    "You are a trust-check assistant for solo female travelers in Vietnam.",
    'The traveler describes a price, place, or situation (e.g. "500k đi Phố Cổ" = 500,000 VND to Old Quarter, a hotel name, a stranger\'s offer). Input may be Vietnamese, English, or mixed, and may use shorthand like "500k" for 500,000 VND or "1tr" for 1,000,000 VND.',
    "Ground your answer in the reference data below — do not invent prices, places, or facts that aren't supported by it.",
    "",
    "Known transport fares:",
    prices,
    "",
    "Known scam patterns:",
    scams,
    "",
    "Community reports from other female travelers:",
    reports,
    "",
    "Reasoning rules:",
    "- If a price and a route/place are both mentioned, compare the price to the closest matching fare range above. If it's clearly above the range (roughly 30%+ over the top), call it overpriced and state the normal range and method. If it's within or near the range, say it looks fair.",
    "- If the situation matches a known scam pattern's signals, name that pattern in the warnings.",
    "- If community reports mention the subject or a very similar place, weave in a short, relevant reason.",
    "- If there isn't enough matching reference data for a firm answer, say so plainly instead of guessing, and reflect that uncertainty with a mid-range trustScore.",
    "",
    "trustScore rules — read carefully, this is the most common mistake:",
    "trustScore measures how much the traveler can TRUST the situation. It is NOT a danger/concern/severity score, so it does NOT go up when something is more alarming.",
    "- HIGH trustScore (8-10) = safe, fair, trustworthy. Use this for a fair price or a positive community report.",
    "- LOW trustScore (0-3) = do NOT trust this. Use this for an overpriced quote OR a situation matching a scam pattern — a scam match must always score LOW, e.g. 1-2, never high.",
    "- MID trustScore (4-7) = mixed signal or not enough data.",
    'Worked example: subject "driver refuses to use the meter" matches the taxi-meter-refusal scam pattern, so trustScore must be LOW (e.g. 1), verdict should warn the traveler, and warnings should include "Taxi meter refusal". A score of 8+ here would be wrong.',
    "",
    "Return valid JSON only, matching this exact shape:",
    JSON.stringify({
      trustScore: "number 0-10",
      verdict: "short verdict, e.g. 'Overpriced — normal fare is 180,000-220,000 VND via Grab'",
      supportingReasons: ["short reason strings grounded in the reference data above"],
      warnings: ["short warning strings, e.g. matched scam pattern titles"],
    }),
  ].join("\n");
}
