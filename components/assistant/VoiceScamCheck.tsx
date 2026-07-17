"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import type { ScamCheckResult } from "../../lib/ai/types";
import { useVoiceRecorder } from "../../lib/utils/useVoiceRecorder";
import { PrivacyNotice } from "../shared/PrivacyNotice";

const cardStyle: CSSProperties = {
  padding: 20,
  borderRadius: 18,
  background: "#ffffff",
  border: "1px solid #e2e8f0",
  marginTop: 16,
};

const textareaStyle: CSSProperties = {
  width: "100%",
  minHeight: 88,
  padding: "12px 14px",
  borderRadius: 14,
  border: "1px solid #cbd5e1",
  resize: "vertical",
  fontFamily: "inherit",
  fontSize: 15,
  boxSizing: "border-box",
};

const buttonBase: CSSProperties = {
  padding: "12px 16px",
  borderRadius: 14,
  border: "none",
  fontWeight: 700,
  cursor: "pointer",
};

function verdictColors(result: ScamCheckResult): { bg: string; fg: string; label: string } {
  if (result.isLikelyScam) {
    return { bg: "#fee2e2", fg: "#991b1b", label: "Likely a known scam" };
  }
  if (result.matches.length > 0) {
    return { bg: "#fef9c3", fg: "#854d0e", label: "Worth double-checking" };
  }
  return { bg: "#dcfce7", fg: "#166534", label: "No clear scam signal" };
}

export function VoiceScamCheck() {
  const recorder = useVoiceRecorder();
  const [text, setText] = useState("");
  const [result, setResult] = useState<ScamCheckResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [transcribing, setTranscribing] = useState(false);

  async function handleMic() {
    if (recorder.recording) {
      const blob = await recorder.stop();
      if (!blob) return;
      setTranscribing(true);
      try {
        const form = new FormData();
        form.append("audio", blob, "audio.webm");
        const res = await fetch("/api/transcribe", { method: "POST", body: form });
        const data = await res.json();
        if (data?.text) {
          setText((current) => (current ? `${current} ${data.text}` : data.text));
        }
      } finally {
        setTranscribing(false);
      }
    } else {
      await recorder.start();
    }
  }

  async function handleCheck() {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/scam-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: text }),
      });
      const data = (await res.json()) as ScamCheckResult;
      setResult(data);
    } finally {
      setLoading(false);
    }
  }

  const verdict = result ? verdictColors(result) : null;

  return (
    <section style={cardStyle}>
      <h2 style={{ marginTop: 0 }}>Is this a scam?</h2>
      <p style={{ color: "#64748b", marginTop: 0 }}>
        Describe what's happening — speak or type, in any language. I'll check it
        against known scam patterns and tell you how to handle it.
      </p>

      <textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Example: The driver won't turn on the meter and wants a fixed price."
        style={textareaStyle}
      />

      <div style={{ display: "flex", gap: 10, margin: "12px 0" }}>
        <button
          type="button"
          onClick={handleMic}
          disabled={transcribing || !recorder.supported}
          style={{
            ...buttonBase,
            flexShrink: 0,
            background: recorder.recording ? "#dc2626" : "#e2e8f0",
            color: recorder.recording ? "#ffffff" : "#0f172a",
          }}
        >
          {recorder.recording ? "■ Stop" : "🎤 Speak"}
        </button>
        <button
          type="button"
          onClick={handleCheck}
          disabled={loading || transcribing || !text.trim()}
          style={{ ...buttonBase, flex: 1, background: "#1d4ed8", color: "#fff" }}
        >
          {loading ? "Checking…" : "Check it"}
        </button>
      </div>

      {transcribing ? (
        <p style={{ color: "#64748b", margin: "0 0 12px" }}>Transcribing your voice…</p>
      ) : null}
      {recorder.error ? (
        <p style={{ color: "#b91c1c", margin: "0 0 12px" }}>{recorder.error}</p>
      ) : null}

      <PrivacyNotice what="Your description (and any voice recording)" />

      {result && verdict ? (
        <div style={{ marginTop: 16, display: "grid", gap: 12 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              padding: "10px 14px",
              borderRadius: 12,
              background: verdict.bg,
              color: verdict.fg,
              fontWeight: 700,
            }}
          >
            <span>{verdict.label}</span>
            <span style={{ fontSize: 13, fontWeight: 600 }}>
              {Math.round(result.confidence * 100)}% confident
            </span>
          </div>

          <p style={{ margin: 0 }}>{result.advice}</p>

          {result.matches.map((match) => (
            <div
              key={match.id}
              style={{
                padding: 14,
                borderRadius: 12,
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
              }}
            >
              <strong>{match.title}</strong>{" "}
              <span style={{ color: "#64748b", fontSize: 13 }}>
                ({Math.round(match.confidence * 100)}%)
              </span>
              <p style={{ color: "#475569", margin: "6px 0" }}>{match.why}</p>
              <ul style={{ margin: 0 }}>
                {match.howToHandle.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ul>
            </div>
          ))}

          <small style={{ color: "#94a3b8" }}>{result.disclaimer}</small>
        </div>
      ) : null}
    </section>
  );
}
