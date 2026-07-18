import fixtures from "./farFixtures.json";
import { evaluatePriceAlarm } from "./priceScore";
import { evaluateScamAlarm } from "./scamScore";
import {
  PRICE_OVERPRICE_MULTIPLIER,
  SCAM_CONFIDENCE_THRESHOLD,
} from "./thresholds";

export type FarFixture = {
  id: string;
  kind: "price" | "scam";
  label: "honest" | "alarm";
  text: string;
};

export type FarSlice = {
  cases: number;
  honestCases: number;
  alarmCases: number;
  /** False alarms among honest cases: FP / honest. */
  falseAlarmRate: number;
  /** True positive rate among true-alarm cases: TP / alarm. */
  recall: number;
  /** Among raised alarms, share that were correct: TP / (TP+FP). */
  precision: number;
  truePositives: number;
  falsePositives: number;
  trueNegatives: number;
  falseNegatives: number;
};

export type FarReport = {
  measuredAt: string;
  thresholds: {
    priceOverpriceMultiplier: number;
    scamConfidenceMin: number;
  };
  price: FarSlice;
  scam: FarSlice;
  overall: FarSlice;
  failures: Array<{ id: string; kind: string; expected: string; predicted: string }>;
};

function emptySlice(): FarSlice {
  return {
    cases: 0,
    honestCases: 0,
    alarmCases: 0,
    falseAlarmRate: 0,
    recall: 0,
    precision: 0,
    truePositives: 0,
    falsePositives: 0,
    trueNegatives: 0,
    falseNegatives: 0,
  };
}

function finalize(slice: FarSlice): FarSlice {
  const far =
    slice.honestCases > 0 ? slice.falsePositives / slice.honestCases : 0;
  const recall = slice.alarmCases > 0 ? slice.truePositives / slice.alarmCases : 0;
  const predictedPos = slice.truePositives + slice.falsePositives;
  const precision = predictedPos > 0 ? slice.truePositives / predictedPos : 1;
  return {
    ...slice,
    falseAlarmRate: Number(far.toFixed(4)),
    recall: Number(recall.toFixed(4)),
    precision: Number(precision.toFixed(4)),
  };
}

function scoreCase(fixture: FarFixture): boolean {
  if (fixture.kind === "price") {
    return evaluatePriceAlarm(fixture.text).alarmed;
  }
  return evaluateScamAlarm(fixture.text).alarmed;
}

export function measureFar(reportFixtures: FarFixture[] = fixtures as FarFixture[]): FarReport {
  const price = emptySlice();
  const scam = emptySlice();
  const overall = emptySlice();
  const failures: FarReport["failures"] = [];

  for (const fixture of reportFixtures) {
    const predicted = scoreCase(fixture);
    const expectedAlarm = fixture.label === "alarm";
    const slice = fixture.kind === "price" ? price : scam;

    for (const target of [slice, overall]) {
      target.cases += 1;
      if (expectedAlarm) target.alarmCases += 1;
      else target.honestCases += 1;

      if (predicted && expectedAlarm) target.truePositives += 1;
      else if (predicted && !expectedAlarm) target.falsePositives += 1;
      else if (!predicted && !expectedAlarm) target.trueNegatives += 1;
      else target.falseNegatives += 1;
    }

    if (predicted !== expectedAlarm) {
      failures.push({
        id: fixture.id,
        kind: fixture.kind,
        expected: fixture.label,
        predicted: predicted ? "alarm" : "honest",
      });
    }
  }

  return {
    measuredAt: new Date().toISOString(),
    thresholds: {
      priceOverpriceMultiplier: PRICE_OVERPRICE_MULTIPLIER,
      scamConfidenceMin: SCAM_CONFIDENCE_THRESHOLD,
    },
    price: finalize(price),
    scam: finalize(scam),
    overall: finalize(overall),
    failures,
  };
}

export function formatFarPercent(rate: number): string {
  return `${(rate * 100).toFixed(1)}%`;
}
