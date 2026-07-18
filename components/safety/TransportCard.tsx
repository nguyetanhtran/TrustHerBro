import type { CSSProperties } from "react";
import type { TransportSuggestion } from "../../lib/ai/types";
import { theme } from "../../lib/theme";

const cardStyle: CSSProperties = {
  padding: 20,
  borderRadius: theme.borderRadius.card,
  background: theme.colors.card,
  border: `1px solid ${theme.colors.border}`,
  boxShadow: theme.shadows.soft,
  color: theme.colors.text,
};

const rowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  padding: "12px 14px",
  borderRadius: theme.borderRadius.button,
  background: "rgba(196, 163, 90, 0.12)",
  border: `1px solid ${theme.colors.border}`,
};

const bookButtonStyle: CSSProperties = {
  flexShrink: 0,
  padding: "10px 14px",
  borderRadius: theme.borderRadius.button,
  border: "none",
  background: theme.colors.primary,
  color: "#ffffff",
  fontWeight: 700,
  textDecoration: "none",
};

export function TransportCard({ options }: { options: TransportSuggestion[] }) {
  if (!options.length) return null;

  return (
    <section style={cardStyle}>
      <h3 style={{ marginTop: 0 }}>Get back safely</h3>
      <p style={{ color: theme.colors.textLight, marginTop: 0 }}>
        Trusted ride options with reference prices, so you aren&apos;t overcharged.
      </p>
      <div style={{ display: "grid", gap: 10 }}>
        {options.map((option) => (
          <div key={option.option} style={rowStyle}>
            <span>
              <strong style={{ fontSize: 16 }}>{option.option}</strong> ·{" "}
              <span style={{ color: theme.colors.primary, fontWeight: 600 }}>
                {option.priceRange}
              </span>
              <br />
              <small style={{ color: theme.colors.textLight }}>{option.note}</small>
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
