/**
 * Offline smoke: FAR fixtures + trust-check / scam-check route handlers.
 * Run: npx tsx scripts/smoke-apis.ts
 */
import { measureFar, formatFarPercent } from "../lib/eval/measureFar";
import { POST as trustCheck } from "../app/api/trust-check/route";
import { POST as scamCheck } from "../app/api/scam-check/route";

async function postJson(
  handler: (request: Request) => Promise<Response>,
  path: string,
  body: unknown,
) {
  const request = new Request(`http://localhost${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return handler(request);
}

async function main() {
  const far = measureFar();
  console.log(
    `FAR smoke — Price ${formatFarPercent(far.price.falseAlarmRate)} / Scam ${formatFarPercent(far.scam.falseAlarmRate)} on ${far.overall.cases} fixtures`,
  );
  if (far.failures.length) {
    console.error("FAR failures:", far.failures);
    process.exitCode = 1;
    return;
  }

  const trustRes = await postJson(trustCheck, "/api/trust-check", {
    subject: "Phở bò in Hà Nội 55000 VND",
    language: "en",
  });
  const trust = (await trustRes.json()) as {
    trustScore?: number;
    groundingMatches?: unknown[];
    liveEstimates?: unknown[];
    code?: string;
    usedFallback?: boolean;
  };
  if (!trustRes.ok || typeof trust.trustScore !== "number") {
    console.error("trust-check smoke failed", trustRes.status, trust);
    process.exitCode = 1;
    return;
  }
  if (!trust.liveEstimates?.length) {
    console.error("trust-check missing liveEstimates", trust);
    process.exitCode = 1;
    return;
  }
  if (!trust.groundingMatches?.length) {
    console.error("trust-check missing groundingMatches", trust);
    process.exitCode = 1;
    return;
  }
  console.log(
    `trust-check ok — score ${trust.trustScore}, code ${trust.code ?? "OK"}, grounding ${trust.groundingMatches.length}, live ${trust.liveEstimates.length}`,
  );

  const scamRes = await postJson(scamCheck, "/api/scam-check", {
    description: "Taxi driver said meter is broken, pay 500,000 VND cash for short ride",
    language: "en",
  });
  const scam = (await scamRes.json()) as {
    confidence?: number;
    isLikelyScam?: boolean;
    code?: string;
  };
  if (!scamRes.ok || typeof scam.confidence !== "number") {
    console.error("scam-check smoke failed", scamRes.status, scam);
    process.exitCode = 1;
    return;
  }
  console.log(
    `scam-check ok — confidence ${scam.confidence}, likelyScam ${scam.isLikelyScam}, code ${scam.code ?? "OK"}`,
  );

  console.log("Smoke passed.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
