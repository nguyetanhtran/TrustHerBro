import { NextResponse } from "next/server";
import { formatFarPercent, measureFar } from "../../../lib/eval/measureFar";

export async function GET() {
  const report = measureFar();
  return NextResponse.json({
    ...report,
    summary: {
      priceFar: formatFarPercent(report.price.falseAlarmRate),
      scamFar: formatFarPercent(report.scam.falseAlarmRate),
      overallFar: formatFarPercent(report.overall.falseAlarmRate),
      priceRecall: formatFarPercent(report.price.recall),
      scamRecall: formatFarPercent(report.scam.recall),
      fixtureCount: report.overall.cases,
    },
  });
}
