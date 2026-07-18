import type { CSSProperties } from "react";
import type { RiskAssessment } from "../../lib/ai/types";
import { theme } from "../../lib/theme";

const levelStyles: Record<RiskAssessment["level"], CSSProperties> = {
  low: { background: "rgba(61, 107, 98, 0.16)", color: theme.colors.tealDeep },
  medium: { background: "rgba(196, 163, 90, 0.22)", color: theme.colors.bronze },
  high: { background: "rgba(155, 44, 31, 0.12)", color: theme.colors.lacquer },
};

export function RouteSafetyCard({ assessment }: { assessment: RiskAssessment }) {
  return (
    <section
      style={{
        padding: 20,
        borderRadius: theme.borderRadius.card,
        background: theme.colors.card,
        border: `1px solid ${theme.colors.border}`,
        boxShadow: theme.shadows.soft,
        color: theme.colors.text,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <h3 style={{ margin: 0 }}>Safest route</h3>
        <span
          style={{
            padding: "4px 12px",
            borderRadius: 999,
            fontWeight: 700,
            textTransform: "uppercase",
            fontSize: 12,
            ...levelStyles[assessment.level],
          }}
        >
          {assessment.level} risk
        </span>
      </div>

      <p>
        <strong>Head to:</strong> {assessment.safeRoute.destination} ·{" "}
        {assessment.safeRoute.etaMinutes} min
      </p>
      <p style={{ color: theme.colors.textLight }}>{assessment.safeRoute.description}</p>

      <ul style={{ marginBottom: 0 }}>
        {assessment.safeRoute.instructions.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
