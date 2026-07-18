"use client";

import type { CSSProperties } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../utils/supabase/client";
import {
  LANGUAGES,
  INTERESTS,
  DEFAULT_LANGUAGE,
  greetingFor,
  type LanguageCode,
} from "../../lib/i18n";

const STEPS = ["welcome", "language", "interests", "location", "ready"] as const;
type Step = (typeof STEPS)[number];

const cardStyle: CSSProperties = {
  maxWidth: 480,
  margin: "0 auto",
  padding: 28,
  borderRadius: 22,
  background: "#ffffff",
  border: "1px solid #e2e8f0",
  boxShadow: "0 18px 50px rgba(15, 23, 42, 0.08)",
};

const primaryButton: CSSProperties = {
  padding: "13px 18px",
  borderRadius: 14,
  border: "none",
  background: "#1d4ed8",
  color: "#ffffff",
  fontWeight: 700,
  fontSize: 15,
  cursor: "pointer",
};

const ghostButton: CSSProperties = {
  padding: "13px 18px",
  borderRadius: 14,
  border: "1px solid #cbd5e1",
  background: "#ffffff",
  color: "#334155",
  fontWeight: 600,
  cursor: "pointer",
};

const chip = (active: boolean): CSSProperties => ({
  padding: "10px 16px",
  borderRadius: 999,
  border: `1px solid ${active ? "#1d4ed8" : "#cbd5e1"}`,
  background: active ? "#dbeafe" : "#ffffff",
  color: active ? "#1e3a8a" : "#334155",
  fontWeight: 600,
  cursor: "pointer",
});

export function WelcomeWizard() {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [language, setLanguage] = useState<LanguageCode>(DEFAULT_LANGUAGE);
  const [interests, setInterests] = useState<string[]>([]);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [locationAsked, setLocationAsked] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const step: Step = STEPS[stepIndex];

  function next() {
    setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  }
  function back() {
    setStepIndex((i) => Math.max(i - 1, 0));
  }

  function toggleInterest(value: string) {
    setInterests((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
    );
  }

  function askLocation() {
    setLocationAsked(true);
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setLocationEnabled(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      () => setLocationEnabled(true),
      () => setLocationEnabled(false),
      { enableHighAccuracy: false, timeout: 8000 },
    );
  }

  async function finish() {
    setSaving(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({
      data: { language, interests, locationEnabled, onboarded: true },
    });
    if (error) {
      setError(error.message);
      setSaving(false);
      return;
    }
    router.refresh();
    router.push("/");
  }

  return (
    <div style={cardStyle}>
      {/* progress dots */}
      <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
        {STEPS.map((s, i) => (
          <span
            key={s}
            style={{
              flex: 1,
              height: 4,
              borderRadius: 999,
              background: i <= stepIndex ? "#1d4ed8" : "#e2e8f0",
            }}
          />
        ))}
      </div>

      {step === "welcome" ? (
        <>
          <h1 style={{ marginTop: 0 }}>{greetingFor(language)} 👋</h1>
          <p style={{ color: "#475569", lineHeight: 1.6 }}>
            I'm your safety companion for your first hours in Vietnam. Let's set
            things up in a few taps — it takes about 30 seconds.
          </p>
          <button type="button" style={primaryButton} onClick={next}>
            Get started
          </button>
        </>
      ) : null}

      {step === "language" ? (
        <>
          <h2 style={{ marginTop: 0 }}>Choose your language</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, margin: "16px 0" }}>
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                type="button"
                style={chip(language === lang.code)}
                onClick={() => setLanguage(lang.code)}
              >
                {lang.label}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button type="button" style={ghostButton} onClick={back}>
              Back
            </button>
            <button type="button" style={{ ...primaryButton, flex: 1 }} onClick={next}>
              Continue
            </button>
          </div>
        </>
      ) : null}

      {step === "interests" ? (
        <>
          <h2 style={{ marginTop: 0 }}>What are you into?</h2>
          <p style={{ color: "#64748b", marginTop: 0 }}>
            Pick a few — I'll tailor suggestions to you. (Optional)
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, margin: "16px 0" }}>
            {INTERESTS.map((interest) => (
              <button
                key={interest}
                type="button"
                style={chip(interests.includes(interest))}
                onClick={() => toggleInterest(interest)}
              >
                {interest}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button type="button" style={ghostButton} onClick={back}>
              Back
            </button>
            <button type="button" style={{ ...primaryButton, flex: 1 }} onClick={next}>
              Continue
            </button>
          </div>
        </>
      ) : null}

      {step === "location" ? (
        <>
          <h2 style={{ marginTop: 0 }}>Allow location</h2>
          <p style={{ color: "#475569", lineHeight: 1.6 }}>
            With your location I can suggest the safest nearby routes and places.
            It's optional and you can change it anytime.
          </p>
          {locationAsked ? (
            <p style={{ color: locationEnabled ? "#166534" : "#b45309", fontWeight: 600 }}>
              {locationEnabled
                ? "Location enabled — thank you."
                : "No problem — I'll work without it."}
            </p>
          ) : (
            <button
              type="button"
              style={{ ...primaryButton, marginBottom: 12 }}
              onClick={askLocation}
            >
              Allow location
            </button>
          )}
          <div style={{ display: "flex", gap: 10 }}>
            <button type="button" style={ghostButton} onClick={back}>
              Back
            </button>
            <button type="button" style={{ ...primaryButton, flex: 1 }} onClick={next}>
              {locationAsked ? "Continue" : "Skip for now"}
            </button>
          </div>
        </>
      ) : null}

      {step === "ready" ? (
        <>
          <h2 style={{ marginTop: 0 }}>You're all set 🎉</h2>
          <p style={{ color: "#475569", lineHeight: 1.6 }}>
            I'm ready whenever you need me — directions, a quick scam check, or
            help getting somewhere safe.
          </p>
          {error ? <p style={{ color: "#b91c1c" }}>{error}</p> : null}
          <button type="button" style={primaryButton} onClick={finish} disabled={saving}>
            {saving ? "Setting up…" : "Enter app"}
          </button>
        </>
      ) : null}
    </div>
  );
}
