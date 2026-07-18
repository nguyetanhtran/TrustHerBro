"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { theme } from "../../lib/theme";

const cardStyle: CSSProperties = {
  padding: 18,
  borderRadius: theme.borderRadius.card,
  background: "rgba(196, 163, 90, 0.14)",
  border: `1px solid ${theme.colors.border}`,
  color: theme.colors.text,
};

const buttonBase: CSSProperties = {
  padding: "10px 14px",
  borderRadius: theme.borderRadius.button,
  border: "none",
  fontWeight: 700,
  cursor: "pointer",
  fontFamily: "inherit",
};

export function CheckInCard({
  intervalMinutes,
  onEscalate,
}: {
  intervalMinutes: number;
  onEscalate: () => void;
}) {
  const [enabled, setEnabled] = useState(false);
  const [round, setRound] = useState(0);
  const [prompting, setPrompting] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const ms = Math.max(1, intervalMinutes) * 60 * 1000;
    const timer = setTimeout(() => setPrompting(true), ms);
    return () => clearTimeout(timer);
  }, [enabled, round, intervalMinutes]);

  function imFine() {
    setPrompting(false);
    setRound((value) => value + 1);
  }

  return (
    <section style={cardStyle}>
      <label
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <span>
          <strong>Stay with me</strong>
          <br />
          <small style={{ color: theme.colors.textLight }}>
            I&apos;ll quietly check in every {Math.max(1, intervalMinutes)} min until
            you&apos;re safe.
          </small>
        </span>
        <input
          type="checkbox"
          checked={enabled}
          onChange={(event) => {
            setEnabled(event.target.checked);
            setPrompting(false);
          }}
        />
      </label>

      {prompting ? (
        <div style={{ marginTop: 14 }}>
          <p style={{ marginTop: 0, fontWeight: 600 }}>
            Just checking in — are you okay?
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              type="button"
              style={{ ...buttonBase, background: theme.colors.teal, color: "#fff" }}
              onClick={imFine}
            >
              I&apos;m fine
            </button>
            <button
              type="button"
              style={{ ...buttonBase, background: theme.colors.primary, color: "#fff" }}
              onClick={onEscalate}
            >
              Get help now
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
