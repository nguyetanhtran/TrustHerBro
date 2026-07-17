"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { ChatMessage, RiskAssessment } from "../../lib/ai/types";
import type { Coordinates } from "../../lib/utils/geolocation";
import { speakGuidance, stopSpeaking } from "../../lib/utils/speech";
import { ChatInput } from "../shared/ChatInput";
import { PrivacyNotice } from "../shared/PrivacyNotice";
import { SituationChips } from "./SituationChips";
import { RouteSafetyCard } from "./RouteSafetyCard";
import { TransportCard } from "./TransportCard";
import { SafetyPhrasesCard } from "./SafetyPhrasesCard";
import { CheckInCard } from "./CheckInCard";
import { DiscreetModeToggle } from "./DiscreetModeToggle";
import { EscalateToEmergency } from "./EscalateToEmergency";

const toggleStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  padding: 14,
  borderRadius: 14,
  background: "#f8fafc",
} as const;

const initialMessages: ChatMessage[] = [
  {
    id: "welcome",
    role: "assistant",
    content:
      "I'm right here with you. Tell me what feels off — we'll sort it out together, calmly.",
  },
];

export function SafetyChat() {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [assessment, setAssessment] = useState<RiskAssessment | null>(null);
  const [discreetMode, setDiscreetMode] = useState(false);
  const [shareLocation, setShareLocation] = useState(false);
  const [loading, setLoading] = useState(false);
  const coordsRef = useRef<Coordinates | null>(null);

  // Location is opt-in: we only ask the browser for it once she turns it on.
  function handleLocationChange(enabled: boolean) {
    setShareLocation(enabled);
    if (!enabled) {
      coordsRef.current = null;
      return;
    }
    if (typeof navigator === "undefined" || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        coordsRef.current = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      },
      () => {
        coordsRef.current = null;
        setShareLocation(false);
      },
      { enableHighAccuracy: false, timeout: 8000 },
    );
  }

  async function requestAssessment(value: string) {
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
        body: JSON.stringify({
          message: value,
          location: shareLocation ? coordsRef.current ?? undefined : undefined,
        }),
      });
      const data = (await response.json()) as RiskAssessment;
      setAssessment(data);

      const reply = `${data.summary} ${data.offer}`.trim();
      setMessages((current) => [
        ...current,
        { id: crypto.randomUUID(), role: "assistant", content: reply },
      ]);

      // Discreet Mode: read English guidance quietly through earphones.
      if (discreetMode) {
        const spoken = [data.summary, data.actions[0]].filter(Boolean).join(". ");
        speakGuidance(spoken);
      }
    } finally {
      setLoading(false);
    }
  }

  function handleDiscreetChange(value: boolean) {
    setDiscreetMode(value);
    if (!value) stopSpeaking();
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

        <div style={{ display: "grid", gap: 14 }}>
          <SituationChips disabled={loading} onPick={requestAssessment} />
          <ChatInput
            disabled={loading}
            placeholder="Or type it in your own words…"
            onSend={requestAssessment}
          />
          <DiscreetModeToggle enabled={discreetMode} onChange={handleDiscreetChange} />
          <label style={toggleStyle}>
            <span>
              <strong>Share my location</strong>
              <br />
              <small style={{ color: "#64748b" }}>
                Off by default. Turn on for a route tailored to where you are.
              </small>
            </span>
            <input
              type="checkbox"
              checked={shareLocation}
              onChange={(event) => handleLocationChange(event.target.checked)}
            />
          </label>
          <PrivacyNotice what="What you type here (and your location, only if shared)" />
        </div>
      </div>

      {assessment ? (
        <>
          <RouteSafetyCard assessment={assessment} />
          <TransportCard options={assessment.transport} />
          <SafetyPhrasesCard phrases={assessment.phrases} />
          <CheckInCard
            intervalMinutes={assessment.checkInMinutes}
            onEscalate={() => router.push("/emergency")}
          />
        </>
      ) : null}

      <EscalateToEmergency />
    </div>
  );
}
