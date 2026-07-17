import type { TimelineStep } from "../../lib/ai/types";

const colors: Record<TimelineStep["riskLevel"], string> = {
  low: "#dcfce7",
  medium: "#fef3c7",
  high: "#fee2e2",
};

export function TimelineStepCard({ step }: { step: TimelineStep }) {
  return (
    <article
      style={{
        padding: 18,
        borderRadius: 18,
        background: "#ffffff",
        border: "1px solid #e2e8f0",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <strong>{step.title}</strong>
        <span
          style={{
            background: colors[step.riskLevel],
            borderRadius: 999,
            padding: "4px 10px",
            fontSize: 12,
          }}
        >
          {step.riskLevel}
        </span>
      </div>
      <p style={{ marginBottom: 8 }}>{step.description}</p>
      <small style={{ color: "#475569" }}>{step.time}</small>
    </article>
  );
}
