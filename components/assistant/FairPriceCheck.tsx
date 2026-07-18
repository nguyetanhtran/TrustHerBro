"use client";

import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, CSSProperties, FormEvent } from "react";
import type { TrustCheckResult } from "../../lib/ai/types";
import { useLanguage } from "../../lib/i18n/LanguageContext";
import { theme } from "../../lib/theme";
import { PrivacyNotice } from "../shared/PrivacyNotice";
import { TrustBadge } from "../shared/TrustBadge";
import { Camera, Mic, Square } from "lucide-react";
import { useVoiceRecorder } from "../../lib/utils/useVoiceRecorder";

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
  minHeight: 72,
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
  fontFamily: "inherit",
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

type TrustResponse = TrustCheckResult & {
  catalogUpdatedAt?: string;
  catalogSource?: string;
};

export function FairPriceCheck({
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
  const [result, setResult] = useState<TrustResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [photoMenuOpen, setPhotoMenuOpen] = useState(false);
  const [apiNotice, setApiNotice] = useState<string | null>(null);
  const [reportCity, setReportCity] = useState("Hà Nội");
  const [reportItem, setReportItem] = useState("");
  const [reportAmount, setReportAmount] = useState("");
  const [reportStatus, setReportStatus] = useState<string | null>(null);

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
      const res = await fetch("/api/trust-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: text, image, language }),
      });
      const data = (await res.json()) as TrustResponse;
      setResult(data);
      if (data.code === "NO_API_KEY" || data.code === "VISION_FAILED" || data.code === "MODEL_FAILED") {
        setApiNotice("Couldn't reach the AI right now — compared with saved local prices instead.");
      } else if (data.usedFallback) {
        setApiNotice("Compared with saved local prices.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleReport(event: FormEvent) {
    event.preventDefault();
    const amountVnd = Number(reportAmount.replace(/[^\d]/g, ""));
    if (!reportItem.trim() || !amountVnd) return;
    setReportStatus(null);
    const res = await fetch("/api/price-report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        city: reportCity,
        item: reportItem,
        amountVnd,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setReportStatus(data?.message ?? "Could not send report.");
      return;
    }
    setReportStatus(
      data?.autoMerged
        ? "Thanks — your report helped update local prices."
        : "Thanks — we’ll use this to improve local price ranges.",
    );
    setReportItem("");
    setReportAmount("");
  }

  const canCheck = Boolean(text.trim() || image);

  return (
    <section style={cardStyle}>
      <h2 style={{ marginTop: 0, color: theme.colors.text }}>{t("fairPrice.title")}</h2>
      <p style={{ color: theme.colors.textLight, marginTop: 0 }}>{t("fairPrice.description")}</p>

      <textarea
        ref={textareaRef}
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder={t("fairPrice.placeholder")}
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
              fontWeight: 700,
              cursor: "pointer",
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
        <input ref={uploadRef} type="file" accept="image/*" onChange={onPickImage} style={{ display: "none" }} />
        <button
          type="button"
          onClick={handleMic}
          disabled={transcribing || !recorder.supported}
          aria-label={recorder.recording ? t("scamCheck.stop") : t("scamCheck.speak")}
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
          {loading ? t("fairPrice.checking") : t("fairPrice.checkPrice")}
        </button>
      </div>

      <PrivacyNotice what={t("fairPrice.privacyWhat")} />

      {apiNotice ? (
        <p
          style={{
            marginTop: 12,
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

      {result ? (
        <div style={{ marginTop: 16, display: "grid", gap: 12 }}>
          <TrustBadge score={result.trustScore} label={result.verdict} />

          {result.extractedItems?.length ? (
            <div>
              <strong>Prices I found</strong>
              <ul style={{ margin: "6px 0 0" }}>
                {result.extractedItems.map((entry) => (
                  <li key={`${entry.name}-${entry.priceVnd}`}>
                    {entry.name}: {entry.priceVnd.toLocaleString("en-US")} VND
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {result.groundingMatches?.length ? (
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 12,
                background: "rgba(61, 107, 98, 0.12)",
                border: `1px solid ${theme.colors.border}`,
                fontSize: 13,
              }}
            >
              <strong style={{ color: theme.colors.tealDeep }}>Typical local range</strong>
              <ul style={{ margin: "6px 0 0", paddingLeft: 18 }}>
                {result.groundingMatches.map((match) => (
                  <li key={`${match.label}-${match.rangeVnd[0]}`}>
                    {match.label}
                    {match.city ? ` · ${match.city}` : ""}:{" "}
                    {match.rangeVnd[0].toLocaleString("en-US")}–{match.rangeVnd[1].toLocaleString("en-US")}{" "}
                    VND
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {result.liveEstimates?.length ? (
            <div>
              <strong>Compare on apps</strong>
              <ul style={{ margin: "6px 0 0" }}>
                {result.liveEstimates.map((link) => (
                  <li key={link.url}>
                    <a href={link.url} target="_blank" rel="noreferrer" style={{ color: theme.colors.primary }}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {result.warnings.length > 0 ? (
            <div>
              <strong>{t("assistant.warnings")}</strong>
              <ul>
                {result.warnings.map((warning) => (
                  <li key={warning}>{warning}</li>
                ))}
              </ul>
            </div>
          ) : null}
          {result.supportingReasons.length > 0 ? (
            <div>
              <strong>{t("assistant.travelersSay")}</strong>
              <ul>
                {result.supportingReasons.map((reason) => (
                  <li key={reason}>{reason}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}

      <form
        onSubmit={handleReport}
        style={{
          marginTop: 18,
          paddingTop: 16,
          borderTop: `1px solid ${theme.colors.border}`,
          display: "grid",
          gap: 10,
        }}
      >
        <strong style={{ color: theme.colors.text }}>{t("fairPrice.reportTitle")}</strong>
        <p style={{ margin: 0, fontSize: 13, color: theme.colors.textLight }}>{t("fairPrice.reportHint")}</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <select
            value={reportCity}
            onChange={(event) => setReportCity(event.target.value)}
            style={{
              padding: "10px 12px",
              borderRadius: theme.borderRadius.button,
              border: `1px solid ${theme.colors.border}`,
              background: "#FAF7F2",
              fontFamily: "inherit",
            }}
          >
            <option value="Hà Nội">Hà Nội</option>
            <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
            <option value="Đà Nẵng">Đà Nẵng</option>
          </select>
          <input
            value={reportAmount}
            onChange={(event) => setReportAmount(event.target.value)}
            placeholder={t("fairPrice.reportAmount")}
            style={{
              padding: "10px 12px",
              borderRadius: theme.borderRadius.button,
              border: `1px solid ${theme.colors.border}`,
              background: "#FAF7F2",
              fontFamily: "inherit",
              boxSizing: "border-box",
            }}
          />
        </div>
        <input
          value={reportItem}
          onChange={(event) => setReportItem(event.target.value)}
          placeholder={t("fairPrice.reportItem")}
          style={{
            padding: "10px 12px",
            borderRadius: theme.borderRadius.button,
            border: `1px solid ${theme.colors.border}`,
            background: "#FAF7F2",
            fontFamily: "inherit",
            boxSizing: "border-box",
          }}
        />
        <button
          type="submit"
          style={{
            ...buttonBase,
            background: "rgba(155, 44, 31, 0.12)",
            color: theme.colors.primary,
            width: "fit-content",
          }}
        >
          {t("fairPrice.reportSubmit")}
        </button>
        {reportStatus ? (
          <small style={{ color: theme.colors.textLight }}>{reportStatus}</small>
        ) : null}
      </form>
    </section>
  );
}
