"use client";

/**
 * Client-side speech helpers for Safety Mode.
 *
 * Both English guidance (Discreet Mode, earphones) and Vietnamese
 * self-protection phrases go through OpenAI TTS via /api/tts. If that is
 * unavailable (no key, offline, error) we fall back to the browser
 * SpeechSynthesis API so the feature still works during a demo.
 */

let currentAudio: HTMLAudioElement | null = null;

function canSpeak() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

/** Speak text with the browser. lang is a BCP-47 tag, e.g. "en-US" or "vi-VN". */
export function speakWithBrowser(text: string, lang = "en-US") {
  if (!canSpeak() || !text.trim()) return;

  const synth = window.speechSynthesis;
  synth.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 1;

  const preferred = synth
    .getVoices()
    .find((voice) => voice.lang?.toLowerCase().startsWith(lang.slice(0, 2)));
  if (preferred) utterance.voice = preferred;

  synth.speak(utterance);
}

export function stopSpeaking() {
  if (canSpeak()) window.speechSynthesis.cancel();
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
}

/** Play text through OpenAI TTS; fall back to the browser voice on failure. */
async function playServerTts(text: string, lang: string, browserLang: string) {
  if (!text.trim()) return;

  try {
    const res = await fetch("/api/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, lang }),
    });
    const data = await res.json();

    if (data?.audioUrl) {
      stopSpeaking();
      const audio = new Audio(data.audioUrl as string);
      currentAudio = audio;
      await audio.play();
      return;
    }
  } catch {
    // fall through to browser TTS
  }

  speakWithBrowser(text, browserLang);
}

/** Speak English guidance (Discreet Mode, earphones). */
export function speakGuidance(text: string) {
  return playServerTts(text, "en", "en-US");
}

/** Play a Vietnamese phrase out loud. */
export function playVietnamesePhrase(text: string) {
  return playServerTts(text, "vi", "vi-VN");
}
