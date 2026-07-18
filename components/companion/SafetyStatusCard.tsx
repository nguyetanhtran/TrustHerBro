"use client";

import type { CSSProperties } from "react";
import { theme } from "../../lib/theme";

const sectionStyle: CSSProperties = {
  maxWidth: 1100,
  margin: "0 auto",
  padding: "24px",
};

const containerStyle: CSSProperties = {
  padding: 24,
  borderRadius: theme.borderRadius.card,
  background: theme.colors.card,
  border: `1px solid ${theme.colors.border}`,
  boxShadow: theme.shadows.soft,
};

const headerStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 16,
};

const titleStyle: CSSProperties = {
  fontSize: 20,
  fontWeight: 700,
  color: theme.colors.text,
  margin: 0,
};

const badgeStyle: CSSProperties = {
  padding: "4px 8px",
  borderRadius: 8,
  background: "#fef3c7",
  color: "#92400e",
  fontSize: 12,
  fontWeight: 700,
  textTransform: "uppercase",
};

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
  gap: 16,
};

const statStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 4,
};

const statLabelStyle: CSSProperties = {
  fontSize: 14,
  color: theme.colors.textLight,
};

const statValueStyle: CSSProperties = {
  fontSize: 16,
  fontWeight: 600,
  color: theme.colors.text,
};

export function SafetyStatusCard() {
  return (
    <section style={sectionStyle}>
      <div style={containerStyle}>
        <div style={headerStyle}>
          <h2 style={titleStyle}>Current Safety</h2>
          <span style={badgeStyle}>Demo Status</span>
        </div>
        
        <div style={gridStyle}>
          <div style={statStyle}>
            <span style={statLabelStyle}>Safe Level</span>
            <span style={statValueStyle} aria-label="Safe Level High">High 🟢</span>
          </div>
          <div style={statStyle}>
            <span style={statLabelStyle}>Scam Risk</span>
            <span style={statValueStyle} aria-label="Scam Risk Low">Low 🟢</span>
          </div>
          <div style={statStyle}>
            <span style={statLabelStyle}>Weather</span>
            <span style={statValueStyle}>32°C ☀️</span>
          </div>
          <div style={statStyle}>
            <span style={statLabelStyle}>Crowd Level</span>
            <span style={statValueStyle}>Moderate 🟡</span>
          </div>
        </div>
      </div>
    </section>
  );
}
