"use client";

import { useState } from "react";
import type { ChatMessage, RiskAssessment } from "../../lib/ai/types";
import { ChatInput } from "../shared/ChatInput";
import { RouteSafetyCard } from "./RouteSafetyCard";
import { DiscreetModeToggle } from "./DiscreetModeToggle";

const initialMessages: ChatMessage[] = [
  {
    id: "welcome",
    role: "assistant",
    content: "Tell me what is happening and I will suggest the safest next move.",
  },
];

export function SafetyChat() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [assessment, setAssessment] = useState<RiskAssessment | null>(null);
  const [discreetMode, setDiscreetMode] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSend(value: string) {
    const nextMessages: ChatMessage[] = [
      ...messages,
      { id: crypto.randomUUID(), role: "user", content: value },
    ];
    setMessages(nextMessages);
    setLoading(true);

    try {
      const response = await fetch("/api/safety-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: value }),
      });
      const data = (await response.json()) as RiskAssessment;
      setAssessment(data);
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: data.summary,
        },
      ]);

      if (discreetMode) {
        await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: data.summary }),
        });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: "grid", gap: 18 }}>
      <div
        style={{
          background: "#ffffff",
          padding: 20,
          borderRadius: 20,
          border: "1px solid #e2e8f0",
        }}
      >
        <div style={{ display: "grid", gap: 12, marginBottom: 18 }}>
          {messages.map((message) => (
            <div
              key={message.id}
              style={{
                padding: 14,
                borderRadius: 14,
                background:
                  message.role === "assistant" ? "#eff6ff" : "#fff7ed",
              }}
            >
              <strong style={{ textTransform: "capitalize" }}>{message.role}</strong>
              <p style={{ marginBottom: 0 }}>{message.content}</p>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gap: 12 }}>
          <DiscreetModeToggle enabled={discreetMode} onChange={setDiscreetMode} />
          <button
            type="button"
            style={{
              padding: "14px 16px",
              borderRadius: 14,
              border: "none",
              background: "#dc2626",
              color: "#ffffff",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            I feel unsafe
          </button>
          <ChatInput
            disabled={loading}
            placeholder="Example: A man is following me from the station."
            onSend={handleSend}
          />
        </div>
      </div>

      {assessment ? <RouteSafetyCard assessment={assessment} /> : null}
    </div>
  );
}
