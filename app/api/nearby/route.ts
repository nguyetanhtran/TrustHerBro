import { NextResponse } from "next/server";
import type { NearbyPlace, NearbySuggestionsResult } from "../../../lib/ai/types";

const GOOGLE_PLACES_URL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json";

type GooglePlaceResult = {
  place_id?: string;
  name?: string;
  vicinity?: string;
  rating?: number;
  user_ratings_total?: number;
  price_level?: number;
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
  type,
  keyword,
  category,
  apiKey,
}: {
  lat: number;
  lng: number;
  type: string;
  keyword?: string;
  category: "food" | "fun";
  apiKey: string;
}): Promise<NearbyPlace[]> {
  const params = new URLSearchParams({
    key: apiKey,
    location: `${lat},${lng}`,
    radius: "1800",
    type,
  });

  if (keyword) {
    params.set("keyword", keyword);
  }

  const response = await fetch(`${GOOGLE_PLACES_URL}?${params.toString()}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Google Places request failed with ${response.status}.`);
  }

  const data = (await response.json()) as { results?: GooglePlaceResult[]; status?: string; error_message?: string };

  if (data.status && data.status !== "OK" && data.status !== "ZERO_RESULTS") {
    throw new Error(data.error_message || `Google Places returned status ${data.status}.`);
  }

  return (data.results ?? []).slice(0, 6).map((place) => ({
    id: place.place_id ?? `${category}-${place.name ?? "unknown"}`,
    name: place.name ?? "Unnamed place",
    address: place.vicinity ?? "Address unavailable",
    rating: place.rating,
    userRatingsTotal: place.user_ratings_total,
    priceLevel: place.price_level,
    mapsQuery: buildMapsQuery(place.name, place.vicinity),
    category,
  }));
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = parseCoordinate(searchParams.get("lat"));
  const lng = parseCoordinate(searchParams.get("lng"));

  if (lat === null || lng === null) {
    return NextResponse.json({ error: "Valid lat and lng are required." }, { status: 400 });
  }

  const apiKey = process.env.MAPS_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "MAPS_API_KEY is missing. Add it in your local environment first." },
      { status: 500 },
    );
  }

  try {
    const [food, fun] = await Promise.all([
      fetchNearbyCategory({
        lat,
        lng,
        type: "restaurant",
        category: "food",
        apiKey,
      }),
      fetchNearbyCategory({
        lat,
        lng,
        type: "tourist_attraction",
        keyword: "things to do",
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
