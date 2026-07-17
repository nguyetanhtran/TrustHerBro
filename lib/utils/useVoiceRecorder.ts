"use client";

import { useRef, useState } from "react";

type RecorderState = {
  recording: boolean;
  supported: boolean;
  error: string | null;
  start: () => Promise<void>;
  /** Stops recording and resolves with the recorded audio (or null on error). */
  stop: () => Promise<Blob | null>;
};

export function useVoiceRecorder(): RecorderState {
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const supported =
    typeof navigator !== "undefined" &&
    !!navigator.mediaDevices &&
    typeof window !== "undefined" &&
    "MediaRecorder" in window;

  async function start() {
    setError(null);
    if (!supported) {
      setError("Recording isn't supported on this device.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };

      recorder.start();
      recorderRef.current = recorder;
      setRecording(true);
    } catch {
      setError("Microphone access was blocked.");
    }
  }

  function stop(): Promise<Blob | null> {
    return new Promise((resolve) => {
      const recorder = recorderRef.current;
      if (!recorder) {
        resolve(null);
        return;
      }

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        recorder.stream.getTracks().forEach((track) => track.stop());
        recorderRef.current = null;
        setRecording(false);
        resolve(blob.size > 0 ? blob : null);
      };

      recorder.stop();
    });
  }

  return { recording, supported, error, start, stop };
}
