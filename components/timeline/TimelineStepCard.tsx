import type { TimelineStep } from "../../lib/ai/types";
import { buildMapsSearchLink } from "../../lib/utils/mapsLink";
import { useLanguage } from "../../lib/i18n/LanguageContext";
import { TrustBadge } from "../shared/TrustBadge";
import { NearbySuggestions } from "../companion/NearbySuggestions";

const colors: Record<TimelineStep["riskLevel"], string> = {
  low: "#dcfce7",
  medium: "#fef3c7",
  high: "#fee2e2",
};

// The AI picks its own step ids/titles, so this matches on keywords the
// firstNightPrompt is instructed to use for the "food or essentials nearby"
// step, rather than relying on an exact id the model might not always pick.
const FOOD_STEP_KEYWORDS = ["food", "essential", "eat", "meal", "snack", "convenience", "grocery"];

function isFoodOrEssentialsStep(step: TimelineStep): boolean {
  const haystack = `${step.id} ${step.title}`.toLowerCase();
  return FOOD_STEP_KEYWORDS.some((keyword) => haystack.includes(keyword));
}

export function TimelineStepCard({
  step,
  accommodation,
  needsSimCard,
}: {
  step: TimelineStep;
  accommodation?: string;
  needsSimCard?: boolean;
}) {
  const { t } = useLanguage();

  // The AI picks its own step ids, so "checkin"/"hotel" only reliably matches
  // the static fallback timeline. For real AI output, fall back to checking
  // whether the accommodation name shows up in the step's own title (the
  // prompt is instructed to name it there).
  const isCheckinStep =
    step.id === "checkin" ||
    step.id === "hotel" ||
    Boolean(accommodation && step.title.toLowerCase().includes(accommodation.toLowerCase()));

  const isFoodStep = isFoodOrEssentialsStep(step);

  return (
    <article
      style={{
        padding: 18,
        borderRadius: 18,
        background: "#ffffff",
        border: "1px solid #e2e8f0",
      }}
    >
      <div
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: "#ea580c",
          marginBottom: 6,
          letterSpacing: 0.2,
        }}
      >
        {step.time}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <strong>{step.title}</strong>
        <span
          style={{
            background: colors[step.riskLevel],
            borderRadius: 999,
            padding: "4px 10px",
            fontSize: 12,
          }}
        >
          {step.riskLevel}
        </span>
      </div>
      <p style={{ marginBottom: 0 }}>{step.description}</p>

      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
        {typeof step.trustScore === "number" ? <TrustBadge score={step.trustScore} /> : null}
        {isCheckinStep && accommodation ? (
          <a
            href={buildMapsSearchLink(`${accommodation}, Vietnam`)}
            target="_blank"
            rel="noreferrer"
            style={{ fontSize: 13, fontWeight: 600, color: "#ea580c" }}
          >
            {t("timeline.openMaps")}
          </a>
        ) : null}
      </div>

      {isFoodStep ? (
        <NearbySuggestions secondCategory="convenience" showSimCards={needsSimCard} />
      ) : null}
    </article>
  );
}
