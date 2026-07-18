"use client";

import type { CSSProperties } from "react";
import { theme } from "../../lib/theme";
import Link from "next/link";
import { motion } from "framer-motion";

const sectionStyle: CSSProperties = {
  maxWidth: 1100,
  margin: "0 auto",
  padding: "48px 24px",
};

const containerStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 32,
  alignItems: "center",
  background: "#FFFFFF",
  padding: 32,
  borderRadius: 24,
  boxShadow: theme.shadows.medium,
  border: `1px solid ${theme.colors.border}`,
};

const leftStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 20,
  flex: "1 1 300px",
};

const mascotStyle: CSSProperties = {
  width: 90,
  height: 90,
  borderRadius: "50%",
  background: "#FAF7F2",
  boxShadow: theme.shadows.medium,
  overflow: "hidden",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: `2px solid ${theme.colors.border}`,
};

const rightStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 12,
  flex: "1 1 300px",
  maxWidth: 400,
};

const promptLinkStyle: CSSProperties = {
  padding: "12px 20px",
  borderRadius: 999,
  background: "#FAF7F2",
  border: `1px solid ${theme.colors.border}`,
  color: theme.colors.text,
  fontWeight: 600,
  fontSize: 14,
  textAlign: "left",
  textDecoration: "none",
  display: "block",
};

const prompts = [
  "Can I walk here at night?",
  "Find women-friendly cafes",
  "Translate this menu",
  "Help me get to my hotel",
];

export function ConversationStarters() {
  return (
    <section style={sectionStyle}>
      <div style={containerStyle}>
        <div style={leftStyle}>
          <div style={mascotStyle} aria-hidden>
            <img src="/images/mascot.png" alt="Meet Viet Mascot" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: 20, color: theme.colors.text }}>Meet Viet</h2>
            <p style={{ margin: "4px 0 0", color: theme.colors.textLight, fontSize: 14 }}>
              Your AI travel companion.
            </p>
          </div>
        </div>
        <div style={rightStyle}>
          {prompts.map((prompt) => (
            <motion.div key={prompt} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link href={`/assistant?q=${encodeURIComponent(prompt)}`} style={promptLinkStyle}>
                {prompt}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
