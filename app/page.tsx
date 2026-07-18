import type { CSSProperties } from "react";
import Link from "next/link";
import { cookies } from "next/headers";
import { ModeIndicator } from "../components/mode-switch/ModeIndicator";
import { CompanionChat } from "../components/companion/CompanionChat";
import { createClient } from "../utils/supabase/server";

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

export default async function HomePage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: todos } = await supabase.from("todos").select();

  return (
    <main style={shellStyle}>
      <div style={heroCard}>
        <ModeIndicator mode="companion" label="Entry Mode" />
        <h1 style={{ fontSize: 48, lineHeight: 1.05, marginBottom: 12 }}>
          TrustHerBro
        </h1>
        <p style={{ fontSize: 18, lineHeight: 1.6, maxWidth: 700 }}>
          Safety-first copilot for solo female travelers. Ask a question, speak,
          or snap a photo of a price — I&apos;ll point you to the right mode.
        </p>

        <div style={{ marginTop: 24 }}>
          <CompanionChat />
        </div>

        <section
          style={{
            marginTop: 20,
            padding: 18,
            borderRadius: 18,
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
          }}
        >
          <strong>Supabase Todos</strong>
          <ul style={{ marginBottom: 0 }}>
            {todos?.map((todo) => (
              <li key={todo.id}>{todo.name}</li>
            )) ?? <li>No todos found.</li>}
          </ul>
        </section>

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
            <p>Preventive help: safe routes, phrases, discreet mode.</p>
          </Link>
          <Link href="/assistant" style={cardStyle}>
            <strong>Assistant</strong>
            <p>Trust checks and voice scam detection.</p>
          </Link>
          <Link href="/emergency" style={cardStyle}>
            <strong>Emergency</strong>
            <p>SOS actions and emergency contacts.</p>
          </Link>
        </div>
      </div>
    </main>
  );
}
