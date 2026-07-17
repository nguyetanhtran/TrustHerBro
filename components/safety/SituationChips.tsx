"use client";

import type { CSSProperties } from "react";

// The natural-language triggers from the spec — soft entry points instead of
// a big red alarm button. Tapping one sends it as her message.
const SITUATIONS = [
  "I don't feel comfortable here.",
  "This street is very empty.",
  "My driver is taking a different route.",
  "Someone keeps following me.",
  "The driver asked me to cancel the booking.",
  "I've been waiting here alone too long.",
];

const chipStyle: CSSProperties = {
  padding: "10px 14px",
  borderRadius: 999,
  border: "1px solid #cbd5e1",
  background: "#ffffff",
  color: "#334155",
  fontSize: 14,
  textAlign: "left",
  cursor: "pointer",
};

export function SituationChips({
  disabled,
  onPick,
}: {
  disabled?: boolean;
  onPick: (value: string) => void;
}) {
  return (
    <div>
      <small style={{ color: "#64748b" }}>Tell me what's going on:</small>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
        {SITUATIONS.map((situation) => (
          <button
            key={situation}
            type="button"
            disabled={disabled}
            style={{ ...chipStyle, cursor: disabled ? "wait" : "pointer" }}
            onClick={() => onPick(situation)}
          >
            {situation}
          </button>
        ))}
      </div>
    </div>
  );
}
