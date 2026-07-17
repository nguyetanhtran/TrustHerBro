import type { CSSProperties } from "react";
import { ModeIndicator } from "../../components/mode-switch/ModeIndicator";
import emergencyContacts from "../../lib/data/emergencyContacts.json";

const cardStyle: CSSProperties = {
  padding: 20,
  borderRadius: 18,
  background: "#ffffff",
  border: "1px solid #e2e8f0",
  marginTop: 16,
};

const sosButtonStyle: CSSProperties = {
  display: "block",
  padding: "22px 18px",
  borderRadius: 18,
  border: "none",
  cursor: "pointer",
  fontSize: 22,
  fontWeight: 800,
  textAlign: "center",
  textDecoration: "none",
  background: "#dc2626",
  color: "#ffffff",
};

const numberButtonStyle: CSSProperties = {
  display: "block",
  padding: "18px 16px",
  borderRadius: 16,
  border: "1px solid #e2e8f0",
  fontSize: 18,
  fontWeight: 700,
  textAlign: "center",
  textDecoration: "none",
  background: "#f8fafc",
  color: "#1d4ed8",
};

export default function EmergencyPage() {
  return (
    <main style={{ maxWidth: 860, margin: "0 auto", padding: "40px 24px 72px" }}>
      <ModeIndicator mode="emergency" label="Emergency" />
      <h1>Get help now</h1>
      <p>
        Big buttons, no typing required. This page works even on a weak
        connection — the numbers below dial directly from your phone.
      </p>

      <a href="tel:113" style={sosButtonStyle}>
        SOS — Call Police (113)
      </a>

      <section style={cardStyle}>
        <strong>Local emergency numbers</strong>
        <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
          {emergencyContacts.localEmergencyNumbers.map((entry) => (
            <a key={entry.number} href={`tel:${entry.number}`} style={numberButtonStyle}>
              {entry.label} — {entry.number}
            </a>
          ))}
        </div>
      </section>

      <section style={cardStyle}>
        <strong>Show this to a local for help</strong>
        <p style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>
          {emergencyContacts.helpPhrase.vietnamese}
        </p>
        <p style={{ color: "#64748b", marginBottom: 0 }}>
          {emergencyContacts.helpPhrase.english}
        </p>
      </section>

      <section style={cardStyle}>
        <strong>Nearest hospital</strong>
        <p style={{ marginBottom: 0 }}>{emergencyContacts.hospitalGuidance}</p>
      </section>

      <section style={cardStyle}>
        <strong>Embassy contact</strong>
        <p>{emergencyContacts.embassyGuidance}</p>
        <div style={{ display: "grid", gap: 12 }}>
          {emergencyContacts.embassies.map((embassy) => (
            <a
              key={`${embassy.country}-${embassy.city}`}
              href={`tel:${embassy.phone.replace(/\s/g, "")}`}
              style={numberButtonStyle}
            >
              {embassy.country} ({embassy.city}) — {embassy.phone}
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
