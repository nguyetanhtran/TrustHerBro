"use client";

import type { CSSProperties } from "react";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  AssistantActionCards,
  type AssistantSuggestionId,
} from "../../components/assistant/AssistantActionCards";
import { FairPriceCheck } from "../../components/assistant/FairPriceCheck";
import { VoiceScamCheck } from "../../components/assistant/VoiceScamCheck";
import { useLanguage } from "../../lib/i18n/LanguageContext";
import { theme } from "../../lib/theme";

const cardStyle: CSSProperties = {
  padding: 20,
  borderRadius: theme.borderRadius.card,
  background: theme.colors.card,
  border: `1px solid ${theme.colors.border}`,
  boxShadow: theme.shadows.soft,
  marginTop: 16,
  color: theme.colors.text,
};

function AssistantContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";
  const initialMode = (searchParams.get("mode") as AssistantSuggestionId | null) ?? null;

  const [active, setActive] = useState<AssistantSuggestionId>(
    initialMode === "compare" || initialQuery ? "compare" : "scam",
  );
  const [suggestedText, setSuggestedText] = useState(initialQuery);
  const [suggestionKey, setSuggestionKey] = useState(0);

  function handlePick(id: AssistantSuggestionId, prompt: string) {
    setActive(id);
    setSuggestedText(prompt);
    setSuggestionKey((key) => key + 1);
  }

  return (
    <main style={{ maxWidth: 860, margin: "0 auto", padding: "40px 24px 72px" }}>
      <h1
        style={{
          margin: "0 0 8px",
          fontSize: "clamp(26px, 4vw, 34px)",
          color: theme.colors.text,
          fontWeight: 800,
        }}
      >
        {t("assistant.title")}
      </h1>
      <p style={{ margin: "0 0 16px", color: theme.colors.textLight, lineHeight: 1.55 }}>
        {t("assistant.description")}
      </p>

      <AssistantActionCards active={active} onPick={handlePick} />

      {active === "compare" ? (
        <FairPriceCheck key={`price-${suggestionKey}`} suggestedText={suggestedText} />
      ) : (
        <VoiceScamCheck key={`scam-${suggestionKey}`} suggestedText={suggestedText} />
      )}

      <section style={cardStyle}>
        <strong style={{ color: theme.colors.primary }}>Q:</strong> {t("assistant.qa1Question")}
        <p style={{ margin: "8px 0 0", color: theme.colors.textLight }}>
          <strong style={{ color: theme.colors.text }}>A:</strong> {t("assistant.qa1Answer")}
        </p>
      </section>

      <section style={cardStyle}>
        <strong style={{ color: theme.colors.primary }}>Q:</strong> {t("assistant.qa2Question")}
        <p style={{ margin: "8px 0 0", color: theme.colors.textLight }}>
          <strong style={{ color: theme.colors.text }}>A:</strong> {t("assistant.qa2Answer")}
        </p>
      </section>
    </main>
  );
}

export default function AssistantPage() {
  return (
    <Suspense
      fallback={
        <div style={{ textAlign: "center", padding: 40, color: theme.colors.textLight }}>
          Loading...
        </div>
      }
    >
      <AssistantContent />
    </Suspense>
  );
}
