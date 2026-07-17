import type { RiskAssessment } from "../../lib/ai/types";

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
      <h3 style={{ marginTop: 0 }}>Safe Route Guidance</h3>
      <p>
        <strong>Destination:</strong> {assessment.safeRoute.destination}
      </p>
      <p>
        <strong>ETA:</strong> {assessment.safeRoute.etaMinutes} minutes
      </p>
      <ul style={{ marginBottom: 0 }}>
        {assessment.safeRoute.instructions.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
