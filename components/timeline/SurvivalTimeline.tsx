import type { TimelineStep } from "../../lib/ai/types";
import { TimelineStepCard } from "./TimelineStepCard";

export function SurvivalTimeline({
  title,
  steps,
}: {
  title: string;
  steps: TimelineStep[];
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
      {steps.map((step) => (
        <TimelineStepCard key={step.id} step={step} />
      ))}
    </section>
  );
}
