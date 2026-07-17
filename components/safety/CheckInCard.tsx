"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";

const cardStyle: CSSProperties = {
  padding: 18,
  borderRadius: 16,
  background: "#f5f3ff",
  border: "1px solid #ddd6fe",
};

const buttonBase: CSSProperties = {
  padding: "10px 14px",
  borderRadius: 12,
  border: "none",
  fontWeight: 700,
  cursor: "pointer",
};

/**
 * A soft companion check-in. When "stay with me" is on, it quietly waits the
 * suggested interval, then asks if she is okay. If she doesn't respond well,
 * she can escalate to Emergency Mode — but nothing here is alarming by default.
 */
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
          <small style={{ color: "#6d5bb5" }}>
            I'll quietly check in every {Math.max(1, intervalMinutes)} min until
            you're safe.
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
              style={{ ...buttonBase, background: "#16a34a", color: "#fff" }}
              onClick={imFine}
            >
              I'm fine
            </button>
            <button
              type="button"
              style={{ ...buttonBase, background: "#dc2626", color: "#fff" }}
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
