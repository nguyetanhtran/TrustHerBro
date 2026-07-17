import type { AppMode } from "../../lib/ai/types";

const modeColors: Record<AppMode | "companion", string> = {
  assistant: "#dbeafe",
  "first-night": "#ffedd5",
  safety: "#fee2e2",
  emergency: "#fecaca",
  companion: "#ede9fe",
};

export function ModeIndicator({
  mode,
  label,
}: {
  mode: AppMode | "companion";
  label?: string;
}) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 12px",
        borderRadius: 999,
        background: modeColors[mode],
        fontWeight: 700,
        marginBottom: 12,
      }}
    >
      {label ? `${label}: ` : null}
      {mode}
    </div>
  );
}
