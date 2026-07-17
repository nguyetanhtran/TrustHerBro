"use client";

import type { CSSProperties } from "react";
import { useState } from "react";
import type { TrustCheckResult } from "../../lib/ai/types";
import { ChatInput } from "../../components/shared/ChatInput";
import { TrustBadge } from "../../components/shared/TrustBadge";
import { VoiceScamCheck } from "../../components/assistant/VoiceScamCheck";

const cardStyle: CSSProperties = {
  padding: 20,
  borderRadius: 18,
  background: "#ffffff",
  border: "1px solid #e2e8f0",
  marginTop: 16,
};

export default function AssistantPage() {
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
        body: JSON.stringify({ subject }),
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
      <h1>Ask about a price, place, or person</h1>
      <p>
        Type a taxi fare, a hotel name, or a situation and get a trust check
        based on community reports and known scam warnings.
      </p>

      <ChatInput
        disabled={loading}
        placeholder="Example: Grand Palace Hotel airport pickup"
        onSend={handleSend}
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
              <strong>Warnings:</strong>
              <ul>
                {result.warnings.map((warning) => (
                  <li key={warning}>{warning}</li>
                ))}
              </ul>
            </div>
          ) : null}
          {result.supportingReasons.length > 0 ? (
            <div>
              <strong>What travelers say:</strong>
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
        <strong>Q:</strong> Is this taxi price normal from the airport?
        <p>
          <strong>A:</strong> Ask the driver to confirm meter or fixed total
          price before departure, then compare with a ride-hailing estimate.
        </p>
      </section>

      <section style={cardStyle}>
        <strong>Q:</strong> A stranger says my hotel is closed and offers help.
        <p>
          <strong>A:</strong> Treat it as suspicious. Verify directly with your
          hotel and avoid handing over your phone, bag, or booking details.
        </p>
      </section>
    </main>
  );
}
