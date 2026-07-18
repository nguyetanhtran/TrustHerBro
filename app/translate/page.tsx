"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../../lib/i18n/LanguageContext";
import { LANGUAGE_NAMES } from "../../lib/i18n/translations";
import { useVoiceRecorder } from "../../lib/utils/useVoiceRecorder";
import { speakInLanguage, stopSpeaking } from "../../lib/utils/speech";
import { buildMapsSearchLink } from "../../lib/utils/mapsLink";
import {
  appendTranslateMessage,
  loadTranslateHistory,
  searchTranslateHistory,
  type TranslateMessage,
  type TranslateSpeaker,
} from "../../lib/utils/translateHistory";
import { theme } from "../../lib/theme";

const LOCAL_LANGUAGE_CODE = "vi";
const LOCAL_LANGUAGE_NAME = "Tiếng Việt (Vietnamese)";

const wrapStyle: CSSProperties = {
  maxWidth: 860,
  margin: "0 auto",
  padding: "40px 24px 80px",
};

const cardShell: CSSProperties = {
  background: theme.colors.card,
  border: `1px solid ${theme.colors.border}`,
  borderRadius: theme.borderRadius.card,
  boxShadow: theme.shadows.soft,
  padding: 24,
};

const toggleButton = (active: boolean): CSSProperties => ({
  flex: 1,
  padding: "12px 16px",
  borderRadius: theme.borderRadius.button,
  border: `1px solid ${active ? theme.colors.primary : theme.colors.border}`,
  background: active ? theme.colors.primary : "transparent",
  color: active ? "#ffffff" : theme.colors.text,
  fontWeight: 700,
  cursor: "pointer",
});

const inputStyle: CSSProperties = {
  flex: 1,
  minWidth: 0,
  padding: "12px 14px",
  borderRadius: theme.borderRadius.button,
  border: `1px solid ${theme.colors.border}`,
  fontSize: 15,
  background: "#ffffff",
  color: theme.colors.text,
};

const iconButton = (active = false): CSSProperties => ({
  flexShrink: 0,
  width: 44,
  height: 44,
  borderRadius: theme.borderRadius.button,
  border: `1px solid ${theme.colors.border}`,
  background: active ? theme.colors.primary : "#ffffff",
  color: active ? "#ffffff" : theme.colors.text,
  fontSize: 18,
  cursor: "pointer",
});

const sendButton: CSSProperties = {
  flexShrink: 0,
  padding: "12px 18px",
  borderRadius: theme.borderRadius.button,
  border: "none",
  background: theme.colors.primary,
  color: "#ffffff",
  fontWeight: 700,
  cursor: "pointer",
};

const bubbleStyle = (isTraveler: boolean): CSSProperties => ({
  maxWidth: "85%",
  marginLeft: isTraveler ? "auto" : 0,
  padding: 14,
  borderRadius: 14,
  background: isTraveler ? theme.colors.paper : "#FAF7F2",
  border: `1px solid ${theme.colors.border}`,
});

function MessageBubble({
  message,
  travelerLanguageCode,
}: {
  message: TranslateMessage;
  travelerLanguageCode: string;
}) {
  const { t } = useLanguage();
  const isTraveler = message.speaker === "traveler";
  // The translated text is read aloud in whichever language the *listener*
  // needs — the opposite side from who spoke.
  const playbackLangCode = isTraveler ? LOCAL_LANGUAGE_CODE : travelerLanguageCode;

  return (
    <div style={bubbleStyle(isTraveler)}>
      <p style={{ margin: "0 0 6px", fontSize: 13, color: theme.colors.textLight }}>
        {message.originalText}
      </p>
      <p style={{ margin: 0, fontWeight: 600, color: theme.colors.text }}>
        {message.translatedText}
      </p>
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 10, flexWrap: "wrap" }}>
        <button
          type="button"
          onClick={() => speakInLanguage(message.translatedText, playbackLangCode)}
          style={{
            border: "none",
            background: "none",
            color: theme.colors.primary,
            fontWeight: 700,
            fontSize: 13,
            cursor: "pointer",
            padding: 0,
          }}
        >
          🔊 {t("translate.play")}
        </button>
        {message.suggestedPlace ? (
          <a
            href={buildMapsSearchLink(`${message.suggestedPlace}, Vietnam`)}
            target="_blank"
            rel="noreferrer"
            style={{ fontSize: 13, fontWeight: 700, color: theme.colors.secondary }}
          >
            📍 {t("timeline.openMaps")}
          </a>
        ) : null}
      </div>
    </div>
  );
}

