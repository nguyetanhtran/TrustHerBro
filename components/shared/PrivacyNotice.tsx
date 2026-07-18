import type { CSSProperties } from "react";
import Link from "next/link";
import { theme } from "../../lib/theme";

const wrapStyle: CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: 8,
  padding: "10px 12px",
  borderRadius: 12,
  background: "rgba(196, 163, 90, 0.12)",
  border: `1px solid ${theme.colors.border}`,
  fontSize: 13,
  color: theme.colors.textLight,
  lineHeight: 1.5,
};

// Short, honest disclosure shown right where data is collected. `what` names
// the specific data (e.g. "your voice recording", "your location").
export function PrivacyNotice({ what }: { what: string }) {
  return (
    <div style={wrapStyle}>
      <span aria-hidden>🔒</span>
      <span>
        {what} is sent to OpenAI to generate a response, then discarded — we
        don't store it or link it to you.{" "}
        <Link href="/privacy" style={{ color: theme.colors.primary, fontWeight: 600 }}>
          How we handle your data
        </Link>
      </span>
    </div>
  );
}
