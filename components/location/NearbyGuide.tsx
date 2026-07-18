"use client";

import type { CSSProperties } from "react";
import { useMemo, useState } from "react";
import {
  MapPin,
  Navigation,
  Star,
  Clock,
  Copy,
  Check,
  Utensils,
  Coffee,
  Landmark,
  Cross,
  ShieldCheck,
  Locate,
  Smartphone,
} from "lucide-react";
import type {
  NearbyCategory,
  NearbyPlace,
  NearbySuggestionsResult,
} from "../../lib/ai/types";
import { buildMapsSearchLink } from "../../lib/utils/mapsLink";
import { theme } from "../../lib/theme";

type FilterKey = "all" | NearbyCategory;

const CATEGORY_META: Record<
  NearbyCategory,
  { label: string; icon: typeof Utensils; tip: string }
> = {
  food: {
    label: "Food",
    icon: Utensils,
    tip: "Busy local spots are usually fresher and safer. Check the bill before paying.",
  },
  cafe: {
    label: "Cafés",
    icon: Coffee,
    tip: "Great for a safe break with wi-fi while you plan your next move.",
  },
  fun: {
    label: "Explore",
    icon: Landmark,
    tip: "Note closing times and keep valuables zipped away in crowds.",
  },
  essentials: {
    label: "Essentials",
    icon: Cross,
    tip: "Convenience stores for water, snacks, and anything you need late at night. Save the address offline.",
  },
  simCard: {
    label: "SIM Cards",
    icon: Smartphone,
    tip: "Buy a local SIM or eSIM here for mobile data — useful right after landing.",
  },
};

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "food", label: "Food" },
  { key: "cafe", label: "Cafés" },
  { key: "fun", label: "Explore" },
  { key: "essentials", label: "Essentials" },
  { key: "simCard", label: "SIM Cards" },
];

const GUIDE_STEPS = [
  {
    icon: Locate,
    title: "Share your location",
    body: "Tap the button below and allow location access so we can look around you.",
  },
  {
    icon: MapPin,
    title: "Browse trusted spots",
    body: "We show well-rated places nearby, sorted by distance, with opening status.",
  },
  {
    icon: Navigation,
    title: "Navigate safely",
    body: "Open any place in Google Maps or copy its address for your ride.",
  },
];

const SAFETY_TIPS = [
  "Prefer places that are open now and have plenty of reviews.",
  "Share your live location with someone you trust before heading out.",
  "Agree on the fare or use a metered/app ride before getting in.",
  "Keep your phone charged — screenshot the address in case you lose signal.",
];

const wrapStyle: CSSProperties = {
  maxWidth: 960,
  margin: "0 auto",
  padding: "0 20px 80px",
};

const cardShell: CSSProperties = {
  background: theme.colors.card,
  border: `1px solid ${theme.colors.border}`,
  borderRadius: 20,
  boxShadow: theme.shadows.soft,
  padding: 24,
};

function formatDistance(m?: number) {
  if (typeof m !== "number") return null;
  return m < 1000 ? `${m} m` : `${(m / 1000).toFixed(1)} km`;
}

function formatPriceLevel(level?: number) {
  if (typeof level !== "number" || level < 0) return null;
  return "$".repeat(Math.min(level + 1, 4));
}

