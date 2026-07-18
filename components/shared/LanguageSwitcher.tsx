"use client";

import { LANGUAGE_NAMES, SUPPORTED_LANGUAGES, useLanguage } from "../../lib/i18n/LanguageContext";
import { theme } from "../../lib/theme";

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <label style={{ display: "grid", gap: 8, marginBottom: 4, minWidth: 0 }}>
      <span style={{ fontWeight: 600, color: theme.colors.text }}>{t("language.label")}</span>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", minWidth: 0, maxWidth: "100%" }}>
        {SUPPORTED_LANGUAGES.map((code) => {
          const selected = code === language;
          return (
            <button
              key={code}
              type="button"
              onClick={() => setLanguage(code)}
              style={{
                padding: "8px 14px",
                borderRadius: 999,
                border: selected
                  ? `2px solid ${theme.colors.primary}`
                  : `1px solid ${theme.colors.border}`,
                background: selected ? "rgba(155, 44, 31, 0.08)" : theme.colors.card,
                color: theme.colors.text,
                fontWeight: selected ? 700 : 500,
                cursor: "pointer",
                fontFamily: "inherit",
                boxSizing: "border-box",
              }}
            >
              {LANGUAGE_NAMES[code]}
            </button>
          );
        })}
      </div>
    </label>
  );
}
