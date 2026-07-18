"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { theme } from "../../lib/theme";
import { DongSonDecor } from "./DongSonDecor";
import { LocationDecor } from "../location/LocationDecor";
import { ChatDecor } from "../assistant/ChatDecor";
import { FirstNightDecor } from "../onboarding/FirstNightDecor";
import { TranslateDecor } from "../translate/TranslateDecor";

/** Soft paper wash + page-specific heritage watermarks. */
export function BackgroundDecorations() {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const isLocation = pathname === "/location" || pathname?.startsWith("/location/");
  const isChat = pathname === "/assistant" || pathname?.startsWith("/assistant/");
  const isTranslate = pathname === "/translate" || pathname?.startsWith("/translate/");
  const isFirstNight =
    pathname === "/onboarding" ||
    pathname?.startsWith("/onboarding/") ||
    pathname === "/timeline" ||
    pathname?.startsWith("/timeline/");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  let decor = <DongSonDecor />;
  if (isLocation) decor = <LocationDecor />;
  else if (isChat) decor = <ChatDecor />;
  else if (isTranslate) decor = <TranslateDecor />;
  else if (isFirstNight) decor = <FirstNightDecor />;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
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
      {decor}
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
