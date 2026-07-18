"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { theme } from "../../lib/theme";

type FarSummary = {
  priceFar: string;
  scamFar: string;
  overallFar: string;
  priceRecall: string;
  scamRecall: string;
  fixtureCount: number;
};

const wrapStyle: CSSProperties = {
  marginTop: 12,
  padding: "10px 12px",
  borderRadius: 12,
  background: "rgba(61, 107, 98, 0.1)",
  border: `1px solid ${theme.colors.border}`,
  fontSize: 12,
  color: theme.colors.textLight,
  lineHeight: 1.45,
};

export function FarMetricsBadge({ focus = "overall" }: { focus?: "price" | "scam" | "overall" }) {
  const [summary, setSummary] = useState<FarSummary | null>(null);

  useEffect(() => {
    fetch("/api/eval-far")
      .then((res) => res.json())
      .then((data) => {
        if (data?.summary) setSummary(data.summary as FarSummary);
      })
      .catch(() => undefined);
  }, []);

  if (!summary) return null;

  const far =
    focus === "price" ? summary.priceFar : focus === "scam" ? summary.scamFar : summary.overallFar;
  const recall =
    focus === "price"
      ? summary.priceRecall
      : focus === "scam"
        ? summary.scamRecall
        : null;

  return (
    <div style={wrapStyle} aria-live="polite">
      <strong style={{ color: theme.colors.tealDeep }}>Measured false-alarm rate: {far}</strong>
      {" · "}
      {focus === "price"
        ? `price fixtures (${summary.fixtureCount} total)`
        : focus === "scam"
          ? `scam fixtures (${summary.fixtureCount} total)`
          : `${summary.fixtureCount} labeled fixtures`}
      {recall ? ` · recall ${recall}` : null}
      <br />
      Guardrails: price flag only above +30% of catalog max; scam needs confidence ≥ 0.6 and a catalog match.
    </div>
  );
}
