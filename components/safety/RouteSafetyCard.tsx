import type { CSSProperties } from "react";
import type { RiskAssessment } from "../../lib/ai/types";

const levelStyles: Record<RiskAssessment["level"], CSSProperties> = {
  low: { background: "#dcfce7", color: "#166534" },
  medium: { background: "#fef9c3", color: "#854d0e" },
  high: { background: "#fee2e2", color: "#991b1b" },
};

export function RouteSafetyCard({ assessment }: { assessment: RiskAssessment }) {
  return (
    <section
      style={{
        padding: 20,
        borderRadius: 18,
        background: "#ffffff",
        border: "1px solid #e2e8f0",
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
      <p style={{ color: "#475569" }}>{assessment.safeRoute.description}</p>

      <ul style={{ marginBottom: 0 }}>
        {assessment.safeRoute.instructions.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
