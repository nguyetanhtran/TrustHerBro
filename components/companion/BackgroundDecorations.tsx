"use client";

import { useEffect, useState } from "react";
import { theme } from "../../lib/theme";

/** Soft paper wash only — heritage art scrolls with page content instead. */
export function BackgroundDecorations() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        overflow: "hidden",
        pointerEvents: "none",
        background: theme.colors.background,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `
            radial-gradient(ellipse at 20% 10%, rgba(196, 163, 90, 0.1), transparent 50%),
            radial-gradient(ellipse at 80% 90%, rgba(155, 44, 31, 0.06), transparent 45%),
            linear-gradient(180deg, #F7F0DF 0%, ${theme.colors.background} 40%, ${theme.colors.paperDeep} 100%)
          `,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.2,
          mixBlendMode: "multiply",
          backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(GRAIN)}")`,
          backgroundSize: "200px 200px",
        }}
      />
    </div>
  );
}

const GRAIN = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180">
  <filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="3" stitchTiles="stitch"/></filter>
  <rect width="100%" height="100%" filter="url(#n)" opacity="0.5"/>
</svg>`;
