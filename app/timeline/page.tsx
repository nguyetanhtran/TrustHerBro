import type { CSSProperties } from "react";
import { SurvivalTimeline } from "../../components/timeline/SurvivalTimeline";
import { sampleTimeline } from "../../lib/ai/types";

const pageStyle: CSSProperties = {
  maxWidth: 900,
  margin: "0 auto",
  padding: "40px 24px 72px",
};

export default function TimelinePage() {
  return (
    <main style={pageStyle}>
      <h1>Survival Timeline</h1>
      <p style={{ lineHeight: 1.7 }}>
        Static preview of the result format returned by First Night Mode.
      </p>
      <SurvivalTimeline
        title="Your first 6 hours in town"
        steps={sampleTimeline}
      />
    </main>
  );
}
