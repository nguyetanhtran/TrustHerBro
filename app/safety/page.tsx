import type { CSSProperties } from "react";
import { SafetyChat } from "../../components/safety/SafetyChat";

const pageStyle: CSSProperties = {
  maxWidth: 960,
  margin: "0 auto",
  padding: "40px 24px 72px",
};

export default function SafetyPage() {
  return (
    <main style={pageStyle}>
      <h1>Safety Mode</h1>
      <p style={{ lineHeight: 1.7 }}>
        Chat surface for quick risk checks, safe route guidance, and discreet
        voice prompts.
      </p>
      <SafetyChat />
    </main>
  );
}
