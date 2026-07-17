"use client";

import type { CSSProperties } from "react";
import type { SafetyPhrase } from "../../lib/ai/types";
import { playVietnamesePhrase } from "../../lib/utils/speech";

const cardStyle: CSSProperties = {
  padding: 20,
  borderRadius: 18,
  background: "#ffffff",
  border: "1px solid #e2e8f0",
};

const rowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  padding: "12px 14px",
  borderRadius: 14,
  background: "#f8fafc",
};

const playButtonStyle: CSSProperties = {
  flexShrink: 0,
  padding: "10px 14px",
  borderRadius: 12,
  border: "none",
  background: "#1d4ed8",
  color: "#ffffff",
  fontWeight: 700,
  cursor: "pointer",
};

export function SafetyPhrasesCard({ phrases }: { phrases: SafetyPhrase[] }) {
  if (!phrases.length) return null;

  return (
    <section style={cardStyle}>
      <h3 style={{ marginTop: 0 }}>Say this in Vietnamese</h3>
      <p style={{ color: "#64748b", marginTop: 0 }}>
        Tap play to speak the phrase out loud, or show your screen to a local.
      </p>
      <div style={{ display: "grid", gap: 10 }}>
        {phrases.map((phrase) => (
          <div key={phrase.id ?? phrase.vietnamese} style={rowStyle}>
            <span>
              <strong style={{ fontSize: 18 }}>{phrase.vietnamese}</strong>
              <br />
              {phrase.phonetic ? (
                <>
                  <small style={{ color: "#0f766e", display: "block" }}>
                    {phrase.phonetic}
                  </small>
                </>
              ) : null}
              <small style={{ color: "#64748b" }}>{phrase.english}</small>
            </span>
            <button
              type="button"
              style={playButtonStyle}
              onClick={() => playVietnamesePhrase(phrase.vietnamese)}
              aria-label={`Play: ${phrase.english}`}
            >
              Play
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
