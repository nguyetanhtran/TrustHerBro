"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AccountMenu } from "../auth/AccountMenu";
import { theme } from "../../lib/theme";
import { motion, AnimatePresence } from "framer-motion";

type NavLink = {
  mode: string;
  href: string;
  label: string;
};

const TOP_LINKS: NavLink[] = [
  { mode: "translate", href: "/translate", label: "Translate" },
  { mode: "location", href: "/location", label: "Location" },
];

const APP_MODES: NavLink[] = [
  { mode: "first-night", href: "/onboarding", label: "First Night" },
  { mode: "assistant", href: "/assistant", label: "Assistant" },
  { mode: "safety", href: "/safety", label: "Safety" },
  { mode: "emergency", href: "/emergency", label: "Emergency" },
];

function modeForPath(pathname: string): string | null {
  if (pathname.startsWith("/translate")) return "translate";
  if (pathname.startsWith("/location")) return "location";
  if (pathname.startsWith("/onboarding") || pathname.startsWith("/timeline")) return "first-night";
  if (pathname.startsWith("/assistant")) return "assistant";
  if (pathname.startsWith("/safety")) return "safety";
  if (pathname.startsWith("/emergency")) return "emergency";
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
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  whiteSpace: "nowrap",
  border: "none",
  background: "transparent",
  cursor: "pointer",
  fontFamily: "inherit",
};

function ActivePill() {
  return (
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
  );
}

function ModeMenu({ current }: { current: string | null }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const modeActive = APP_MODES.some((item) => item.mode === current);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: MouseEvent | TouchEvent) {
      const target = event.target as Node;
      if (rootRef.current && !rootRef.current.contains(target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      style={{ display: "flex", alignItems: "center", gap: 4 }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((value) => !value)}
        style={{
          ...linkBase,
          color: modeActive || open ? theme.colors.primary : theme.colors.textLight,
        }}
      >
        {modeActive && !open ? <ActivePill /> : null}
        Mode
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            key="modes"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "auto", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            style={{
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            {APP_MODES.map((item) => {
              const isActive = item.mode === current;
              return (
                <Link
                  key={item.mode}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  style={{
                    ...linkBase,
                    color: isActive ? theme.colors.primary : theme.colors.textLight,
                  }}
                  aria-current={isActive ? "page" : undefined}
                >
                  {isActive ? <ActivePill /> : null}
                  {item.label}
                </Link>
              );
            })}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export function ModeNav() {
  const pathname = usePathname() ?? "/";

  if (pathname === "/login" || pathname === "/welcome") return null;

  const current = modeForPath(pathname);
  const isLanding = pathname === "/";

  return (
    <nav style={barStyle} aria-label="Navigation">
      <div style={innerStyle}>
        <div style={leftGroupStyle}>
          <Link href="/" style={brandStyle}>
            TrustHerBro
          </Link>
          <div style={{ width: 1, height: 16, background: theme.colors.border }} aria-hidden />
          {TOP_LINKS.map((item) => {
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
                {!isLanding && isActive ? <ActivePill /> : null}
                {item.label}
              </Link>
            );
          })}
          <ModeMenu current={current} />
        </div>
        <AccountMenu />
      </div>
    </nav>
  );
}
