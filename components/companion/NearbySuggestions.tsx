"use client";

import type { CSSProperties } from "react";
import { useState } from "react";
import type { NearbyPlace, NearbySuggestionsResult } from "../../lib/ai/types";
import { buildMapsSearchLink } from "../../lib/utils/mapsLink";

const shellStyle: CSSProperties = {
  marginTop: 24,
  padding: 20,
  borderRadius: 20,
  background: "#ffffff",
  border: "1px solid #e2e8f0",
  boxShadow: "0 12px 32px rgba(15, 23, 42, 0.06)",
};

const buttonStyle: CSSProperties = {
  padding: "12px 16px",
  borderRadius: 14,
  border: "none",
  background: "#0f766e",
  color: "#ffffff",
  fontWeight: 700,
  cursor: "pointer",
};

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: 14,
  marginTop: 16,
};

const cardStyle: CSSProperties = {
  padding: 16,
  borderRadius: 16,
  border: "1px solid #e2e8f0",
  background: "#f8fafc",
};

function formatPriceLevel(level?: number) {
  if (typeof level !== "number" || level < 0) return null;
  return "$".repeat(Math.min(level + 1, 4));
}

function PlaceCard({ place }: { place: NearbyPlace }) {
  const price = formatPriceLevel(place.priceLevel);

  return (
    <article style={cardStyle}>
      <strong style={{ display: "block", marginBottom: 6 }}>{place.name}</strong>
      <p style={{ margin: "0 0 8px", color: "#475569", lineHeight: 1.5 }}>{place.address}</p>
      <p style={{ margin: "0 0 12px", fontSize: 14, color: "#0f172a" }}>
        {typeof place.rating === "number" ? `Rating ${place.rating.toFixed(1)}` : "No rating yet"}
        {place.userRatingsTotal ? ` • ${place.userRatingsTotal} reviews` : ""}
        {price ? ` • ${price}` : ""}
      </p>
      <a
        href={buildMapsSearchLink(place.mapsQuery)}
        target="_blank"
        rel="noreferrer"
        style={{ color: "#1d4ed8", fontWeight: 700, textDecoration: "none" }}
      >
        Open in Maps
      </a>
    </article>
  );
}

export function NearbySuggestions() {
  const [data, setData] = useState<NearbySuggestionsResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFindNearby() {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setError("Your browser does not support location access.");
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const params = new URLSearchParams({
            lat: String(position.coords.latitude),
            lng: String(position.coords.longitude),
          });
          const response = await fetch(`/api/nearby?${params.toString()}`);
          const result = (await response.json()) as NearbySuggestionsResult & { error?: string };

          if (!response.ok) {
            throw new Error(result.error || "Could not load nearby suggestions.");
          }

          setData(result);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Could not load nearby suggestions.");
        } finally {
          setLoading(false);
        }
      },
      (geoError) => {
        setLoading(false);
        setError(
          geoError.code === geoError.PERMISSION_DENIED
            ? "Location permission was denied. Enable it to get nearby suggestions."
            : "Could not read your location right now.",
        );
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  return (
    <section style={shellStyle}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <h2 style={{ margin: 0 }}>Nearby picks</h2>
          <p style={{ margin: "6px 0 0", color: "#475569" }}>
            Find food and fun spots around you using your current location.
          </p>
        </div>
        <button type="button" onClick={handleFindNearby} disabled={loading} style={buttonStyle}>
          {loading ? "Finding nearby..." : "Find food & fun near me"}
        </button>
      </div>

      {error ? (
        <p style={{ marginTop: 14, color: "#b91c1c" }}>{error}</p>
      ) : null}

      {data ? (
        <>
          <p style={{ marginTop: 14, color: "#475569" }}>Using location around {data.areaLabel}</p>

          <div style={gridStyle}>
            <div>
              <h3>Places to eat</h3>
              <div style={{ display: "grid", gap: 12 }}>
                {data.food.length ? (
                  data.food.map((place) => <PlaceCard key={place.id} place={place} />)
                ) : (
                  <p style={{ color: "#64748b" }}>No nearby food suggestions found.</p>
                )}
              </div>
            </div>

            <div>
              <h3>Places to explore</h3>
              <div style={{ display: "grid", gap: 12 }}>
                {data.fun.length ? (
                  data.fun.map((place) => <PlaceCard key={place.id} place={place} />)
                ) : (
                  <p style={{ color: "#64748b" }}>No nearby activity suggestions found.</p>
                )}
              </div>
            </div>
          </div>
        </>
      ) : null}
    </section>
  );
}
