"use client";

import type { CSSProperties } from "react";
import { theme } from "../../lib/theme";

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
  border: `1px solid ${theme.colors.border}`,
  background: theme.colors.card,
  color: theme.colors.text,
  fontSize: 14,
  textAlign: "left",
  cursor: "pointer",
  fontFamily: "inherit",
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
      <small style={{ color: theme.colors.textLight }}>Tell me what's going on:</small>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
        {SITUATIONS.map((situation) => (
          <button
            key={situation}
            type="button"
            disabled={disabled}
            style={{ ...chipStyle, cursor: disabled ? "wait" : "pointer", opacity: disabled ? 0.7 : 1 }}
            onClick={() => onPick(situation)}
          >
            {situation}
          </button>
        ))}
      </div>
    </div>
  );
}
