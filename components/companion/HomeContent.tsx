"use client";

import type { ReactNode } from "react";
import { motion, type Variants } from "framer-motion";
import { InteractiveGate } from "./InteractiveGate";
import { ModeCards } from "./ModeCards";
import { ConversationStarters } from "./ConversationStarters";
import { ChecklistSection } from "./ChecklistSection";
import { SafetyStatusCard } from "./SafetyStatusCard";
import { NearbySuggestions } from "./NearbySuggestions";
import { HeritageDecor } from "./HeritageDecor";
import { theme } from "../../lib/theme";

type Todo = { id: string | number; name: string };

type MotionPreset = "rise" | "fromLeft" | "fromRight" | "scaleIn" | "float";

const presets: Record<MotionPreset, Variants> = {
  rise: {
    hidden: { opacity: 0, y: 48 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.85, ease: theme.motion.easeOut },
    },
  },
  fromLeft: {
    hidden: { opacity: 0, x: -48, rotate: -1.5 },
    show: {
      opacity: 1,
      x: 0,
      rotate: 0,
      transition: { duration: 0.9, ease: theme.motion.easeSoft },
    },
  },
  fromRight: {
    hidden: { opacity: 0, x: 48, rotate: 1.5 },
    show: {
      opacity: 1,
      x: 0,
      rotate: 0,
      transition: { duration: 0.9, ease: theme.motion.easeSoft },
    },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.92, y: 28 },
    show: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.8, ease: theme.motion.easeOut },
    },
  },
  float: {
    hidden: { opacity: 0, y: 40, scale: 0.97 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 1, ease: theme.motion.easeOut },
    },
  },
};

function ScrollSection({
  children,
  preset = "rise",
  delay = 0,
}: {
  children: ReactNode;
  preset?: MotionPreset;
  delay?: number;
}) {
  return (
    <motion.div
      variants={presets[preset]}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.22, margin: "0px 0px -40px 0px" }}
      transition={{ delay }}
      style={{ willChange: "transform, opacity" }}
    >
      {children}
    </motion.div>
  );
}

/** Simple breathing space between content blocks */
function SectionDivider() {
  return <div aria-hidden style={{ height: 24 }} />;
}

export function HomeContent({
  todos,
  firstName,
}: {
  todos: Todo[] | null;
  firstName?: string;
}) {
  return (
    <div style={{ position: "relative" }}>
      <div style={{ position: "relative", zIndex: 1 }}>
        <InteractiveGate />

        <div
          style={{
            position: "relative",
            zIndex: 10,
            background: `linear-gradient(180deg, rgba(243,235,216,0.4) 0%, rgba(230,215,184,0.55) 45%, rgba(243,235,216,0.5) 100%)`,
            paddingBottom: 100,
            overflow: "hidden",
          }}
        >
          {/* Heritage landmarks — only over the content area, scroll with page */}
          <HeritageDecor opacity={0.62} />

          {/* Ambient floating mist blobs behind content */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              overflow: "hidden",
              zIndex: 0,
            }}
          >
            <motion.div
              animate={{ x: [0, 40, 0], y: [0, -24, 0] }}
              transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
              style={{
                position: "absolute",
                top: "12%",
                left: "-10%",
                width: 320,
                height: 320,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(155,44,31,0.1), transparent 70%)",
                filter: "blur(40px)",
              }}
            />
            <motion.div
              animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
              transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
              style={{
                position: "absolute",
                top: "55%",
                right: "-8%",
                width: 380,
                height: 380,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(196,163,90,0.14), transparent 70%)",
                filter: "blur(48px)",
              }}
            />
          </div>

          <div style={{ position: "relative", zIndex: 1 }}>
            <ScrollSection preset="scaleIn" delay={0.05}>
              <ModeCards firstName={firstName} />
            </ScrollSection>

            <SectionDivider />

            <ScrollSection preset="fromLeft">
              <ConversationStarters />
            </ScrollSection>

            <ScrollSection preset="fromRight">
              <ChecklistSection todos={todos} />
            </ScrollSection>

            <SectionDivider />

            <ScrollSection preset="float">
              <SafetyStatusCard />
            </ScrollSection>

            <ScrollSection preset="rise" delay={0.1}>
              <NearbySuggestions />
            </ScrollSection>
          </div>
        </div>
      </div>
    </div>
  );
}
