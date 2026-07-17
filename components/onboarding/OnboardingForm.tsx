"use client";

import type { CSSProperties, FormEvent } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { OnboardingAnswers, SurvivalTimelinePayload } from "../../lib/ai/types";

const questions = [
  ["destination", "Which city are you arriving in?"],
  ["arrivalTime", "When do you arrive?"],
  ["transportPlan", "How will you leave the airport or station?"],
  ["stayType", "Where are you staying tonight?"],
  ["budgetLevel", "What's your budget comfort level?"],
  ["languageComfort", "How comfortable are you with the local language?"],
  ["topConcern", "What is your biggest first-night concern?"],
] as const;

const inputStyle: CSSProperties = {
  padding: "12px 14px",
  borderRadius: 12,
  border: "1px solid #cbd5e1",
  width: "100%",
  fontSize: 15,
};

export function OnboardingForm() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Partial<OnboardingAnswers>>({});
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<SurvivalTimelinePayload | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/first-night", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      const data = (await response.json()) as SurvivalTimelinePayload;
      setPreview(data);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "grid",
          gap: 16,
          background: "#ffffff",
          padding: 24,
          borderRadius: 24,
          border: "1px solid #e2e8f0",
        }}
      >
        {questions.map(([key, label]) => (
          <label key={key} style={{ display: "grid", gap: 8 }}>
            <span style={{ fontWeight: 600 }}>{label}</span>
            <input
              style={inputStyle}
              value={answers[key] ?? ""}
              onChange={(event) =>
                setAnswers((current) => ({
                  ...current,
                  [key]: event.target.value,
                }))
              }
              placeholder="Type a short answer"
            />
          </label>
        ))}

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "12px 16px",
              borderRadius: 14,
              border: "none",
              background: "#ea580c",
              color: "#ffffff",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {loading ? "Generating..." : "Create survival timeline"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/timeline")}
            style={{
              padding: "12px 16px",
              borderRadius: 14,
              border: "1px solid #cbd5e1",
              background: "#ffffff",
              color: "#1e293b",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Open timeline preview
          </button>
        </div>
      </form>

      {preview ? (
        <div
          style={{
            background: "#fff7ed",
            border: "1px solid #fdba74",
            borderRadius: 24,
            padding: 24,
          }}
        >
          <h2 style={{ marginTop: 0 }}>{preview.title}</h2>
          <p>{preview.summary}</p>
          <ol style={{ paddingLeft: 18, marginBottom: 0 }}>
            {preview.steps.map((step) => (
              <li key={step.id} style={{ marginBottom: 10 }}>
                <strong>{step.title}</strong>: {step.description}
              </li>
            ))}
          </ol>
        </div>
      ) : null}
    </div>
  );
}
