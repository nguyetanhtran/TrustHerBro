"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { NearbyGuide } from "../../components/location/NearbyGuide";
import { theme } from "../../lib/theme";

function LocationContent() {
  const searchParams = useSearchParams();
  const autoFind = searchParams.get("find") === "1";

  return (
    <>
      <header
        style={{
          maxWidth: 960,
          margin: "0 auto 28px",
          padding: "0 20px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            margin: "0 0 10px",
            fontSize: 11,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: theme.colors.bronze,
            fontWeight: 700,
          }}
        >
          Location
        </p>
        <h1 style={{ margin: "0 0 8px", fontSize: "clamp(28px, 5vw, 40px)", color: theme.colors.text }}>
          Explore around you
        </h1>
        <p style={{ margin: 0, color: theme.colors.textLight, fontSize: 15, lineHeight: 1.6 }}>
          Search by address or use your GPS — then browse trusted spots nearby.
        </p>
      </header>

      <NearbyGuide autoFind={autoFind} />
    </>
  );
}

export default function LocationPage() {
  return (
    <main style={{ padding: "40px 0 0" }}>
      <Suspense
        fallback={
          <p style={{ textAlign: "center", color: theme.colors.textLight, padding: 40 }}>
            Loading...
          </p>
        }
      >
        <LocationContent />
      </Suspense>
    </main>
  );
}
