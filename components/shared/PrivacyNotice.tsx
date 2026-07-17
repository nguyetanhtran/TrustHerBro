import type { CSSProperties } from "react";
import Link from "next/link";

const wrapStyle: CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: 8,
  padding: "10px 12px",
  borderRadius: 12,
  background: "#f1f5f9",
  border: "1px solid #e2e8f0",
  fontSize: 13,
  color: "#475569",
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
        <Link href="/privacy" style={{ color: "#1d4ed8" }}>
          How we handle your data
        </Link>
      </span>
    </div>
  );
}
