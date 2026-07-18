"use client";

import type { CSSProperties } from "react";
import { useState } from "react";
import type { NearbyPlace, NearbySuggestionsResult } from "../../lib/ai/types";
import { buildMapsSearchLink } from "../../lib/utils/mapsLink";
import { useLanguage } from "../../lib/i18n/LanguageContext";
import { theme } from "../../lib/theme";

const sectionStyle: CSSProperties = {
  maxWidth: 1100,
  margin: "0 auto",
  padding: "24px",
};

const shellStyle: CSSProperties = {
  padding: 24,
  borderRadius: theme.borderRadius.card,
  background: theme.colors.card,
  border: `1px solid ${theme.colors.border}`,
  boxShadow: theme.shadows.soft,
};

const buttonStyle: CSSProperties = {
  padding: "12px 20px",
  borderRadius: theme.borderRadius.button,
  border: "none",
  background: theme.colors.primary,
  color: "#ffffff",
  fontWeight: 700,
  cursor: "pointer",
  transition: "opacity 0.2s",
};

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: 16,
  marginTop: 20,
};

const cardStyle: CSSProperties = {
  padding: 20,
  borderRadius: theme.borderRadius.card,
  border: `1px solid ${theme.colors.border}`,
  background: "#FAF7F2",
  boxShadow: "0 4px 12px rgba(45, 42, 38, 0.03)",
};

function formatPriceLevel(level?: number) {
  if (typeof level !== "number" || level < 0) return null;
  return "$".repeat(Math.min(level + 1, 4));
}

function PlaceCard({ place }: { place: NearbyPlace }) {
  const { t } = useLanguage();
  const price = formatPriceLevel(place.priceLevel);

  return (
    <article style={cardStyle}>
      <strong style={{ display: "block", marginBottom: 6, fontSize: 16, color: theme.colors.text }}>{place.name}</strong>
      <p style={{ margin: "0 0 8px", color: theme.colors.textLight, lineHeight: 1.5, fontSize: 14 }}>{place.address}</p>
      <p style={{ margin: "0 0 16px", fontSize: 13, color: theme.colors.text }}>
        {typeof place.rating === "number"
          ? `${t("nearby.rating")} ${place.rating.toFixed(1)}`
          : t("nearby.noRating")}
        {place.userRatingsTotal ? ` • ${place.userRatingsTotal} ${t("nearby.reviews")}` : ""}
        {price ? ` • ${price}` : ""}
      </p>
      <a
        href={buildMapsSearchLink(place.mapsQuery)}
        target="_blank"
        rel="noreferrer"
        style={{ color: theme.colors.primary, fontWeight: 700, textDecoration: "none", fontSize: 14 }}
      >
        {t("timeline.openMaps")} →
      </a>
    </article>
  );
}

export function NearbySuggestions({
  secondCategory = "fun",
}: {
  secondCategory?: "fun" | "convenience";
}) {
  const { t } = useLanguage();
  const [data, setData] = useState<NearbySuggestionsResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFindNearby() {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setError(t("nearby.noGeoSupport"));
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
            throw new Error(result.error || t("nearby.loadError"));
          }

          setData(result);
        } catch (err) {
          setError(err instanceof Error ? err.message : t("nearby.loadError"));
        } finally {
          setLoading(false);
        }
      },
      (geoError) => {
        setLoading(false);
        setError(
          geoError.code === geoError.PERMISSION_DENIED
            ? t("nearby.permissionDenied")
            : t("nearby.locationError"),
        );
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  return (
    <section style={sectionStyle}>
      <div style={shellStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 24, color: theme.colors.text }}>{t("nearby.title")}</h2>
            <p style={{ margin: "6px 0 0", color: theme.colors.textLight }}>{t("nearby.description")}</p>
          </div>
          <button type="button" onClick={handleFindNearby} disabled={loading} style={{ ...buttonStyle, opacity: loading ? 0.7 : 1 }}>
            {loading ? t("nearby.finding") : t("nearby.findButton")}
          </button>
        </div>

        {error ? (
          <div style={{ marginTop: 16, padding: 12, background: "#fee2e2", color: "#991b1b", borderRadius: 8, fontSize: 14 }}>
            {error}
          </div>
        ) : null}

        {data ? (
          <>
            <p style={{ marginTop: 16, color: theme.colors.textLight, fontSize: 14 }}>
              {t("nearby.usingLocation")} <strong>{data.areaLabel}</strong>
            </p>

            <div style={gridStyle}>
              <div>
                <h3 style={{ fontSize: 18, marginBottom: 12 }}>{t("nearby.placesToEat")}</h3>
                <div style={{ display: "grid", gap: 12 }}>
                  {data.food.length ? (
                    data.food.map((place) => <PlaceCard key={place.id} place={place} />)
                  ) : (
                    <p style={{ color: theme.colors.textLight }}>{t("nearby.noFood")}</p>
                  )}
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: 18, marginBottom: 12 }}>
                  {secondCategory === "convenience" ? t("nearby.placesConvenience") : t("nearby.placesToExplore")}
                </h3>
                <div style={{ display: "grid", gap: 12 }}>
                  {(secondCategory === "convenience" ? data.essentials ?? [] : data.fun).length ? (
                    (secondCategory === "convenience" ? data.essentials ?? [] : data.fun).map((place) => (
                      <PlaceCard key={place.id} place={place} />
                    ))
                  ) : (
                    <p style={{ color: theme.colors.textLight }}>
                      {secondCategory === "convenience" ? t("nearby.noConvenience") : t("nearby.noFun")}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}
