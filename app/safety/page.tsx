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
      <h1>I've got you</h1>
      <p style={{ lineHeight: 1.7, color: "#475569" }}>
        Feeling uneasy? That instinct is worth trusting. I'll help you get back
        somewhere safe — a brighter, busier route, a trusted ride, the right
        words in Vietnamese, and a quiet check-in until you're okay. No alarms,
        just a calm plan.
      </p>
      <SafetyChat />
    </main>
  );
}