export default function TranslatePage() {
  const { language, t } = useLanguage();
  const recorder = useVoiceRecorder();
  const fileRef = useRef<HTMLInputElement>(null);

  const [speaker, setSpeaker] = useState<TranslateSpeaker>("traveler");
  const [text, setText] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [transcribing, setTranscribing] = useState(false);
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<TranslateMessage[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setMessages(loadTranslateHistory());
    return () => stopSpeaking();
  }, []);

  const travelerLanguageName = LANGUAGE_NAMES[language] ?? LANGUAGE_NAMES.en;

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
        if (data?.text) setText((current) => (current ? `${current} ${data.text}` : data.text));
      } finally {
        setTranscribing(false);
      }
    } else {
      await recorder.start();
    }
  }

  async function handleSend() {
    if (!text.trim() && !image) return;

    const sourceLanguage = speaker === "traveler" ? travelerLanguageName : LOCAL_LANGUAGE_NAME;
    const targetLanguage = speaker === "traveler" ? LOCAL_LANGUAGE_NAME : travelerLanguageName;
    const sentText = text.trim();
    const sentImage = image;

    setText("");
    setImage(null);
    setSending(true);

    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: sentText, image: sentImage, sourceLanguage, targetLanguage }),
      });
      const data = await res.json();

      const message: TranslateMessage = {
        id: crypto.randomUUID(),
        speaker,
        originalText: sentText || "📷 Photo",
        translatedText: data?.translation ?? "",
        suggestedPlace: data?.suggestedPlace ?? null,
        timestamp: Date.now(),
      };

      setMessages(appendTranslateMessage(message));
    } finally {
      setSending(false);
    }
  }

  const visibleMessages = searchTranslateHistory(messages, search);

  return (
    <main style={wrapStyle}>
      <h1 style={{ fontSize: 32, fontWeight: 800, color: theme.colors.text, marginBottom: 6 }}>
        {t("translate.title")}
      </h1>
      <p style={{ color: theme.colors.textLight, marginBottom: 24, lineHeight: 1.6 }}>
        {t("translate.description")}
      </p>

      <div style={{ ...cardShell, marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          <button
            type="button"
            style={toggleButton(speaker === "traveler")}
            onClick={() => setSpeaker("traveler")}
          >
            {t("translate.travelerToggle")}
          </button>
          <button
            type="button"
            style={toggleButton(speaker === "local")}
            onClick={() => setSpeaker("local")}
          >
            {t("translate.localToggle")}
          </button>
        </div>

        {image ? (
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image} alt="preview" style={{ height: 48, borderRadius: 8 }} />
            <button
              type="button"
              onClick={() => setImage(null)}
              style={{ border: "none", background: "none", color: theme.colors.primary, fontWeight: 700, cursor: "pointer" }}
            >
              {t("companion.remove")}
            </button>
          </div>
        ) : null}

        <div style={{ display: "flex", gap: 8 }}>
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
            aria-label={t("translate.addPhoto")}
            title={t("translate.addPhoto")}
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
            placeholder={transcribing ? t("scamCheck.transcribing") : t("translate.inputPlaceholder")}
            style={inputStyle}
            disabled={sending}
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={sending || transcribing || (!text.trim() && !image)}
            style={sendButton}
          >
            {sending ? t("translate.sending") : t("translate.send")}
          </button>
        </div>
      </div>

      <div style={cardShell}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
          <h2 style={{ margin: 0, fontSize: 18, color: theme.colors.text }}>{t("translate.historyTitle")}</h2>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t("translate.searchPlaceholder")}
            style={{ ...inputStyle, flex: "0 1 240px" }}
          />
        </div>

        {visibleMessages.length ? (
          <div style={{ display: "grid", gap: 12 }}>
            {visibleMessages.map((message) => (
              <MessageBubble key={message.id} message={message} travelerLanguageCode={language} />
            ))}
          </div>
        ) : (
          <p style={{ color: theme.colors.textLight }}>
            {messages.length ? t("translate.noResults") : t("translate.noHistory")}
          </p>
        )}
      </div>
    </main>
  );
}
