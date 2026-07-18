"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { AppMode } from "../../lib/ai/types";
import { AccountMenu } from "../auth/AccountMenu";
import { theme } from "../../lib/theme";

import { motion } from "framer-motion";

type ModeLink = {
  mode: string;
  href: string;
  label: string;
};

const MODES: ModeLink[] = [
  { mode: "translate", href: "/translate", label: "Translate" },
  { mode: "location", href: "/location", label: "Location" },
  { mode: "assistant", href: "/assistant", label: "Chat" },
];

function modeForPath(pathname: string): string | null {
  if (pathname.startsWith("/translate")) return "translate";
  if (pathname.startsWith("/location")) return "location";
  if (pathname.startsWith("/assistant")) return "assistant";
  return null;
}

const barStyle: CSSProperties = {
  position: "sticky",
  top: 0,
  zIndex: 50,
  background: "rgba(243, 235, 216, 0.82)",
  backdropFilter: "blur(14px)",
  WebkitBackdropFilter: "blur(14px)",
  borderBottom: `1px solid rgba(138, 107, 47, 0.18)`,
};

const innerStyle: CSSProperties = {
  maxWidth: 1100,
  margin: "0 auto",
  padding: "10px 24px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexWrap: "wrap",
  gap: 8,
};

const leftGroupStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  gap: 16,
};

const brandStyle: CSSProperties = {
  fontWeight: 800,
  color: theme.colors.primary,
  textDecoration: "none",
  fontSize: 17,
  marginRight: 8,
  letterSpacing: "-0.02em",
  fontFamily: theme.fonts.display,
  textTransform: "uppercase",
};

const linkBase: CSSProperties = {
  position: "relative",
  padding: "6px 14px",
  textDecoration: "none",
  fontWeight: 600,
  fontSize: 15,
  transition: "color 0.2s ease",
  borderRadius: 999,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

export function ModeNav() {
  const pathname = usePathname() ?? "/";

  // No chrome on the pre-app screens.
  if (pathname === "/login" || pathname === "/welcome") return null;

  const current = modeForPath(pathname);
  const isLanding = pathname === "/";

  let left;
  if (isLanding) {
    left = (
      <>
        <Link href="/" style={brandStyle}>
          TrustHerBro
        </Link>
        <div style={{ width: 1, height: 16, background: theme.colors.border }} aria-hidden />
        {MODES.map((item) => (
           <Link
             key={item.mode}
             href={item.href}
             style={{ ...linkBase, color: theme.colors.textLight }}
           >
             {item.label}
           </Link>
        ))}
      </>
    );
  } else {
    left = (
      <>
        <Link href="/" style={brandStyle}>TrustHerBro</Link>
        <div style={{ width: 1, height: 16, background: theme.colors.border }} aria-hidden />
        {MODES.map((item) => {
          const isActive = item.mode === current;
          return (
            <Link
              key={item.mode}
              href={item.href}
              style={{
                ...linkBase,
                color: isActive ? theme.colors.primary : theme.colors.textLight,
              }}
              aria-current={isActive ? "page" : undefined}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(155, 44, 31, 0.1)",
                    borderRadius: 999,
                    zIndex: -1,
                  }}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              {item.label}
            </Link>
          );
        })}
      </>
    );
  }

  return (
    <nav style={barStyle} aria-label="Navigation">
      <div style={innerStyle}>
        <div style={leftGroupStyle}>{left}</div>
        <AccountMenu />
      </div>
    </nav>
  );
}
