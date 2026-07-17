"use client";

import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SurvivalTimeline } from "../../components/timeline/SurvivalTimeline";
import { loadOnboardingAnswers } from "../../lib/store";
import type { OnboardingAnswers, SurvivalTimelinePayload } from "../../lib/ai/types";

const pageStyle: CSSProperties = {
  maxWidth: 900,
  margin: "0 auto",
  padding: "40px 24px 72px",
};

export default function TimelinePage() {
  const router = useRouter();
  const [timeline, setTimeline] = useState<SurvivalTimelinePayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<OnboardingAnswers | null>(null);

  useEffect(() => {
    const storedAnswers = loadOnboardingAnswers();

    if (!storedAnswers) {
      router.push("/onboarding");
      return;
    }

    setAnswers(storedAnswers);

    fetch("/api/first-night", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers: storedAnswers }),
    })
      .then((response) => response.json())
      .then((data: SurvivalTimelinePayload) => setTimeline(data))
      .catch(() => setError("Could not reach the server. Check your connection and try again."));
  }, [router]);

  return (
    <main style={pageStyle}>
      <h1>Survival Timeline</h1>

      {error ? (
        <div>
          <p style={{ color: "#b91c1c" }}>{error}</p>
          <button type="button" onClick={() => window.location.reload()}>
            Try again
          </button>
        </div>
      ) : timeline ? (
        <SurvivalTimeline
          title={timeline.title}
          steps={timeline.steps}
          accommodation={answers?.accommodation}
        />
      ) : (
        <p style={{ lineHeight: 1.7 }}>Preparing your first-night plan...</p>
      )}
    </main>
  );
}
