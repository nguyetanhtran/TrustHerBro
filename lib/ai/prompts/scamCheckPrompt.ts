import scamWarnings from "../../data/scamWarnings.json";
import type { ScamPattern } from "../types";

export function buildScamCheckPrompt() {
  const catalog = (scamWarnings as ScamPattern[])
    .map(
      (pattern) =>
        `- ${pattern.id} [${pattern.category}]: ${pattern.title} — signals: ${pattern.signals.join("; ")}`,
    )
    .join("\n");

  return [
    "You help a tourist in Vietnam figure out if a situation they describe is a known scam.",
    "The description may be spoken and transcribed, in any language, and may be vague or worded very differently from the catalog — reason about the meaning, not the exact words.",
    "Match it against the scam-pattern catalog below and return the pattern ids that genuinely fit.",
    "",
    "IMPORTANT — avoid false alarms. Most sellers and drivers are honest. Only set isLikelyScam true when the described signals clearly point to a scam.",
    "If the situation is ambiguous or could easily be legitimate, use low confidence, return few or no matches, and give calm advice on how to verify rather than accusing anyone.",
    "Confidence is 0-1. Be conservative: uncertain -> low confidence.",
    "",
    "Scam-pattern catalog:",
    catalog,
    "",
    "Return valid JSON only, matching this exact shape:",
    JSON.stringify({
      isLikelyScam: "boolean",
      confidence: "number 0-1 overall",
      matches: [
        {
          id: "id-from-catalog",
          confidence: "number 0-1",
          why: "one short sentence on why it matches",
        },
      ],
      advice: "one or two calm, balanced sentences on what to do next",
    }),
  ].join("\n");
}
