"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { AppMode } from "../../lib/ai/types";

type ModeLink = {
  mode: AppMode;
  href: string;
  label: string;
};

const MODES: ModeLink[] = [
  { mode: "first-night", href: "/onboarding", label: "First Night" },
  { mode: "assistant", href: "/assistant", label: "Assistant" },
  { mode: "safety", href: "/safety", label: "Safety" },
  { mode: "emergency", href: "/emergency", label: "Emergency" },
];

const activeColors: Record<AppMode, { bg: string; fg: string }> = {
  "first-night": { bg: "#ffedd5", fg: "#9a3412" },
  assistant: { bg: "#dbeafe", fg: "#1e40af" },
  safety: { bg: "#e0e7ff", fg: "#3730a3" },
  emergency: { bg: "#fee2e2", fg: "#991b1b" },
};

// Which mode a given path belongs to (Timeline is part of the First Night flow).
function modeForPath(pathname: string): AppMode | null {
  if (pathname.startsWith("/onboarding") || pathname.startsWith("/timeline")) {
    return "first-night";
  }
  if (pathname.startsWith("/assistant")) return "assistant";
  if (pathname.startsWith("/safety")) return "safety";
  if (pathname.startsWith("/emergency")) return "emergency";
  return null;
}

const barStyle: CSSProperties = {
  position: "sticky",
  top: 0,
  zIndex: 50,
  background: "rgba(255,255,255,0.85)",
  backdropFilter: "blur(8px)",
  borderBottom: "1px solid #e2e8f0",
};

const innerStyle: CSSProperties = {
  maxWidth: 1100,
  margin: "0 auto",
  padding: "10px 24px",
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  gap: 8,
};

const homeStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "8px 14px",
  borderRadius: 999,
  background: "#ffffff",
  border: "1px solid #cbd5e1",
  color: "#0f172a",
  fontWeight: 700,
  textDecoration: "none",
};

const dividerStyle: CSSProperties = {
  width: 1,
  height: 22,
  background: "#e2e8f0",
  margin: "0 4px",
};

const pillBase: CSSProperties = {
  padding: "8px 14px",
  borderRadius: 999,
  textDecoration: "none",
  fontWeight: 600,
  fontSize: 14,
  border: "1px solid transparent",
};

// Global mode navigation. Rendered once from the root layout:
//  - hidden on the landing page (it's already the entry point)
//  - Emergency keeps only a small Home button, to honor its minimal-UI intent
//  - every other mode gets Home + one-tap switching, current mode highlighted
export function ModeNav() {
  const pathname = usePathname() ?? "/";

  if (pathname === "/") return null;

  const current = modeForPath(pathname);

  const homeLink = (
    <Link href="/" style={homeStyle}>
      <span aria-hidden>←</span> Home
    </Link>
  );

  if (current === "emergency") {
    return (
      <nav style={barStyle} aria-label="Navigation">
        <div style={innerStyle}>{homeLink}</div>
      </nav>
    );
  }

  return (
    <nav style={barStyle} aria-label="Switch mode">
      <div style={innerStyle}>
        {homeLink}
        <span style={dividerStyle} aria-hidden />
        {MODES.map((item) => {
          const isActive = item.mode === current;
          const colors = activeColors[item.mode];
          const style: CSSProperties = isActive
            ? { ...pillBase, background: colors.bg, color: colors.fg }
            : {
                ...pillBase,
                background: "#ffffff",
                color: "#64748b",
                borderColor: "#e2e8f0",
              };

          return (
            <Link
              key={item.mode}
              href={item.href}
              style={style}
              aria-current={isActive ? "page" : undefined}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
