// Languages prioritized by the brief (Korean, Chinese, English, Russian) plus
// Vietnamese. `greeting` lets the Welcome step react to the chosen language so
// the choice visibly does something before full app i18n is wired up.
export const LANGUAGES = [
  { code: "en", label: "English", greeting: "Welcome" },
  { code: "ko", label: "한국어", greeting: "환영합니다" },
  { code: "zh", label: "中文", greeting: "欢迎" },
  { code: "ru", label: "Русский", greeting: "Добро пожаловать" },
  { code: "vi", label: "Tiếng Việt", greeting: "Chào mừng" },
] as const;

export type LanguageCode = (typeof LANGUAGES)[number]["code"];

export const DEFAULT_LANGUAGE: LanguageCode = "en";

export function greetingFor(code: string): string {
  return LANGUAGES.find((lang) => lang.code === code)?.greeting ?? "Welcome";
}

// Travel interests used to personalize suggestions later on.
export const INTERESTS = [
  "Food",
  "Culture",
  "Nightlife",
  "Nature",
  "Shopping",
  "History",
] as const;

export type Interest = (typeof INTERESTS)[number];
