import type { TimelineStep } from "../../lib/ai/types";
import { buildMapsSearchLink } from "../../lib/utils/mapsLink";
import { useLanguage } from "../../lib/i18n/LanguageContext";
import { TrustBadge } from "../shared/TrustBadge";

const colors: Record<TimelineStep["riskLevel"], string> = {
  low: "#dcfce7",
  medium: "#fef3c7",
  high: "#fee2e2",
};

export function TimelineStepCard({
  step,
  accommodation,
}: {
  step: TimelineStep;
  accommodation?: string;
}) {
  const { t } = useLanguage();
  const isCheckinStep = step.id === "checkin" || step.id === "hotel";

  return (
    <article
      style={{
        padding: 18,
        borderRadius: 18,
        background: "#ffffff",
        border: "1px solid #e2e8f0",
      }}
    >
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
      <p style={{ marginBottom: 8 }}>{step.description}</p>
      <small style={{ color: "#475569" }}>{step.time}</small>

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
    </article>
  );
}
