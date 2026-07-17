import type { CSSProperties } from "react";
import { OnboardingForm } from "../../components/onboarding/OnboardingForm";

const pageStyle: CSSProperties = {
  maxWidth: 860,
  margin: "0 auto",
  padding: "40px 24px 72px",
};

export default function OnboardingPage() {
  return (
    <main style={pageStyle}>
      <h1>First Night Onboarding</h1>
      <p style={{ lineHeight: 1.7 }}>
        Flow designed to finish in under 30 seconds and produce a first-night
        survival timeline.
      </p>
      <OnboardingForm />
    </main>
  );
}
