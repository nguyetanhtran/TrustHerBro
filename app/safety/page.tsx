"use client";

import type { CSSProperties } from "react";
import { SafetyChat } from "../../components/safety/SafetyChat";
import { useLanguage } from "../../lib/i18n/LanguageContext";
import { theme } from "../../lib/theme";

const pageStyle: CSSProperties = {
  maxWidth: 960,
  margin: "0 auto",
  padding: "40px 24px 72px",
};

export default function SafetyPage() {
  const { t } = useLanguage();

  return (
    <main style={pageStyle}>
      <h1
        style={{
          margin: "0 0 8px",
          color: theme.colors.text,
          fontSize: "clamp(26px, 4vw, 34px)",
          fontWeight: 800,
        }}
      >
        {t("safetyPage.title")}
      </h1>
      <p style={{ lineHeight: 1.7, color: theme.colors.textLight, margin: "0 0 20px" }}>
        {t("safetyPage.description")}
      </p>
      <SafetyChat />
    </main>
  );
}
