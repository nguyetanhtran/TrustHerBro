"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { theme } from "../../lib/theme";
import { Moon, Shield, ShieldAlert, Bot, Search } from "lucide-react";
import { motion } from "framer-motion";

const sectionStyle: CSSProperties = {
  maxWidth: 1100,
  margin: "0 auto",
  padding: "48px 24px 56px",
  textAlign: "center",
};

const eyebrowStyle: CSSProperties = {
  margin: "0 0 10px",
  fontSize: 11,
  letterSpacing: "0.28em",
  textTransform: "uppercase",
  color: theme.colors.bronze,
  fontWeight: 700,
};

const titleStyle: CSSProperties = {
  fontFamily: theme.fonts.script,
  fontSize: "clamp(30px, 4.5vw, 42px)",
  fontWeight: 400,
  color: theme.colors.lacquer,
  margin: "0 0 10px",
  lineHeight: 1.1,
};

const welcomeStyle: CSSProperties = {
  margin: "0 0 28px",
  fontFamily: theme.fonts.display,
  fontSize: "clamp(13px, 2.2vw, 15px)",
  fontWeight: 700,
  letterSpacing: "0.38em",
  textTransform: "uppercase",
  color: "#7A6E48",
  lineHeight: 1.4,
};

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: 16,
  marginTop: 8,
};

const cardStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "28px 20px",
  borderRadius: 24,
  background: theme.colors.card,
  color: theme.colors.text,
  textDecoration: "none",
  border: "none",
  boxShadow: theme.shadows.soft,
  textAlign: "center",
  outline: "none",
};

const iconStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 64,
  height: 64,
  marginBottom: 14,
  borderRadius: "26%",
  color: "#ffffff",
};

const triggerCardStyle: CSSProperties = {
  width: "100%",
  maxWidth: 480,
  margin: "0 auto 32px",
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

// iOS-style app-icon colors, one per mode — matched to Apple's system palette.
const modes = [
  { href: "/onboarding", label: "First Night", icon: Moon, from: "#5AC8FA", to: "#0A84FF" },
  { href: "/assistant", label: "Assistant", icon: Bot, from: "#C77DFF", to: "#AF52DE" },
  { href: "/safety", label: "Safety", icon: Shield, from: "#5FE096", to: "#30D158" },
  { href: "/emergency", label: "Emergency", icon: ShieldAlert, from: "#FF6961", to: "#FF3B30" },
];

export function ModeCards({ firstName }: { firstName?: string }) {
  const greeting = firstName ? `Hi ${firstName}` : "Welcome to Vietnam";

  return (
    <section style={sectionStyle}>
      <div
        aria-hidden
        style={{
          width: "min(280px, 60%)",
          height: 1,
          margin: "0 auto 28px",
          background: `linear-gradient(90deg, transparent, ${theme.colors.gold}, transparent)`,
          opacity: 0.7,
        }}
      />

      <p style={eyebrowStyle}>Your Viet local companion</p>
      <h2 style={titleStyle}>{greeting}</h2>
      <p style={welcomeStyle}>What&apos;s ur plan for today?</p>

      <motion.div
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        style={{ width: "100%", maxWidth: 480, margin: "0 auto 32px" }}
      >
        <Link href="/assistant" style={{ ...triggerCardStyle, margin: 0 }}>
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
          <span>Find a trendy cute photobooth nearby...</span>
        </Link>
      </motion.div>

      <motion.div
        style={gridStyle}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
        }}
      >
        {modes.map((mode) => {
          const Icon = mode.icon;
          return (
            <motion.div
              key={mode.href}
              variants={{
                hidden: { opacity: 0, y: 28, scale: 0.96 },
                show: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { duration: 0.55, ease: theme.motion.easeOut },
                },
              }}
              whileHover={{ y: -6, boxShadow: "0 14px 28px rgba(110, 26, 18, 0.1)" }}
              whileTap={{ scale: 0.94 }}
              style={{ borderRadius: 24 }}
            >
              <Link href={mode.href} style={cardStyle}>
                <div
                  style={{
                    ...iconStyle,
                    background: `linear-gradient(160deg, ${mode.from}, ${mode.to})`,
                    boxShadow: `0 8px 16px -4px ${mode.to}80, inset 0 1px 1px rgba(255,255,255,0.4)`,
                  }}
                  aria-hidden
                >
                  <Icon size={30} strokeWidth={2} />
                </div>
                <strong style={{ fontSize: 17, color: theme.colors.text }}>
                  {mode.label}
                </strong>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
