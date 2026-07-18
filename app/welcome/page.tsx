import type { CSSProperties } from "react";
import { WelcomeWizard } from "../../components/onboarding/WelcomeWizard";

const pageStyle: CSSProperties = {
  maxWidth: 960,
  margin: "0 auto",
  padding: "56px 24px 72px",
};

export const metadata = {
  title: "Welcome — TrustHerBro",
};

export default function WelcomePage() {
  return (
    <main style={pageStyle}>
      <WelcomeWizard />
    </main>
  );
}
