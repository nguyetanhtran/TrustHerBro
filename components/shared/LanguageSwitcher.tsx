"use client";

import { LANGUAGE_NAMES, SUPPORTED_LANGUAGES, useLanguage } from "../../lib/i18n/LanguageContext";

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <label style={{ display: "grid", gap: 8, marginBottom: 20 }}>
      <span style={{ fontWeight: 600 }}>{t("language.label")}</span>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {SUPPORTED_LANGUAGES.map((code) => (
          <button
            key={code}
            type="button"
            onClick={() => setLanguage(code)}
            style={{
              padding: "8px 14px",
              borderRadius: 999,
              border: code === language ? "2px solid #ea580c" : "1px solid #cbd5e1",
              background: code === language ? "#fff7ed" : "#ffffff",
              fontWeight: code === language ? 700 : 500,
              cursor: "pointer",
            }}
          >
            {LANGUAGE_NAMES[code]}
          </button>
        ))}
      </div>
    </label>
  );
}
