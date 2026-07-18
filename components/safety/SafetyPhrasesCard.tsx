"use client";

import type { CSSProperties } from "react";
import type { SafetyPhrase } from "../../lib/ai/types";
import { playVietnamesePhrase } from "../../lib/utils/speech";
import { theme } from "../../lib/theme";

const cardStyle: CSSProperties = {
  padding: 20,
  borderRadius: theme.borderRadius.card,
  background: theme.colors.card,
  border: `1px solid ${theme.colors.border}`,
  boxShadow: theme.shadows.soft,
  color: theme.colors.text,
};

const rowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  padding: "12px 14px",
  borderRadius: theme.borderRadius.button,
  background: "rgba(196, 163, 90, 0.12)",
  border: `1px solid ${theme.colors.border}`,
};

const playButtonStyle: CSSProperties = {
  flexShrink: 0,
  padding: "10px 14px",
  borderRadius: theme.borderRadius.button,
  border: "none",
  background: theme.colors.primary,
  color: "#ffffff",
  fontWeight: 700,
  cursor: "pointer",
  fontFamily: "inherit",
};

export function SafetyPhrasesCard({ phrases }: { phrases: SafetyPhrase[] }) {
  if (!phrases.length) return null;

  return (
    <section style={cardStyle}>
      <h3 style={{ marginTop: 0 }}>Say this in Vietnamese</h3>
      <p style={{ color: theme.colors.textLight, marginTop: 0 }}>
        Tap play to speak the phrase out loud, or show your screen to a local.
      </p>
      <div style={{ display: "grid", gap: 10 }}>
        {phrases.map((phrase) => (
          <div key={phrase.id ?? phrase.vietnamese} style={rowStyle}>
            <span>
              <strong style={{ fontSize: 18 }}>{phrase.vietnamese}</strong>
              <br />
              {phrase.phonetic ? (
                <small style={{ color: theme.colors.bronze, display: "block" }}>
                  {phrase.phonetic}
                </small>
              ) : null}
              <small style={{ color: theme.colors.textLight }}>{phrase.english}</small>
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
