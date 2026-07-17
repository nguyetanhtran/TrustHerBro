import type { CSSProperties } from "react";

const buttonStyle: CSSProperties = {
  padding: "14px 18px",
  borderRadius: 14,
  border: "none",
  cursor: "pointer",
  fontSize: 16,
  fontWeight: 700,
};

export default function EmergencyPage() {
  return (
    <main style={{ maxWidth: 860, margin: "0 auto", padding: "40px 24px 72px" }}>
      <h1>Emergency Stub</h1>
      <p>Static emergency UI with obvious high-priority actions.</p>

      <div
        style={{
          display: "grid",
          gap: 16,
          background: "#ffffff",
          padding: 24,
          borderRadius: 24,
          border: "1px solid #fecaca",
        }}
      >
        <button style={{ ...buttonStyle, background: "#dc2626", color: "#fff" }}>
          SOS
        </button>
        <button style={{ ...buttonStyle, background: "#1d4ed8", color: "#fff" }}>
          Call Local Emergency Number
        </button>
        <button style={{ ...buttonStyle, background: "#fff7ed", color: "#9a3412" }}>
          Share Live Location
        </button>
        <p style={{ margin: 0 }}>
          Placeholder numbers: local emergency, embassy, hotel front desk, and
          trusted contact.
        </p>
      </div>
    </main>
  );
}
