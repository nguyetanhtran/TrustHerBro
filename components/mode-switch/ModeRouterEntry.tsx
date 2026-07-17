"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { AppMode } from "../../lib/ai/types";
import { ChatInput } from "../shared/ChatInput";
import { ModeIndicator } from "./ModeIndicator";

const modeRoutes: Record<AppMode, string> = {
  assistant: "/assistant",
  "first-night": "/onboarding",
  safety: "/safety",
  emergency: "/emergency",
};

export function ModeRouterEntry() {
  const router = useRouter();
  const [detected, setDetected] = useState<{ mode: AppMode; reason: string } | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSend(value: string) {
    setLoading(true);
    try {
      const response = await fetch("/api/mode-router", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: value }),
      });
      const data = (await response.json()) as { mode: AppMode; reason: string };
      setDetected(data);
      router.push(modeRoutes[data.mode]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      style={{
        marginTop: 20,
        padding: 18,
        borderRadius: 18,
        background: "#f8fafc",
        border: "1px solid #e2e8f0",
        display: "grid",
        gap: 12,
      }}
    >
      <strong>Tell us what is going on</strong>
      <p style={{ margin: 0 }}>
        Type what you need help with and we will route you to the right mode.
      </p>
      <ChatInput
        disabled={loading}
        placeholder="Example: I just landed and don't know what to do first"
        onSend={handleSend}
      />
      {detected ? (
        <ModeIndicator mode={detected.mode} label="Detected mode" />
      ) : null}
    </section>
  );
}
