import type { CSSProperties } from "react";
import type { TransportSuggestion } from "../../lib/ai/types";

const cardStyle: CSSProperties = {
  padding: 20,
  borderRadius: 18,
  background: "#ffffff",
  border: "1px solid #e2e8f0",
};

const rowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  padding: "12px 14px",
  borderRadius: 14,
  background: "#f8fafc",
};

const bookButtonStyle: CSSProperties = {
  flexShrink: 0,
  padding: "10px 14px",
  borderRadius: 12,
  border: "none",
  background: "#16a34a",
  color: "#ffffff",
  fontWeight: 700,
  textDecoration: "none",
};

export function TransportCard({ options }: { options: TransportSuggestion[] }) {
  if (!options.length) return null;

  return (
    <section style={cardStyle}>
      <h3 style={{ marginTop: 0 }}>Get back safely</h3>
      <p style={{ color: "#64748b", marginTop: 0 }}>
        Trusted ride options with reference prices, so you aren't overcharged.
      </p>
      <div style={{ display: "grid", gap: 10 }}>
        {options.map((option) => (
          <div key={option.option} style={rowStyle}>
            <span>
              <strong style={{ fontSize: 16 }}>{option.option}</strong> ·{" "}
              <span style={{ color: "#16a34a", fontWeight: 600 }}>
                {option.priceRange}
              </span>
              <br />
              <small style={{ color: "#64748b" }}>{option.note}</small>
            </span>
            {option.bookingUrl ? (
              <a
                href={option.bookingUrl}
                target="_blank"
                rel="noreferrer"
                style={bookButtonStyle}
              >
                Book
              </a>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}
