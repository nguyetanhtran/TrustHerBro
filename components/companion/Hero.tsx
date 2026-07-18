"use client";

import type { CSSProperties } from "react";
import { theme } from "../../lib/theme";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

const sectionStyle: CSSProperties = {
  position: "relative",
  padding: "56px 24px 64px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  overflow: "hidden",
  background: `
    linear-gradient(180deg, ${theme.colors.paperDeep} 0%, ${theme.colors.background} 40%, ${theme.colors.background} 100%)
  `,
  borderTop: `1px solid ${theme.colors.border}`,
};

const greetingStyle: CSSProperties = {
  fontFamily: theme.fonts.script,
  fontSize: "clamp(28px, 4vw, 40px)",
  color: theme.colors.lacquer,
  margin: "0 0 8px",
  lineHeight: 1.1,
};

const welcomeStyle: CSSProperties = {
  margin: "0 0 12px",
  fontFamily: theme.fonts.body,
  fontSize: "clamp(13px, 2.2vw, 15px)",
  fontWeight: 700,
  letterSpacing: "0.38em",
  textTransform: "uppercase",
  color: "#7A6E48",
  lineHeight: 1.4,
};

const subtitleStyle: CSSProperties = {
  fontSize: 16,
  color: theme.colors.textLight,
  maxWidth: 460,
  margin: "0 0 28px",
  lineHeight: 1.55,
};

const triggerCardStyle: CSSProperties = {
  width: "100%",
  maxWidth: 480,
  background: theme.colors.card,
  padding: "14px 18px",
  borderRadius: theme.borderRadius.button,
  boxShadow: theme.shadows.medium,
  border: `1px solid ${theme.colors.border}`,
  display: "flex",
  alignItems: "center",
  gap: 12,
  textDecoration: "none",
  color: theme.colors.textLight,
  fontSize: 16,
  cursor: "pointer",
};

export function Hero({ firstName }: { firstName?: string }) {
  const greeting = firstName ? `Chào ${firstName}` : "Chào bạn";

  return (
    <section style={sectionStyle}>
      {/* Thin exhibition rule */}
      <div
        aria-hidden
        style={{
          width: "min(280px, 60%)",
          height: 1,
          background: `linear-gradient(90deg, transparent, ${theme.colors.gold}, transparent)`,
          marginBottom: 28,
          opacity: 0.7,
        }}
      />

      <p
        style={{
          margin: "0 0 6px",
          fontSize: 11,
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          color: theme.colors.bronze,
          fontWeight: 700,
        }}
      >
        Người bạn đồng hành
      </p>

      <h2 style={greetingStyle}>{greeting}</h2>
      <p style={welcomeStyle}>Welcome to Vietnam</p>
      <p style={subtitleStyle}>
        I&apos;ll help you travel safely — ask anything, explore nearby, stay ready.
      </p>

      <motion.div
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        style={{ width: "100%", maxWidth: 480 }}
      >
        <Link href="/assistant" style={triggerCardStyle}>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 38,
              height: 38,
              borderRadius: 10,
              background: "rgba(155, 44, 31, 0.1)",
              color: theme.colors.primary,
              flexShrink: 0,
            }}
          >
            <Search size={18} strokeWidth={2} />
          </span>
          <span>Ask Viet anything...</span>
        </Link>
      </motion.div>
    </section>
  );
}
