import type { CSSProperties } from "react";
import { OnboardingForm } from "../../components/onboarding/OnboardingForm";
import { theme } from "../../lib/theme";

const pageStyle: CSSProperties = {
  maxWidth: 860,
  margin: "0 auto",
  padding: "40px 24px 72px",
  boxSizing: "border-box",
  width: "100%",
};

export default function OnboardingPage() {
  return (
    <main style={pageStyle}>
      <h1
        style={{
          margin: "0 0 8px",
          color: theme.colors.text,
          fontSize: "clamp(26px, 4vw, 34px)",
          fontWeight: 800,
        }}
      >
        First Night Onboarding
      </h1>
      <p style={{ lineHeight: 1.7, color: theme.colors.textLight, margin: "0 0 20px" }}>
        Flow designed to finish in under 30 seconds and produce a first-night survival timeline.
      </p>
      <OnboardingForm />
    </main>
  );
}
