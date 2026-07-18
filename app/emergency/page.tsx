"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import emergencyContacts from "../../lib/data/emergencyContacts.json";
import { useLanguage } from "../../lib/i18n/LanguageContext";
import { theme } from "../../lib/theme";
import { PrivacyNotice } from "../../components/shared/PrivacyNotice";

const cardStyle: CSSProperties = {
  padding: 16,
  borderRadius: theme.borderRadius.card,
  background: theme.colors.card,
  border: `1px solid ${theme.colors.border}`,
  boxShadow: theme.shadows.soft,
  marginTop: 12,
  color: theme.colors.text,
};

const sosButtonStyle: CSSProperties = {
  display: "block",
  padding: "18px 16px",
  borderRadius: theme.borderRadius.card,
  border: "none",
  cursor: "pointer",
  fontSize: 20,
  fontWeight: 800,
  textAlign: "center",
  textDecoration: "none",
  background: theme.colors.primary,
  color: "#ffffff",
  boxShadow: theme.shadows.soft,
};

const numberButtonStyle: CSSProperties = {
  display: "block",
  padding: "14px 14px",
  borderRadius: theme.borderRadius.button,
  border: `1px solid ${theme.colors.border}`,
  fontSize: 16,
  fontWeight: 700,
  textAlign: "center",
  textDecoration: "none",
  background: "rgba(196, 163, 90, 0.12)",
  color: theme.colors.primary,
  fontFamily: "inherit",
};

const translateLinkStyle: CSSProperties = {
  display: "block",
  marginTop: 12,
  padding: "14px 16px",
  borderRadius: theme.borderRadius.button,
  border: `1px solid ${theme.colors.primary}`,
  background: "rgba(155, 44, 31, 0.08)",
  color: theme.colors.primary,
  fontWeight: 700,
  textAlign: "center",
  textDecoration: "none",
};

export default function EmergencyPage() {
  const { t } = useLanguage();

  return (
    <main
      style={{
        maxWidth: 560,
        margin: "0 auto",
        padding: "40px 24px 72px",
        boxSizing: "border-box",
        width: "100%",
      }}
    >
      <h1
        style={{
          margin: "0 0 16px",
          color: theme.colors.text,
          fontSize: "clamp(26px, 4vw, 34px)",
          fontWeight: 800,
        }}
      >
        {t("emergency.title")}
      </h1>

      <a href="tel:113" style={sosButtonStyle}>
        {t("emergency.sos")}
      </a>

      <Link href="/translate?incident=1" style={translateLinkStyle}>
        {t("emergency.translateCta")} →
      </Link>

      <section style={cardStyle}>
        <strong>{t("emergency.localNumbers")}</strong>
        <div style={{ display: "grid", gap: 10, marginTop: 10 }}>
          {emergencyContacts.localEmergencyNumbers.map((entry) => (
            <a key={entry.number} href={`tel:${entry.number}`} style={numberButtonStyle}>
              {entry.label} - {entry.number}
            </a>
          ))}
        </div>
      </section>

      <section style={cardStyle}>
        <strong>{t("emergency.touristHotlines")}</strong>
        <div style={{ display: "grid", gap: 10, marginTop: 10 }}>
          {emergencyContacts.touristSupportNumbers.map((entry) => (
            <a
              key={entry.number}
              href={`tel:${entry.number.replace(/\s/g, "")}`}
              style={numberButtonStyle}
            >
              {entry.label} - {entry.number}
            </a>
          ))}
        </div>
      </section>

      <section style={cardStyle}>
        <strong>{t("emergency.showLocal")}</strong>
        <p style={{ fontSize: 18, fontWeight: 700, marginBottom: 4, color: theme.colors.text }}>
          {emergencyContacts.helpPhrase.vietnamese}
        </p>
        <p style={{ color: theme.colors.textLight, marginBottom: 0 }}>{t("emergency.helpPhrase")}</p>
      </section>

      <section style={cardStyle}>
        <strong>{t("emergency.nearestHospital")}</strong>
        <p style={{ color: theme.colors.textLight }}>{emergencyContacts.hospitalGuidance}</p>
        <div style={{ display: "grid", gap: 10 }}>
          {emergencyContacts.hospitals.map((hospital) => (
            <a
              key={`${hospital.name}-${hospital.city}`}
              href={`tel:${hospital.phone.replace(/\s/g, "")}`}
              style={numberButtonStyle}
            >
              {hospital.name} ({hospital.city}) - {hospital.phone}
            </a>
          ))}
        </div>
      </section>

      <section style={cardStyle}>
        <strong>{t("emergency.embassyContact")}</strong>
        <p style={{ color: theme.colors.textLight }}>{emergencyContacts.embassyGuidance}</p>
        <div style={{ display: "grid", gap: 10 }}>
          {emergencyContacts.embassies.map((embassy) => (
            <a
              key={`${embassy.country}-${embassy.city}`}
              href={`tel:${embassy.phone.replace(/\s/g, "")}`}
              style={numberButtonStyle}
            >
              {embassy.country} ({embassy.city}) - {embassy.phone}
            </a>
          ))}
        </div>
      </section>

      <div style={{ marginTop: 16 }}>
        <PrivacyNotice what={t("safety.privacyWhat")} />
      </div>
    </main>
  );
}
