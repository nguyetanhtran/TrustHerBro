import { NextResponse } from "next/server";
import type {
  NearbyCategory,
  NearbyPlace,
  NearbySuggestionsResult,
} from "../../../lib/ai/types";

const FOURSQUARE_SEARCH_URL = "https://places-api.foursquare.com/places/search";
const FOURSQUARE_API_VERSION = "2025-06-17";
const GOOGLE_FIND_PLACE_URL = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json";
const GOOGLE_PLACE_DETAILS_URL = "https://maps.googleapis.com/maps/api/place/details/json";
const GOOGLE_GEOCODE_URL = "https://maps.googleapis.com/maps/api/geocode/json";

type GoogleHours = {
  openNow?: boolean;
  hoursToday?: string;
  weekdayHours?: string[];
};

function todayHoursLine(weekdayText?: string[]) {
  if (!weekdayText?.length) return undefined;
  // Google weekday_text is Monday → Sunday
  const day = new Date().getDay(); // 0 = Sunday
  const index = day === 0 ? 6 : day - 1;
  return weekdayText[index];
}

async function fetchGoogleHours(
  name: string,
  address: string,
  lat: number,
  lng: number,
  mapsKey: string,
): Promise<GoogleHours> {
  const findParams = new URLSearchParams({
    input: `${name} ${address}`,
    inputtype: "textquery",
    fields: "place_id",
    locationbias: `circle:2000@${lat},${lng}`,
    key: mapsKey,
  });
  const findRes = await fetch(`${GOOGLE_FIND_PLACE_URL}?${findParams.toString()}`, {
    method: "GET",
    cache: "no-store",
  });
  if (!findRes.ok) return {};
  const findData = (await findRes.json()) as {
    candidates?: Array<{ place_id?: string }>;
  };
  const placeId = findData.candidates?.[0]?.place_id;
  if (!placeId) return {};

  const detailParams = new URLSearchParams({
    place_id: placeId,
    fields: "opening_hours,current_opening_hours",
    key: mapsKey,
  });
  const detailRes = await fetch(`${GOOGLE_PLACE_DETAILS_URL}?${detailParams.toString()}`, {
    method: "GET",
    cache: "no-store",
  });
  if (!detailRes.ok) return {};
  const detailData = (await detailRes.json()) as {
    result?: {
      opening_hours?: { open_now?: boolean; weekday_text?: string[] };
      current_opening_hours?: { open_now?: boolean; weekday_text?: string[] };
    };
  };
  const hours = detailData.result?.current_opening_hours ?? detailData.result?.opening_hours;
  if (!hours) return {};
  return {
    openNow: typeof hours.open_now === "boolean" ? hours.open_now : undefined,
    weekdayHours: hours.weekday_text,
    hoursToday: todayHoursLine(hours.weekday_text),
  };
}

async function enrichPlacesWithHours(
  places: NearbyPlace[],
  lat: number,
  lng: number,
): Promise<NearbyPlace[]> {
  const mapsKey = process.env.MAPS_API_KEY;
  if (!mapsKey || places.length === 0) return places;

  // Cap enrichment to keep latency / quota reasonable (~30 places max from search).
  const enriched = await Promise.all(
    places.map(async (place) => {
      try {
        const hours = await fetchGoogleHours(place.name, place.address, lat, lng, mapsKey);
        return { ...place, ...hours };
      } catch {
        return place;
      }
    }),
  );
  return enriched;
}

type FoursquarePlaceResult = {
  fsq_place_id?: string;
  name?: string;
  distance?: number;
  location?: {
    formatted_address?: string;
    address?: string;
  };
};

type GeocodeResult = {
  lat: number;
  lng: number;
  label: string;
};

