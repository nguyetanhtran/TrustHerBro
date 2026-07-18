"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { ModeIndicator } from "../mode-switch/ModeIndicator";
import { CompanionChat } from "./CompanionChat";
import { NearbySuggestions } from "./NearbySuggestions";
import { useLanguage } from "../../lib/i18n/LanguageContext";

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 16,
  marginTop: 24,
};

const cardStyle: CSSProperties = {
  display: "block",
  padding: 20,
  borderRadius: 18,
  background: "#ffffff",
  color: "#172554",
  textDecoration: "none",
  border: "1px solid #e2e8f0",
};

export function HomeContent({ todos }: { todos: { id: string | number; name: string }[] | null }) {
  const { t } = useLanguage();

  return (
    <>
      <ModeIndicator mode="companion" label={t("home.entryMode")} />
      <h1 style={{ fontSize: 48, lineHeight: 1.05, marginBottom: 12 }}>TrustHerBro</h1>
      <p style={{ fontSize: 18, lineHeight: 1.6, maxWidth: 700 }}>{t("home.heroDescription")}</p>

      <div style={{ marginTop: 24 }}>
        <CompanionChat />
      </div>

      <NearbySuggestions />

      <section
        style={{
          marginTop: 20,
          padding: 18,
          borderRadius: 18,
          background: "#f8fafc",
          border: "1px solid #e2e8f0",
        }}
      >
        <strong>{t("home.todosLabel")}</strong>
        <ul style={{ marginBottom: 0 }}>
          {todos?.map((todo) => <li key={todo.id}>{todo.name}</li>) ?? (
            <li>{t("home.noTodos")}</li>
          )}
        </ul>
      </section>

      <div style={gridStyle}>
        <Link href="/onboarding" style={cardStyle}>
          <strong>{t("home.cardFirstNight")}</strong>
          <p>{t("home.cardFirstNightDesc")}</p>
        </Link>
        <Link href="/timeline" style={cardStyle}>
          <strong>{t("home.cardTimeline")}</strong>
          <p>{t("home.cardTimelineDesc")}</p>
        </Link>
        <Link href="/safety" style={cardStyle}>
          <strong>{t("home.cardSafety")}</strong>
          <p>{t("home.cardSafetyDesc")}</p>
        </Link>
        <Link href="/assistant" style={cardStyle}>
          <strong>{t("home.cardAssistant")}</strong>
          <p>{t("home.cardAssistantDesc")}</p>
        </Link>
        <Link href="/emergency" style={cardStyle}>
          <strong>{t("home.cardEmergency")}</strong>
          <p>{t("home.cardEmergencyDesc")}</p>
        </Link>
      </div>
    </>
  );
}
