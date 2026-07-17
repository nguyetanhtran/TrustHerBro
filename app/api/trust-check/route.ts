import { NextResponse } from "next/server";
import communityReports from "../../../lib/data/communityReports.json";
import scamWarnings from "../../../lib/data/scamWarnings.json";
import type { TrustCheckResult } from "../../../lib/ai/types";

function normalizeText(value: string) {
  return value.trim().toLowerCase();
}

export async function POST(request: Request) {
  const body = await request.json();
  const subject = String(body?.subject ?? "");

  if (!subject.trim()) {
    return NextResponse.json(
      { error: "Subject is required." },
      { status: 400 },
    );
  }

  const normalized = normalizeText(subject);
  const reports = communityReports.filter((item) =>
    normalizeText(item.subject).includes(normalized),
  );
  const warnings = scamWarnings.filter((item) =>
    normalizeText(item.title).includes(normalized) ||
    normalizeText(item.description).includes(normalized),
  );

  const score = Math.max(2, 10 - warnings.length * 2 + reports.length);
  const result: TrustCheckResult = {
    subject,
    trustScore: Number(score.toFixed(1)),
    verdict:
      warnings.length > 0
        ? "Needs caution"
        : reports.length > 0
          ? "Looks generally trusted"
          : "Not enough signal yet",
    supportingReasons: reports.map((item) => item.summary),
    warnings: warnings.map((item) => item.title),
  };

  return NextResponse.json(result);
}
