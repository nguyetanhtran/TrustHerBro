"use client";

import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, CSSProperties } from "react";
import type { ScamCheckResult } from "../../lib/ai/types";
import { useVoiceRecorder } from "../../lib/utils/useVoiceRecorder";
import { useLanguage } from "../../lib/i18n/LanguageContext";
import { theme } from "../../lib/theme";
import { PrivacyNotice } from "../shared/PrivacyNotice";
import { Camera, Mic, Square } from "lucide-react";

const cardStyle: CSSProperties = {
  padding: 20,
  borderRadius: theme.borderRadius.card,
  background: theme.colors.card,
  border: `1px solid ${theme.colors.border}`,
  boxShadow: theme.shadows.soft,
  marginTop: 16,
  color: theme.colors.text,
};

const textareaStyle: CSSProperties = {
  width: "100%",
  minHeight: 88,
  padding: "12px 14px",
  borderRadius: theme.borderRadius.button,
  border: `1px solid ${theme.colors.border}`,
  background: "#FAF7F2",
  color: theme.colors.text,
  resize: "vertical",
  fontFamily: "inherit",
  fontSize: 15,
  boxSizing: "border-box",
  outline: "none",
};

const buttonBase: CSSProperties = {
  padding: "12px 16px",
  borderRadius: theme.borderRadius.button,
  border: "none",
  fontWeight: 700,
  cursor: "pointer",
};

const iconButtonBase: CSSProperties = {
  ...buttonBase,
  flexShrink: 0,
  width: 48,
  height: 48,
  padding: 0,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  lineHeight: 0,
};

function verdictColors(
  result: ScamCheckResult,
  labels: { scam: string; check: string; clear: string },
): { bg: string; fg: string; label: string } {
  if (result.isLikelyScam) {
    return { bg: "rgba(155, 44, 31, 0.12)", fg: theme.colors.lacquer, label: labels.scam };
  }
  if (result.matches.length > 0) {
    return { bg: "rgba(196, 163, 90, 0.2)", fg: theme.colors.bronze, label: labels.check };
  }
  return { bg: "rgba(61, 107, 98, 0.14)", fg: theme.colors.tealDeep, label: labels.clear };
}

