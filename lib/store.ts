import type { OnboardingAnswers } from "./ai/types";

const STORAGE_KEY = "trustherbro:onboarding";

export function saveOnboardingAnswers(answers: OnboardingAnswers) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
}

export function loadOnboardingAnswers(): OnboardingAnswers | null {
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  return JSON.parse(raw) as OnboardingAnswers;
}

export function clearOnboardingAnswers() {
  sessionStorage.removeItem(STORAGE_KEY);
}
