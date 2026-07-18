import type { CSSProperties } from "react";
import Link from "next/link";
import { theme } from "../../lib/theme";

const wrapStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  padding: "12px 14px",
  borderRadius: theme.borderRadius.button,
  background: "transparent",
  border: `1px dashed ${theme.colors.primary}`,
  color: theme.colors.primary,
  textDecoration: "none",
  fontWeight: 600,
};

export function EscalateToEmergency() {
  return (
    <Link href="/emergency" style={wrapStyle}>
      Something is happening right now → Emergency Mode
    </Link>
  );
}
