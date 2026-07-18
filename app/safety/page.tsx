"use client";

import type { CSSProperties } from "react";
import { SafetyChat } from "../../components/safety/SafetyChat";
import { useLanguage } from "../../lib/i18n/LanguageContext";

const pageStyle: CSSProperties = {
  maxWidth: 960,
  margin: "0 auto",
  padding: "40px 24px 72px",
};

export default function SafetyPage() {
  const { t } = useLanguage();

  return (
    <main style={pageStyle}>
      <h1>{t("safetyPage.title")}</h1>
      <p style={{ lineHeight: 1.7, color: "#475569" }}>{t("safetyPage.description")}</p>
      <SafetyChat />
    </main>
  );
}
