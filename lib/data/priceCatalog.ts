import regionalPrices from "./regionalPrices.json";
import { createServiceClient } from "../supabase/service";

export type CatalogItem = {
  city: string;
  category: string;
  item: string;
  priceRangeVnd: [number, number];
  note?: string;
  source?: string;
  updatedAt?: string;
};

export type PriceCatalog = {
  updatedAt: string;
  source: string;
  reviewCadence?: string;
  items: CatalogItem[];
};

type SeedCatalog = {
  updatedAt: string;
  source: string;
  reviewCadence?: string;
  items: Array<{
    city: string;
    category: string;
    item: string;
    priceRangeVnd: number[];
    note?: string;
  }>;
};

const seed = regionalPrices as SeedCatalog;

function normalizeKey(city: string, item: string) {
  return `${city.trim().toLowerCase()}::${item.trim().toLowerCase()}`;
}

/** Seed catalog merged with approved traveler overrides from Supabase. */
export async function loadPriceCatalog(): Promise<PriceCatalog> {
  const items: CatalogItem[] = seed.items.map((entry) => ({
    city: entry.city,
    category: entry.category,
    item: entry.item,
    priceRangeVnd: [entry.priceRangeVnd[0], entry.priceRangeVnd[1]] as [number, number],
    note: entry.note,
    source: "seed",
    updatedAt: seed.updatedAt,
  }));

  const byKey = new Map(items.map((entry) => [normalizeKey(entry.city, entry.item), entry]));
  let updatedAt = seed.updatedAt;

  const supabase = createServiceClient();
  if (supabase) {
    const { data } = await supabase
      .from("regional_price_overrides")
      .select("city,item,category,min_vnd,max_vnd,source,updated_at");
    if (data?.length) {
      for (const row of data) {
        const key = normalizeKey(String(row.city), String(row.item));
        const next: CatalogItem = {
          city: String(row.city),
          category: String(row.category ?? "goods"),
          item: String(row.item),
          priceRangeVnd: [Number(row.min_vnd), Number(row.max_vnd)],
          source: String(row.source ?? "traveler-reports"),
          updatedAt: String(row.updated_at ?? updatedAt),
        };
        byKey.set(key, next);
        if (next.updatedAt && next.updatedAt > updatedAt) updatedAt = next.updatedAt;
      }
    }
  }

  return {
    updatedAt: updatedAt.slice(0, 10),
    source: seed.source,
    reviewCadence: seed.reviewCadence,
    items: Array.from(byKey.values()),
  };
}

export function formatVnd(value: number) {
  return value.toLocaleString("en-US");
}

export function formatCatalogMatch(entry: CatalogItem): string {
  const [min, max] = entry.priceRangeVnd;
  const place = entry.city ? ` in ${entry.city}` : "";
  return `Typical for ${entry.item}${place}: ${formatVnd(min)}–${formatVnd(max)} VND`;
}
