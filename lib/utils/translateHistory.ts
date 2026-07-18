export type TranslateSpeaker = "traveler" | "local";

export type TranslateMessage = {
  id: string;
  speaker: TranslateSpeaker;
  originalText: string;
  translatedText: string;
  suggestedPlace: string | null;
  timestamp: number;
};

const STORAGE_KEY = "trustherbro:translateHistory";

// localStorage (not sessionStorage) on purpose — this history is meant to
// last the whole trip across multiple visits, not just one browser tab.
export function loadTranslateHistory(): TranslateMessage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as TranslateMessage[]) : [];
  } catch {
    return [];
  }
}

export function appendTranslateMessage(message: TranslateMessage): TranslateMessage[] {
  const history = [...loadTranslateHistory(), message];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  return history;
}

export function searchTranslateHistory(
  history: TranslateMessage[],
  query: string,
): TranslateMessage[] {
  const q = query.trim().toLowerCase();
  if (!q) return history;
  return history.filter(
    (message) =>
      message.originalText.toLowerCase().includes(q) ||
      message.translatedText.toLowerCase().includes(q),
  );
}
