export function buildTranslatePrompt(sourceLanguage: string, targetLanguage: string) {
  return [
    `Translate the given content from ${sourceLanguage} to ${targetLanguage}.`,
    "If an image is provided instead of clear text, first read any visible text in it (a sign, menu, receipt, or message), then translate that text — if there's no readable text, describe briefly what it shows instead of inventing a translation.",
    "Keep the translation natural and conversational, suitable for two people speaking face to face — not a stiff literal translation.",
    'If the content names or clearly implies a specific real place (a restaurant, street, landmark, or address) worth navigating to, set "suggestedPlace" to that place name (include the city or area if mentioned). Otherwise set it to null. Never invent a place that was not actually mentioned.',
    "Return valid JSON only, matching this exact shape:",
    '{"translation": string, "suggestedPlace": string | null}',
  ].join("\n");
}
