type OpenAiTtsRequest = {
  text: string;
  voice?: string;
  /** Language hint, kept for parity/logging. gpt-4o-mini-tts is multilingual. */
  lang?: string;
};

type TtsResult = {
  /** data: URL with the mp3 audio, or null when synthesis was skipped. */
  audioUrl: string | null;
  text: string;
  voice: string;
  lang: string;
  /** true when no real audio was produced — the client should use browser TTS. */
  mocked: boolean;
  reason?: string;
};

const OPENAI_TTS_URL = "https://api.openai.com/v1/audio/speech";

/**
 * Text-to-speech via OpenAI. A single multilingual voice reads both English
 * guidance and Vietnamese phrases, so Discreet Mode works for a non-Vietnamese
 * speaker without a separate Vietnamese engine. The client falls back to the
 * browser SpeechSynthesis API whenever this returns { mocked: true }.
 */
export async function synthesizeSpeech({
  text,
  voice = "nova",
  lang = "vi",
}: OpenAiTtsRequest): Promise<TtsResult> {
  const base = { text, voice, lang };
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return { ...base, audioUrl: null, mocked: true, reason: "no-credentials" };
  }

  try {
    const res = await fetch(OPENAI_TTS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini-tts",
        input: text,
        voice,
        response_format: "mp3",
      }),
    });

    if (!res.ok) {
      return { ...base, audioUrl: null, mocked: true, reason: `http-${res.status}` };
    }

    const buffer = Buffer.from(await res.arrayBuffer());
    const audioUrl = `data:audio/mpeg;base64,${buffer.toString("base64")}`;

    return { ...base, audioUrl, mocked: false };
  } catch {
    return { ...base, audioUrl: null, mocked: true, reason: "request-error" };
  }
}
