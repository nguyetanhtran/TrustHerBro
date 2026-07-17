type TranscriptionResult = {
  text: string;
  /** true when no real transcription happened — client should let her type. */
  mocked: boolean;
  reason?: string;
};

const OPENAI_TRANSCRIBE_URL = "https://api.openai.com/v1/audio/transcriptions";

/**
 * Speech-to-text via OpenAI Whisper. Audio is transcribed and NOT stored —
 * the buffer only lives for the length of this request. If no key is set the
 * client falls back to typing.
 */
export async function transcribeAudio(file: File): Promise<TranscriptionResult> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return { text: "", mocked: true, reason: "no-credentials" };
  }

  try {
    const form = new FormData();
    form.append("file", file, file.name || "audio.webm");
    form.append("model", "whisper-1");

    const res = await fetch(OPENAI_TRANSCRIBE_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}` },
      body: form,
    });

    if (!res.ok) {
      return { text: "", mocked: true, reason: `http-${res.status}` };
    }

    const data = await res.json();
    return { text: String(data?.text ?? ""), mocked: false };
  } catch {
    return { text: "", mocked: true, reason: "request-error" };
  }
}
