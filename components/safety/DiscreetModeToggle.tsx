"use client";

import { theme } from "../../lib/theme";

export function DiscreetModeToggle({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        padding: 14,
        borderRadius: theme.borderRadius.button,
        background: "rgba(196, 163, 90, 0.12)",
        border: `1px solid ${theme.colors.border}`,
        color: theme.colors.text,
      }}
    >
      <span>
        <strong>Discreet Mode</strong>
        <br />
        <small style={{ color: theme.colors.textLight }}>
          English guidance read quietly through your earphones
        </small>
      </span>
      <input
        type="checkbox"
        checked={enabled}
        onChange={(event) => onChange(event.target.checked)}
      />
    </label>
  );
}
