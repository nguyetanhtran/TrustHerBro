import { LANGUAGE_NAMES, type LanguageCode } from "../../i18n/translations";

export function buildModeRouterPrompt(language: LanguageCode = "en") {
  const languageName = LANGUAGE_NAMES[language] ?? LANGUAGE_NAMES.en;

  return [
    "Classify the user's travel safety intent.",
    'Return valid JSON only with shape: {"mode":"assistant"|"first-night"|"safety"|"emergency","reason":string}.',
    `Write "reason" entirely in ${languageName}.`,
    "Choose emergency only for urgent harm or immediate crisis.",
  ].join(" ");
}