function PlaceRow({ place }: { place: NearbyPlace }) {
  const [copied, setCopied] = useState(false);
  const price = formatPriceLevel(place.priceLevel);
  const distance = formatDistance(place.distanceMeters);
  const meta = CATEGORY_META[place.category];
  const Icon = meta.icon;

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(`${place.name}, ${place.address}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked — ignore */
    }
  }

  return (
    <article
      style={{
        display: "flex",
        gap: 14,
        padding: 16,
        borderRadius: 14,
        border: `1px solid ${theme.colors.border}`,
        background: "#FAF7F2",
      }}
    >
      <div
        aria-hidden
        style={{
          flexShrink: 0,
          width: 42,
          height: 42,
          borderRadius: 12,
          display: "grid",
          placeItems: "center",
          background: "rgba(155, 44, 31, 0.1)",
          color: theme.colors.primary,
        }}
      >
        <Icon size={20} strokeWidth={1.8} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <strong style={{ fontSize: 15.5, color: theme.colors.text }}>{place.name}</strong>
          {typeof place.openNow === "boolean" && (
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                padding: "2px 8px",
                borderRadius: 999,
                background: place.openNow ? "rgba(45,120,80,0.14)" : "rgba(120,60,40,0.12)",
                color: place.openNow ? "#2f6b45" : "#8a4a2f",
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <Clock size={11} /> {place.openNow ? "Open now" : "Closed"}
            </span>
          )}
        </div>

        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            margin: "5px 0 6px",
            fontSize: 13,
            color: theme.colors.text,
          }}
        >
          {typeof place.rating === "number" && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
              <Star size={13} fill={theme.colors.gold} color={theme.colors.gold} />
              {place.rating.toFixed(1)}
              {place.userRatingsTotal ? (
                <span style={{ color: theme.colors.textLight }}>({place.userRatingsTotal})</span>
              ) : null}
            </span>
          )}
          {distance && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 3, color: theme.colors.textLight }}>
              <MapPin size={13} /> {distance}
            </span>
          )}
          {price && <span style={{ color: theme.colors.textLight }}>{price}</span>}
        </div>

        <p style={{ margin: "0 0 12px", fontSize: 13, color: theme.colors.textLight, lineHeight: 1.5 }}>
          {place.address}
        </p>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <a
            href={buildMapsSearchLink(place.mapsQuery)}
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "7px 14px",
              borderRadius: 10,
              background: theme.colors.primary,
              color: "#fff",
              fontWeight: 700,
              fontSize: 13,
              textDecoration: "none",
            }}
          >
            <Navigation size={14} /> Directions
          </a>
          <button
            type="button"
            onClick={copyAddress}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "7px 14px",
              borderRadius: 10,
              background: "transparent",
              border: `1px solid ${theme.colors.border}`,
              color: theme.colors.text,
              fontWeight: 600,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Copied" : "Copy address"}
          </button>
        </div>
      </div>
    </article>
  );
}

export function NearbyGuide() {
  const [data, setData] = useState<NearbySuggestionsResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterKey>("all");

  const allPlaces = useMemo<NearbyPlace[]>(() => {
    if (!data) return [];
    return [
      ...(data.food ?? []),
      ...(data.cafe ?? []),
      ...(data.fun ?? []),
      ...(data.essentials ?? []),
      ...(data.simCard ?? []),
    ];
  }, [data]);

  const visible = useMemo(() => {
    const list = filter === "all" ? allPlaces : allPlaces.filter((p) => p.category === filter);
    return [...list].sort((a, b) => (a.distanceMeters ?? Infinity) - (b.distanceMeters ?? Infinity));
  }, [allPlaces, filter]);

  const counts = useMemo(() => {
    const c: Record<FilterKey, number> = {
      all: allPlaces.length,
      food: 0,
      cafe: 0,
      fun: 0,
      essentials: 0,
      simCard: 0,
    };
    for (const p of allPlaces) c[p.category] += 1;
    return c;
  }, [allPlaces]);

  function handleFind() {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setError("Your browser does not support location. Try a different device or browser.");
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
          const res = await fetch(`/api/nearby?${params.toString()}`);
          const result = (await res.json()) as NearbySuggestionsResult & { error?: string };
          if (!res.ok) throw new Error(result.error || "Could not load nearby places.");
          setData(result);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Could not load nearby places.");
        } finally {
          setLoading(false);
        }
      },
      (geoErr) => {
        setLoading(false);
        setError(
          geoErr.code === geoErr.PERMISSION_DENIED
            ? "Location permission was denied. Enable it in your browser settings, then try again."
            : "We couldn't get your location. Check your signal and try again.",
        );
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  return (
    <div style={wrapStyle}>
      {/* Guide / how-it-works */}
      <div style={{ ...cardShell, marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <MapPin size={22} color={theme.colors.primary} />
          <h2 style={{ margin: 0, fontSize: 22, color: theme.colors.text }}>Find places around you</h2>
        </div>
        <p style={{ margin: "0 0 20px", color: theme.colors.textLight, lineHeight: 1.6 }}>
          A quick, safety-first way to discover trusted food, cafés, sights and essentials near
          your current spot — with distance, opening hours and one-tap directions.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 14,
            marginBottom: 22,
          }}
        >
          {GUIDE_STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={step.title}
                style={{
                  position: "relative",
                  padding: 16,
                  borderRadius: 14,
                  background: "#FAF7F2",
                  border: `1px solid ${theme.colors.border}`,
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: 12,
                    right: 14,
                    fontSize: 13,
                    fontWeight: 800,
                    color: theme.colors.border,
                  }}
                >
                  {i + 1}
                </span>
                <div style={{ color: theme.colors.primary, marginBottom: 8 }}>
                  <Icon size={22} strokeWidth={1.8} />
                </div>
                <strong style={{ display: "block", fontSize: 14.5, color: theme.colors.text, marginBottom: 4 }}>
                  {step.title}
                </strong>
                <span style={{ fontSize: 13, color: theme.colors.textLight, lineHeight: 1.5 }}>
                  {step.body}
                </span>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={handleFind}
          disabled={loading}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "13px 22px",
            borderRadius: 12,
            border: "none",
            background: theme.colors.primary,
            color: "#fff",
            fontWeight: 700,
            fontSize: 15,
            cursor: loading ? "default" : "pointer",
            opacity: loading ? 0.7 : 1,
          }}
        >
          <Locate size={17} />
          {loading ? "Locating you…" : data ? "Refresh nearby places" : "Use my location"}
        </button>

        {data && (
          <p style={{ margin: "12px 0 0", fontSize: 13, color: theme.colors.textLight }}>
            Showing results near <strong>{data.areaLabel}</strong>. Distances are straight-line
            estimates.
          </p>
        )}

        {error && (
          <div
            style={{
              marginTop: 16,
              padding: 14,
              borderRadius: 12,
              background: "rgba(153,27,27,0.08)",
              border: "1px solid rgba(153,27,27,0.2)",
              color: "#991b1b",
              fontSize: 14,
              lineHeight: 1.5,
            }}
          >
            {error}
          </div>
        )}
      </div>

      {/* Results */}
      {data && (
        <div style={{ ...cardShell, marginBottom: 20 }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
            {FILTERS.map((f) => {
              const active = filter === f.key;
              const count = counts[f.key];
              return (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setFilter(f.key)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: 999,
                    border: `1px solid ${active ? theme.colors.primary : theme.colors.border}`,
                    background: active ? theme.colors.primary : "transparent",
                    color: active ? "#fff" : theme.colors.text,
                    fontWeight: 600,
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  {f.label}
                  <span style={{ opacity: 0.7, marginLeft: 6 }}>{count}</span>
                </button>
              );
            })}
          </div>

          {filter !== "all" && (
            <p
              style={{
                margin: "0 0 14px",
                padding: "10px 14px",
                borderRadius: 10,
                background: "rgba(196,163,90,0.12)",
                color: theme.colors.text,
                fontSize: 13,
                lineHeight: 1.5,
              }}
            >
              <ShieldCheck size={14} style={{ verticalAlign: "-2px", marginRight: 6 }} />
              {CATEGORY_META[filter].tip}
            </p>
          )}

          {visible.length ? (
            <div style={{ display: "grid", gap: 12 }}>
              {visible.map((place) => (
                <PlaceRow key={place.id} place={place} />
              ))}
            </div>
          ) : (
            <p style={{ color: theme.colors.textLight, fontSize: 14 }}>
              No places found in this category nearby. Try “All” or refresh from a different spot.
            </p>
          )}
        </div>
      )}

      {/* Safety guidance */}
      <div style={cardShell}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <ShieldCheck size={20} color={theme.colors.primary} />
          <h3 style={{ margin: 0, fontSize: 17, color: theme.colors.text }}>Stay safe while exploring</h3>
        </div>
        <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 8 }}>
          {SAFETY_TIPS.map((tip) => (
            <li key={tip} style={{ color: theme.colors.textLight, fontSize: 14, lineHeight: 1.5 }}>
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
