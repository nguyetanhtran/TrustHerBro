"use client";

import type { CSSProperties } from "react";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { AppMode } from "../../lib/ai/types";
import { useVoiceRecorder } from "../../lib/utils/useVoiceRecorder";
import { useLanguage } from "../../lib/i18n/LanguageContext";

type Bubble = {
  id: string;
  role: "user" | "assistant";
  text: string;
  image?: string;
  suggestedMode?: AppMode | null;
  suggestedLabel?: string | null;
};

const MODE_ROUTES: Record<AppMode, string> = {
  "first-night": "/onboarding",
  assistant: "/assistant",
  safety: "/safety",
  emergency: "/emergency",
};

const shellStyle: CSSProperties = {
  background: "#ffffff",
  borderRadius: 24,
  border: "1px solid #e2e8f0",
  boxShadow: "0 18px 50px rgba(15, 23, 42, 0.08)",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
};

const threadStyle: CSSProperties = {
  padding: 16,
  display: "grid",
  gap: 10,
  minHeight: 120,
  maxHeight: 420,
  overflowY: "auto",
};

const inputBarStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  padding: 12,
  borderTop: "1px solid #e2e8f0",
  background: "#f8fafc",
};

const iconButton = (active = false): CSSProperties => ({
  flexShrink: 0,
  width: 44,
  height: 44,
  borderRadius: 14,
  border: "1px solid #cbd5e1",
  background: active ? "#dc2626" : "#ffffff",
  color: active ? "#ffffff" : "#334155",
  fontSize: 18,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const inputStyle: CSSProperties = {
  flex: 1,
  minWidth: 0,
  padding: "12px 14px",
  borderRadius: 14,
  border: "1px solid #cbd5e1",
  fontSize: 15,
};

const sendStyle: CSSProperties = {
  flexShrink: 0,
  padding: "12px 18px",
  borderRadius: 14,
  border: "none",
  background: "#1d4ed8",
  color: "#ffffff",
  fontWeight: 700,
  cursor: "pointer",
};

export function CompanionChat() {
  const router = useRouter();
  const { language, t } = useLanguage();
  const recorder = useVoiceRecorder();
  const fileRef = useRef<HTMLInputElement>(null);
  const threadRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Bubble[]>(() => [
    { id: "welcome", role: "assistant", text: t("companion.welcome") },
  ]);
  const [text, setText] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [transcribing, setTranscribing] = useState(false);

  function scrollToEnd() {
    requestAnimationFrame(() => {
      threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight, behavior: "smooth" });
    });
  }

  function onPickImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
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
        if (data?.text) setText((cur) => (cur ? `${cur} ${data.text}` : data.text));
      } finally {
        setTranscribing(false);
      }
    } else {
      await recorder.start();
    }
  }

  async function handleSend() {
    if (!text.trim() && !image) return;

    const userBubble: Bubble = {
      id: crypto.randomUUID(),
      role: "user",
      text: text.trim(),
      image: image ?? undefined,
    };
    setMessages((cur) => [...cur, userBubble]);
    const sentText = text.trim();
    const sentImage = image;
    setText("");
    setImage(null);
    setLoading(true);
    scrollToEnd();

    try {
      const res = await fetch("/api/companion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: sentText, image: sentImage, language }),
      });
      const data = await res.json();
      setMessages((cur) => [
        ...cur,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          text: data.reply ?? t("companion.fallbackReply"),
          suggestedMode: data.suggestedMode ?? null,
          suggestedLabel: data.suggestedLabel ?? null,
        },
      ]);
    } finally {
      setLoading(false);
      scrollToEnd();
    }
  }

  return (
    <div style={shellStyle}>
      <div ref={threadRef} style={threadStyle}>
        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              justifySelf: message.role === "user" ? "end" : "start",
              maxWidth: "80%",
              padding: "10px 13px",
              borderRadius: 14,
              fontSize: 14,
              lineHeight: 1.5,
              background: message.role === "user" ? "#1d4ed8" : "#eff6ff",
              color: message.role === "user" ? "#ffffff" : "#0f172a",
            }}
          >
            {message.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={message.image}
                alt="attachment"
                style={{ maxWidth: "100%", borderRadius: 10, marginBottom: message.text ? 8 : 0 }}
              />
            ) : null}
            {message.text ? <p style={{ margin: 0 }}>{message.text}</p> : null}
            {message.suggestedMode ? (
              <button
                type="button"
                onClick={() => router.push(MODE_ROUTES[message.suggestedMode as AppMode])}
                style={{
                  marginTop: 10,
                  padding: "8px 14px",
                  borderRadius: 10,
                  border: "none",
                  background: "#0f172a",
                  color: "#ffffff",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {message.suggestedLabel ?? t("companion.open")} →
              </button>
            ) : null}
          </div>
        ))}
        {loading ? (
          <div style={{ justifySelf: "start", color: "#64748b" }}>{t("companion.thinking")}</div>
        ) : null}
      </div>

      {image ? (
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", background: "#f1f5f9" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt="preview" style={{ height: 44, borderRadius: 8 }} />
          <span style={{ fontSize: 13, color: "#475569" }}>{t("companion.photoAttached")}</span>
          <button
            type="button"
            onClick={() => setImage(null)}
            style={{ marginLeft: "auto", border: "none", background: "none", color: "#dc2626", cursor: "pointer", fontWeight: 700 }}
          >
            {t("companion.remove")}
          </button>
        </div>
      ) : null}

      <div style={inputBarStyle}>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={onPickImage}
          style={{ display: "none" }}
        />
        <button
          type="button"
          style={iconButton()}
          onClick={() => fileRef.current?.click()}
          aria-label={t("companion.addPhoto")}
          title={t("companion.addPhoto")}
        >
          📷
        </button>
        <button
          type="button"
          style={iconButton(recorder.recording)}
          onClick={handleMic}
          disabled={transcribing || !recorder.supported}
          aria-label={recorder.recording ? t("scamCheck.stop") : t("scamCheck.speak")}
          title={recorder.recording ? t("scamCheck.stop") : t("scamCheck.speak")}
        >
          {recorder.recording ? "■" : "🎤"}
        </button>
        <input
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") handleSend();
          }}
          placeholder={transcribing ? t("scamCheck.transcribing") : t("companion.inputPlaceholder")}
          style={inputStyle}
          disabled={loading}
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={loading || transcribing || (!text.trim() && !image)}
          style={sendStyle}
        >
          {t("companion.send")}
        </button>
      </div>
    </div>
  );
}
