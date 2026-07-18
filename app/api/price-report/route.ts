import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { loadPriceCatalog } from "../../../lib/data/priceCatalog";
import { createServiceClient } from "../../../lib/supabase/service";

type PriceReport = {
  id: string;
  city: string;
  item: string;
  amountVnd: number;
  note?: string;
  status: "pending" | "approved" | "rejected" | "merged";
  createdAt: string;
};

const FILE_FALLBACK = path.join(process.cwd(), "lib", "data", "priceReports.json");
const AUTO_MERGE_MIN = 3;
const AUTO_MERGE_BAND = 0.15;

async function readFileReports(): Promise<PriceReport[]> {
  try {
    const raw = await fs.readFile(FILE_FALLBACK, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as PriceReport[]) : [];
  } catch {
    return [];
  }
}

async function writeFileReports(reports: PriceReport[]) {
  await fs.writeFile(FILE_FALLBACK, `${JSON.stringify(reports, null, 2)}\n`, "utf8");
}

function withinBand(amount: number, center: number) {
  return Math.abs(amount - center) / center <= AUTO_MERGE_BAND;
}

function median(values: number[]) {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
}

async function tryAutoMerge(city: string, item: string): Promise<{
  merged: boolean;
  range?: [number, number];
  count?: number;
}> {
  const supabase = createServiceClient();
  if (!supabase) return { merged: false };

  const { data: rows } = await supabase
    .from("price_reports")
    .select("id, amount_vnd, status")
    .eq("city", city)
    .ilike("item", item)
    .in("status", ["pending", "approved"]);

  const amounts = (rows ?? []).map((row) => Number(row.amount_vnd)).filter((n) => n > 0);
  if (amounts.length < AUTO_MERGE_MIN) return { merged: false, count: amounts.length };

  const center = median(amounts);
  const cluster = amounts.filter((n) => withinBand(n, center));
  if (cluster.length < AUTO_MERGE_MIN) return { merged: false, count: cluster.length };

  const min = Math.round(Math.min(...cluster) * 0.95);
  const max = Math.round(Math.max(...cluster) * 1.05);

  await supabase.from("regional_price_overrides").upsert(
    {
      city,
      item,
      category: "goods",
      min_vnd: min,
      max_vnd: max,
      source: `auto-merge:${cluster.length}-reports`,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "city,item" },
  );

  const ids = (rows ?? [])
    .filter((row) => withinBand(Number(row.amount_vnd), center))
    .map((row) => row.id);
  if (ids.length) {
    await supabase.from("price_reports").update({ status: "merged" }).in("id", ids);
  }

  return { merged: true, range: [min, max], count: cluster.length };
}

export async function GET() {
  const catalog = await loadPriceCatalog();
  const supabase = createServiceClient();
  let pendingReports = 0;
  let backend: "supabase" | "file" = "file";

  if (supabase) {
    const { count, error } = await supabase
      .from("price_reports")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending");
    if (!error) {
      pendingReports = count ?? 0;
      backend = "supabase";
    }
  }

  if (backend === "file") {
    const reports = await readFileReports();
    pendingReports = reports.filter((r) => r.status !== "merged" && r.status !== "rejected").length;
  }

  return NextResponse.json({
    updatedAt: catalog.updatedAt,
    source: catalog.source,
    reviewCadence: catalog.reviewCadence ?? null,
    pendingReports,
    backend,
    autoMergeRule: `After ${AUTO_MERGE_MIN}+ similar reports (±${AUTO_MERGE_BAND * 100}%), catalog range auto-updates.`,
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  const city = String(body?.city ?? "").trim();
  const item = String(body?.item ?? "").trim();
  const amountVnd = Number(body?.amountVnd);
  const note = typeof body?.note === "string" ? body.note.trim() : undefined;

  if (!city || !item || !Number.isFinite(amountVnd) || amountVnd <= 0) {
    return NextResponse.json(
      { error: "city, item, and a positive amountVnd are required." },
      { status: 400 },
    );
  }

  const report: PriceReport = {
    id: crypto.randomUUID(),
    city,
    item,
    amountVnd: Math.round(amountVnd),
    note: note || undefined,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  const supabase = createServiceClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("price_reports")
      .insert({
        id: report.id,
        city: report.city,
        item: report.item,
        amount_vnd: report.amountVnd,
        note: report.note ?? null,
        status: "pending",
      })
      .select("id")
      .maybeSingle();

    if (!error) {
      const merge = await tryAutoMerge(city, item);
      return NextResponse.json({
        ok: true,
        persisted: true,
        backend: "supabase",
        report: { ...report, id: data?.id ?? report.id },
        autoMerged: merge.merged,
        mergedRange: merge.range ?? null,
        similarReports: merge.count ?? null,
        message: merge.merged
          ? `Thanks — ${merge.count} similar reports auto-merged into the catalog (${merge.range?.[0]}–${merge.range?.[1]} VND).`
          : "Thanks — queued in Supabase. Catalog auto-updates after 3+ similar reports.",
      });
    }
  }

  // File fallback when Supabase table is missing / RLS blocks.
  try {
    const existing = await readFileReports();
    const next = [...existing, report].slice(-500);
    await writeFileReports(next);
    return NextResponse.json({
      ok: true,
      persisted: true,
      backend: "file",
      report,
      autoMerged: false,
      message:
        "Saved locally. Run supabase/migrations/20260719_price_reports.sql to enable cloud queue + auto-merge.",
    });
  } catch {
    return NextResponse.json({
      ok: true,
      persisted: false,
      backend: "memory",
      report,
      autoMerged: false,
      message: "Report received but could not persist on this host.",
    });
  }
}
