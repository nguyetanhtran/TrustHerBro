import type { CSSProperties } from "react";

const pageStyle: CSSProperties = {
  maxWidth: 760,
  margin: "0 auto",
  padding: "40px 24px 72px",
  lineHeight: 1.7,
};

const cardStyle: CSSProperties = {
  padding: 20,
  borderRadius: 18,
  background: "#ffffff",
  border: "1px solid #e2e8f0",
  marginTop: 16,
};

export const metadata = {
  title: "Privacy — TrustHerBro",
};

export default function PrivacyPage() {
  return (
    <main style={pageStyle}>
      <h1>Your privacy</h1>
      <p style={{ color: "#475569" }}>
        You're often using this app tired, alone, or on edge. You shouldn't have
        to trade your privacy for a little help. Here's exactly what happens with
        your data — in plain language.
      </p>

      <section style={cardStyle}>
        <h3 style={{ marginTop: 0 }}>What we send off your device</h3>
        <ul style={{ marginBottom: 0 }}>
          <li>
            <strong>Your words</strong> (typed or spoken) go to OpenAI to
            generate advice. Voice is transcribed, then the audio is discarded.
          </li>
          <li>
            <strong>Your location</strong> is only sent if you turn it on, and
            only to reason about a safer route nearby. It's off by default.
          </li>
        </ul>
      </section>

      <section style={cardStyle}>
        <h3 style={{ marginTop: 0 }}>What we don't do</h3>
        <ul style={{ marginBottom: 0 }}>
          <li>No account, no login, no history saved on our servers.</li>
          <li>We don't sell data or build a profile of you.</li>
          <li>We don't track your live location in the background.</li>
        </ul>
      </section>

      <section style={cardStyle}>
        <h3 style={{ marginTop: 0 }}>You stay in control</h3>
        <ul style={{ marginBottom: 0 }}>
          <li>Scam checks and price checks work without sharing location.</li>
          <li>You can use Safety Mode with location off.</li>
          <li>
            Before sharing a photo of a receipt, cover any personal details
            (name, card number, booking code) — a price check only needs the
            items and amounts.
          </li>
        </ul>
      </section>

      <p style={{ color: "#94a3b8", marginTop: 24 }}>
        This is a hackathon prototype. Advice is guidance, not a guarantee, and
        third-party services (OpenAI, map providers) have their own terms.
      </p>
    </main>
  );
}
