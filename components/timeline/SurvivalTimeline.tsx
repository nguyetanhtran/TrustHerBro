import type { TimelineStep } from "../../lib/ai/types";
import { TimelineStepCard } from "./TimelineStepCard";

const dotColors: Record<TimelineStep["riskLevel"], string> = {
  low: "#22c55e",
  medium: "#f59e0b",
  high: "#ef4444",
};

export function SurvivalTimeline({
  title,
  steps,
  accommodation,
  needsSimCard,
}: {
  title: string;
  steps: TimelineStep[];
  accommodation?: string;
  needsSimCard?: boolean;
}) {
  return (
    <section
      style={{
        display: "grid",
        gap: 16,
        background: "rgba(255,255,255,0.7)",
        padding: 24,
        borderRadius: 24,
        border: "1px solid #e2e8f0",
      }}
    >
      <h2 style={{ margin: 0 }}>{title}</h2>
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;

        return (
          <div key={step.id} style={{ display: "flex", gap: 14 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 16 }}>
              <span
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  background: dotColors[step.riskLevel],
                  border: "2px solid #ffffff",
                  boxShadow: "0 0 0 2px #e2e8f0",
                  flexShrink: 0,
                  marginTop: 4,
                }}
              />
              {!isLast ? (
                <span style={{ flex: 1, width: 2, background: "#e2e8f0", marginTop: 4 }} />
              ) : null}
            </div>
            <div style={{ flex: 1, paddingBottom: isLast ? 0 : 4 }}>
              <TimelineStepCard step={step} accommodation={accommodation} needsSimCard={needsSimCard} />
            </div>
          </div>
        );
      })}
    </section>
  );
}
