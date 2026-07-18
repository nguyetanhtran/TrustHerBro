"use client";

import type { CSSProperties } from "react";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import type { TrustCheckResult } from "../../lib/ai/types";
import { ChatInput } from "../../components/shared/ChatInput";
import { TrustBadge } from "../../components/shared/TrustBadge";
import { VoiceScamCheck } from "../../components/assistant/VoiceScamCheck";
import { useLanguage } from "../../lib/i18n/LanguageContext";

const cardStyle: CSSProperties = {
  padding: 20,
  borderRadius: 18,
  background: "#ffffff",
  border: "1px solid #e2e8f0",
  marginTop: 16,
};

function AssistantContent() {
  const { language, t } = useLanguage();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";

  const [result, setResult] = useState<TrustCheckResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSend(subject: string) {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/trust-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, language }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data?.error ?? "Trust check failed.");
      }
      const data = (await response.json()) as TrustCheckResult;
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Trust check failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 860, margin: "0 auto", padding: "40px 24px 72px" }}>
      <h1>{t("assistant.title")}</h1>
      <p>{t("assistant.description")}</p>

      <ChatInput
        disabled={loading}
        placeholder={t("assistant.placeholder")}
        onSend={handleSend}
        initialValue={initialQuery}
      />

      {error ? (
        <section style={{ ...cardStyle, borderColor: "#fecaca", color: "#b91c1c" }}>
          {error}
        </section>
      ) : null}

      {result ? (
        <section style={cardStyle}>
          <TrustBadge score={result.trustScore} label={result.verdict} />
          <p>
            <strong>{result.subject}</strong>
          </p>
          {result.warnings.length > 0 ? (
            <div>
              <strong>{t("assistant.warnings")}</strong>
              <ul>
                {result.warnings.map((warning) => (
                  <li key={warning}>{warning}</li>
                ))}
              </ul>
            </div>
          ) : null}
          {result.supportingReasons.length > 0 ? (
            <div>
              <strong>{t("assistant.travelersSay")}</strong>
              <ul>
                {result.supportingReasons.map((reason) => (
                  <li key={reason}>{reason}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>
      ) : null}

      <VoiceScamCheck />

      <section style={cardStyle}>
        <strong>Q:</strong> {t("assistant.qa1Question")}
        <p>
          <strong>A:</strong> {t("assistant.qa1Answer")}
        </p>
      </section>

      <section style={cardStyle}>
        <strong>Q:</strong> {t("assistant.qa2Question")}
        <p>
          <strong>A:</strong> {t("assistant.qa2Answer")}
        </p>
      </section>
    </main>
  );
}

export default function AssistantPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: "center", padding: 40 }}>Loading...</div>}>
      <AssistantContent />
    </Suspense>
  );
}
