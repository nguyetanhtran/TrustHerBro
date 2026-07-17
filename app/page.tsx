import type { CSSProperties } from "react";
import Link from "next/link";
import { ModeIndicator } from "../components/mode-switch/ModeIndicator";

const shellStyle: CSSProperties = {
  maxWidth: 1100,
  margin: "0 auto",
  padding: "48px 24px 80px",
};

const heroCard: CSSProperties = {
  padding: 28,
  borderRadius: 24,
  background: "rgba(255,255,255,0.88)",
  border: "1px solid rgba(251,146,60,0.25)",
  boxShadow: "0 18px 50px rgba(15, 23, 42, 0.08)",
};

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 16,
  marginTop: 24,
};

const cardStyle: CSSProperties = {
  display: "block",
  padding: 20,
  borderRadius: 18,
  background: "#ffffff",
  color: "#172554",
  textDecoration: "none",
  border: "1px solid #e2e8f0",
};

export default function HomePage() {
  return (
    <main style={shellStyle}>
      <div style={heroCard}>
        <ModeIndicator mode="companion" label="Entry Mode" />
        <h1 style={{ fontSize: 48, lineHeight: 1.05, marginBottom: 12 }}>
          TrustHerBro
        </h1>
        <p style={{ fontSize: 18, lineHeight: 1.6, maxWidth: 700 }}>
          Safety-first copilot for solo female travelers. Start with First Night
          onboarding, jump into Safety Mode, or open static stubs for assistant
          and emergency flows.
        </p>

        <div style={gridStyle}>
          <Link href="/onboarding" style={cardStyle}>
            <strong>First Night</strong>
            <p>7 quick questions to generate a survival timeline.</p>
          </Link>
          <Link href="/timeline" style={cardStyle}>
            <strong>Survival Timeline</strong>
            <p>Preview the step-by-step output format.</p>
          </Link>
          <Link href="/safety" style={cardStyle}>
            <strong>Safety Mode</strong>
            <p>Chat UI with emergency escalation and discreet mode toggle.</p>
          </Link>
          <Link href="/assistant" style={cardStyle}>
            <strong>Assistant Stub</strong>
            <p>Static sample Q&A content for the future assistant.</p>
          </Link>
          <Link href="/emergency" style={cardStyle}>
            <strong>Emergency Stub</strong>
            <p>SOS actions and emergency contact placeholders.</p>
          </Link>
        </div>
      </div>
    </main>
  );
}
