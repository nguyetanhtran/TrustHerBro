"use client";

import type { CSSProperties } from "react";
import { useLanguage } from "../../lib/i18n/LanguageContext";

const pageStyle: CSSProperties = {
  maxWidth: 760,
  margin: "0 auto",
  padding: "40px 24px 72px",
  lineHeight: 1.7,
};

const cardStyle: CSSProperties = {
  padding: 20,
  borderRadius: 18,
  background: "#ffffff",
  border: "1px solid #e2e8f0",
  marginTop: 16,
};

export default function PrivacyPage() {
  const { t } = useLanguage();

  return (
    <main style={pageStyle}>
      <h1>{t("privacy.title")}</h1>
      <p style={{ color: "#475569" }}>{t("privacy.intro")}</p>

      <section style={cardStyle}>
        <h3 style={{ marginTop: 0 }}>{t("privacy.sendTitle")}</h3>
        <ul style={{ marginBottom: 0 }}>
          <li>{t("privacy.sendWords")}</li>
          <li>{t("privacy.sendLocation")}</li>
        </ul>
      </section>

      <section style={cardStyle}>
        <h3 style={{ marginTop: 0 }}>{t("privacy.dontTitle")}</h3>
        <ul style={{ marginBottom: 0 }}>
          <li>{t("privacy.dontAccount")}</li>
          <li>{t("privacy.dontSell")}</li>
          <li>{t("privacy.dontTrack")}</li>
        </ul>
      </section>

      <section style={cardStyle}>
        <h3 style={{ marginTop: 0 }}>{t("privacy.controlTitle")}</h3>
        <ul style={{ marginBottom: 0 }}>
          <li>{t("privacy.controlNoLocation")}</li>
          <li>{t("privacy.controlSafetyOff")}</li>
          <li>{t("privacy.controlCoverDetails")}</li>
        </ul>
      </section>

      <p style={{ color: "#94a3b8", marginTop: 24 }}>{t("privacy.disclaimer")}</p>
    </main>
  );
}
