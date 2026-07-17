import type { CSSProperties } from "react";
import Link from "next/link";

const wrapStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  padding: "12px 14px",
  borderRadius: 14,
  background: "transparent",
  border: "1px dashed #fca5a5",
  color: "#b91c1c",
  textDecoration: "none",
  fontWeight: 600,
};

// Subtle, always-available exit to Emergency Mode. Safety Mode stays soft;
// this is the escape hatch for when something is actually happening now.
export function EscalateToEmergency() {
  return (
    <Link href="/emergency" style={wrapStyle}>
      Something is happening right now → Emergency Mode
    </Link>
  );
}