export function VoiceScamCheck({
  suggestedText = "",
}: {
  suggestedText?: string;
} = {}) {
  const { language, t } = useLanguage();
  const recorder = useVoiceRecorder();
  const cameraRef = useRef<HTMLInputElement>(null);
  const uploadRef = useRef<HTMLInputElement>(null);
  const photoMenuRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [text, setText] = useState(suggestedText);
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<ScamCheckResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [photoMenuOpen, setPhotoMenuOpen] = useState(false);
  const [apiNotice, setApiNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!suggestedText) return;
    setText(suggestedText);
    textareaRef.current?.focus();
  }, [suggestedText]);

  useEffect(() => {
    if (!photoMenuOpen) return;
    function onPointerDown(event: MouseEvent | TouchEvent) {
      const target = event.target as Node;
      if (photoMenuRef.current && !photoMenuRef.current.contains(target)) {
        setPhotoMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, [photoMenuOpen]);

  function onPickImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
    event.target.value = "";
    setPhotoMenuOpen(false);
  }

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
    if (!text.trim() && !image) return;
    setLoading(true);
    setApiNotice(null);
    try {
      const res = await fetch("/api/scam-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: text, image, language }),
      });
      const data = (await res.json()) as ScamCheckResult;
      setResult(data);
      if (data.code === "NO_API_KEY" || data.code === "VISION_FAILED" || data.code === "MODEL_FAILED") {
        setApiNotice("Couldn't reach the AI right now — used saved safety tips instead.");
      } else if (data.usedFallback) {
        setApiNotice("Used saved safety tips for this check.");
      }
    } finally {
      setLoading(false);
    }
  }

  const verdict = result
    ? verdictColors(result, {
        scam: t("scamCheck.verdictScam"),
        check: t("scamCheck.verdictCheck"),
        clear: t("scamCheck.verdictClear"),
      })
    : null;

  const canCheck = Boolean(text.trim() || image);

  return (
    <section style={cardStyle}>
      <h2 style={{ marginTop: 0, color: theme.colors.text }}>{t("scamCheck.title")}</h2>
      <p style={{ color: theme.colors.textLight, marginTop: 0 }}>{t("scamCheck.description")}</p>

      <textarea
        ref={textareaRef}
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder={t("scamCheck.placeholder")}
        style={textareaStyle}
      />

      {image ? (
        <div
          style={{
            marginTop: 10,
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 10px",
            borderRadius: 12,
            background: "#FAF7F2",
            border: `1px solid ${theme.colors.border}`,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt="preview" style={{ height: 44, borderRadius: 8 }} />
          <span style={{ fontSize: 13, color: theme.colors.textLight }}>{t("companion.photoAttached")}</span>
          <button
            type="button"
            onClick={() => setImage(null)}
            style={{
              marginLeft: "auto",
              border: "none",
              background: "none",
              color: theme.colors.primary,
              cursor: "pointer",
              fontWeight: 700,
              fontSize: 13,
            }}
          >
            {t("companion.remove")}
          </button>
        </div>
      ) : null}

      <div style={{ display: "flex", gap: 10, margin: "12px 0" }}>
        <input
          ref={cameraRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={onPickImage}
          style={{ display: "none" }}
        />
        <input
          ref={uploadRef}
          type="file"
          accept="image/*"
          onChange={onPickImage}
          style={{ display: "none" }}
        />
        <button
          type="button"
          onClick={handleMic}
          disabled={transcribing || !recorder.supported}
          aria-label={recorder.recording ? t("scamCheck.stop") : t("scamCheck.speak")}
          title={recorder.recording ? t("scamCheck.stop") : t("scamCheck.speak")}
          style={{
            ...iconButtonBase,
            background: recorder.recording ? theme.colors.primary : "rgba(155, 44, 31, 0.1)",
            color: recorder.recording ? "#ffffff" : theme.colors.primary,
            opacity: transcribing || !recorder.supported ? 0.6 : 1,
          }}
        >
          {recorder.recording ? (
            <Square size={16} strokeWidth={2.5} fill="currentColor" aria-hidden />
          ) : (
            <Mic size={22} strokeWidth={2} aria-hidden />
          )}
        </button>
        <div ref={photoMenuRef} style={{ position: "relative", flexShrink: 0 }}>
          <button
            type="button"
            onClick={() => setPhotoMenuOpen((open) => !open)}
            disabled={loading || transcribing}
            aria-label={t("companion.addPhoto")}
            title={t("companion.addPhoto")}
            style={{
              ...iconButtonBase,
              background: "rgba(155, 44, 31, 0.1)",
              color: theme.colors.primary,
              opacity: loading || transcribing ? 0.6 : 1,
            }}
          >
            <Camera size={22} strokeWidth={2} aria-hidden />
          </button>
          {photoMenuOpen ? (
            <div
              role="menu"
              style={{
                position: "absolute",
                bottom: "calc(100% + 8px)",
                left: 0,
                minWidth: 160,
                padding: 6,
                borderRadius: 12,
                background: theme.colors.card,
                border: `1px solid ${theme.colors.border}`,
                boxShadow: theme.shadows.soft,
                zIndex: 20,
                display: "grid",
                gap: 4,
              }}
            >
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setPhotoMenuOpen(false);
                  cameraRef.current?.click();
                }}
                style={{
                  ...buttonBase,
                  textAlign: "left",
                  background: "transparent",
                  color: theme.colors.text,
                  fontWeight: 600,
                  padding: "10px 12px",
                }}
              >
                {t("scamCheck.takePhoto")}
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setPhotoMenuOpen(false);
                  uploadRef.current?.click();
                }}
                style={{
                  ...buttonBase,
                  textAlign: "left",
                  background: "transparent",
                  color: theme.colors.text,
                  fontWeight: 600,
                  padding: "10px 12px",
                }}
              >
                {t("scamCheck.uploadPhoto")}
              </button>
            </div>
          ) : null}
        </div>
        <button
          type="button"
          onClick={handleCheck}
          disabled={loading || transcribing || !canCheck}
          style={{
            ...buttonBase,
            flex: 1,
            background: theme.colors.primary,
            color: "#fff",
            opacity: loading || transcribing || !canCheck ? 0.7 : 1,
          }}
        >
          {loading ? t("scamCheck.checking") : t("scamCheck.checkIt")}
        </button>
      </div>

      <PrivacyNotice what={t("scamCheck.privacyWhat")} />

      {transcribing ? (
        <p style={{ color: theme.colors.textLight, margin: "0 0 12px" }}>{t("scamCheck.transcribing")}</p>
      ) : null}
      {recorder.error ? (
        <p style={{ color: theme.colors.lacquer, margin: "0 0 12px" }}>{recorder.error}</p>
      ) : null}
      {apiNotice ? (
        <p
          style={{
            margin: "0 0 12px",
            padding: "10px 12px",
            borderRadius: 12,
            background: "rgba(196, 163, 90, 0.18)",
            border: `1px solid ${theme.colors.border}`,
            color: theme.colors.bronze,
            fontSize: 13,
          }}
        >
          {apiNotice}
        </p>
      ) : null}

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

          <p style={{ margin: 0, color: theme.colors.text }}>{result.advice}</p>

          {result.matches.map((match) => (
            <div
              key={match.id}
              style={{
                padding: 14,
                borderRadius: 12,
                background: "#FAF7F2",
                border: `1px solid ${theme.colors.border}`,
              }}
            >
              <strong style={{ color: theme.colors.text }}>{match.title}</strong>{" "}
              <span style={{ color: theme.colors.textLight, fontSize: 13 }}>
                ({Math.round(match.confidence * 100)}%)
              </span>
              <p style={{ color: theme.colors.textLight, margin: "6px 0" }}>{match.why}</p>
              <ul style={{ margin: 0, color: theme.colors.text }}>
                {match.howToHandle.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ul>
            </div>
          ))}

          <small style={{ color: theme.colors.textLight }}>{result.disclaimer}</small>
        </div>
      ) : null}
    </section>
  );
}
