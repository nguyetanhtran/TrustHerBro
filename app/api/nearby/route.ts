import { NextResponse } from "next/server";
import type { NearbyPlace, NearbySuggestionsResult } from "../../../lib/ai/types";

const FOURSQUARE_SEARCH_URL = "https://places-api.foursquare.com/places/search";
const FOURSQUARE_API_VERSION = "2025-06-17";

type FoursquarePlaceResult = {
  fsq_place_id?: string;
  name?: string;
  distance?: number;
  location?: {
    formatted_address?: string;
    address?: string;
  };
};

function parseCoordinate(value: string | null) {
  if (!value) return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

function buildMapsQuery(name?: string, address?: string) {
  return [name, address].filter(Boolean).join(", ");
}

async function fetchNearbyCategory({
  lat,
  lng,
  query,
  category,
  apiKey,
}: {
  lat: number;
  lng: number;
  query: string;
  category: "food" | "fun";
  apiKey: string;
}): Promise<NearbyPlace[]> {
  const params = new URLSearchParams({
    ll: `${lat},${lng}`,
    radius: "1800",
    query,
    limit: "6",
    // Only free-tier fields — "rating" and "price" are Premium and require
    // paid credits, so they're deliberately left out here.
    fields: "fsq_place_id,name,location,distance",
  });

  const response = await fetch(`${FOURSQUARE_SEARCH_URL}?${params.toString()}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "X-Places-Api-Version": FOURSQUARE_API_VERSION,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.message || `Foursquare request failed with ${response.status}.`);
  }

  const data = (await response.json()) as { results?: FoursquarePlaceResult[] };

  return (data.results ?? []).slice(0, 6).map((place) => {
    const address = place.location?.formatted_address ?? place.location?.address ?? "Address unavailable";

    return {
      id: place.fsq_place_id ?? `${category}-${place.name ?? "unknown"}`,
      name: place.name ?? "Unnamed place",
      address,
      // Rating/price aren't requested (Premium fields) — left undefined so
      // the UI simply omits that part instead of erroring.
      rating: undefined,
      userRatingsTotal: undefined,
      priceLevel: undefined,
      mapsQuery: buildMapsQuery(place.name, address),
      category,
    };
  });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = parseCoordinate(searchParams.get("lat"));
  const lng = parseCoordinate(searchParams.get("lng"));

  if (lat === null || lng === null) {
    return NextResponse.json({ error: "Valid lat and lng are required." }, { status: 400 });
  }

  const apiKey = process.env.FOURSQUARE_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "FOURSQUARE_API_KEY is missing. Add it in your local environment first." },
      { status: 500 },
    );
  }

  try {
    const [food, fun] = await Promise.all([
      fetchNearbyCategory({
        lat,
        lng,
        query: "restaurant",
        category: "food",
        apiKey,
      }),
      fetchNearbyCategory({
        lat,
        lng,
        query: "tourist attraction",
        category: "fun",
        apiKey,
      }),
    ]);

    const result: NearbySuggestionsResult = {
      food,
      fun,
      areaLabel: `${lat.toFixed(3)}, ${lng.toFixed(3)}`,
    };

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load nearby places." },
      { status: 500 },
    );
  }
}
