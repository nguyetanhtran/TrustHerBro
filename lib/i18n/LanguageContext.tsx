"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import {
  LANGUAGE_NAMES,
  SUPPORTED_LANGUAGES,
  translations,
  type LanguageCode,
  type TranslationKey,
} from "./translations";

const STORAGE_KEY = "trustherbro:language";

type LanguageContextValue = {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  t: (key: TranslationKey) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>("en");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && (SUPPORTED_LANGUAGES as readonly string[]).includes(stored)) {
      setLanguageState(stored as LanguageCode);
    }
  }, []);

  function setLanguage(next: LanguageCode) {
    setLanguageState(next);
    localStorage.setItem(STORAGE_KEY, next);
  }

  function t(key: TranslationKey) {
    return translations[language][key];
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

export { LANGUAGE_NAMES, SUPPORTED_LANGUAGES };
export type { LanguageCode };