function parseCoordinate(value: string | null) {
  if (!value) return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

function buildMapsQuery(name?: string, address?: string) {
  return [name, address].filter(Boolean).join(", ");
}

async function geocodeAddress(address: string): Promise<GeocodeResult | null> {
  const mapsKey = process.env.MAPS_API_KEY;
  if (mapsKey) {
    const params = new URLSearchParams({
      address,
      key: mapsKey,
      region: "vn",
      language: "en",
    });
    const response = await fetch(`${GOOGLE_GEOCODE_URL}?${params.toString()}`, {
      method: "GET",
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error(`Geocoding failed with ${response.status}.`);
    }
    const data = (await response.json()) as {
      status?: string;
      error_message?: string;
      results?: Array<{
        formatted_address?: string;
        geometry?: { location?: { lat?: number; lng?: number } };
      }>;
    };
    if (data.status && data.status !== "OK" && data.status !== "ZERO_RESULTS") {
      throw new Error(data.error_message || `Geocoding returned status ${data.status}.`);
    }
    const hit = data.results?.[0];
    const lat = hit?.geometry?.location?.lat;
    const lng = hit?.geometry?.location?.lng;
    if (typeof lat !== "number" || typeof lng !== "number") return null;
    return { lat, lng, label: hit?.formatted_address ?? address };
  }

  // Fallback: OpenStreetMap Nominatim (no key required)
  const params = new URLSearchParams({
    q: address,
    format: "json",
    limit: "1",
    countrycodes: "vn",
  });
  const response = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "User-Agent": "TrustHerBro/1.0 (travel companion)",
    },
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`Geocoding failed with ${response.status}.`);
  }
  const data = (await response.json()) as Array<{
    lat?: string;
    lon?: string;
    display_name?: string;
  }>;
  const hit = data[0];
  const lat = hit?.lat ? Number(hit.lat) : NaN;
  const lng = hit?.lon ? Number(hit.lon) : NaN;
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  return { lat, lng, label: hit?.display_name ?? address };
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
  category: NearbyCategory;
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

  return (data.results ?? [])
    .map((place) => {
      const placeAddress =
        place.location?.formatted_address ?? place.location?.address ?? "Address unavailable";

      return {
        id: place.fsq_place_id ?? `${category}-${place.name ?? "unknown"}`,
        name: place.name ?? "Unnamed place",
        address: placeAddress,
        // Rating/price/openNow aren't available on the free tier — left
        // undefined so the UI simply omits them instead of erroring.
        rating: undefined,
        userRatingsTotal: undefined,
        priceLevel: undefined,
        mapsQuery: buildMapsQuery(place.name, placeAddress),
        category,
        distanceMeters: typeof place.distance === "number" ? place.distance : undefined,
        openNow: undefined,
      } satisfies NearbyPlace;
    })
    .sort((a, b) => (a.distanceMeters ?? Infinity) - (b.distanceMeters ?? Infinity))
    .slice(0, 6);
}

// FPT is a hackathon sponsor and the brief itself names "FPT store" as the
// expected SIM-card answer. A generic "mobile phone store" text query often
// doesn't surface FPT Shop at all (different category tagging in
// Foursquare), so it's searched for by name directly and merged to the
// front — real alternatives (Viettel, Mobifone, etc.) still show right
// after, deduplicated, never hidden.
async function fetchSimCardPlaces({
  lat,
  lng,
  apiKey,
}: {
  lat: number;
  lng: number;
  apiKey: string;
}): Promise<NearbyPlace[]> {
  const [fptResults, generalResults] = await Promise.all([
    fetchNearbyCategory({ lat, lng, query: "FPT", category: "simCard", apiKey }),
    fetchNearbyCategory({ lat, lng, query: "mobile phone store", category: "simCard", apiKey }),
  ]);

  const seen = new Set<string>();
  const merged: NearbyPlace[] = [];

  for (const place of [...fptResults, ...generalResults]) {
    if (seen.has(place.id)) continue;
    seen.add(place.id);
    merged.push(place);
  }

  return merged.slice(0, 6);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const addressQuery = searchParams.get("address")?.trim() || null;
  let lat = parseCoordinate(searchParams.get("lat"));
  let lng = parseCoordinate(searchParams.get("lng"));
  let areaLabel = "";

  if (addressQuery) {
    try {
      const geo = await geocodeAddress(addressQuery);
      if (!geo) {
        return NextResponse.json(
          { error: "Couldn't find that address. Try a hotel name, street, or landmark in Vietnam." },
          { status: 404 },
        );
      }
      lat = geo.lat;
      lng = geo.lng;
      areaLabel = geo.label;
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "Failed to look up that address." },
        { status: 500 },
      );
    }
  }

  if (lat === null || lng === null) {
    return NextResponse.json(
      { error: "Provide an address, or valid lat and lng." },
      { status: 400 },
    );
  }

  if (!areaLabel) {
    areaLabel = `${lat.toFixed(3)}, ${lng.toFixed(3)}`;
  }

  const apiKey = process.env.FOURSQUARE_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "FOURSQUARE_API_KEY is missing. Add it in your local environment first." },
      { status: 500 },
    );
  }

  try {
    const [foodRaw, funRaw, cafeRaw, essentialsRaw, simCardRaw] = await Promise.all([
      fetchNearbyCategory({ lat, lng, query: "restaurant", category: "food", apiKey }),
      fetchNearbyCategory({ lat, lng, query: "tourist attraction", category: "fun", apiKey }),
      fetchNearbyCategory({ lat, lng, query: "cafe", category: "cafe", apiKey }),
      fetchNearbyCategory({ lat, lng, query: "convenience store", category: "essentials", apiKey }),
      fetchSimCardPlaces({ lat, lng, apiKey }),
    ]);

    // Enrich with Google opening hours when MAPS_API_KEY is set (Foursquare free tier has no hours).
    const [food, fun, cafe, essentials, simCard] = await Promise.all([
      enrichPlacesWithHours(foodRaw, lat, lng),
      enrichPlacesWithHours(funRaw, lat, lng),
      enrichPlacesWithHours(cafeRaw, lat, lng),
      enrichPlacesWithHours(essentialsRaw, lat, lng),
      enrichPlacesWithHours(simCardRaw, lat, lng),
    ]);

    const result: NearbySuggestionsResult = {
      food,
      fun,
      cafe,
      essentials,
      simCard,
      areaLabel,
    };

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load nearby places." },
      { status: 500 },
    );
  }
}
