"use client";

import type { CSSProperties } from "react";

/**
 * Soft watercolor accents for the Location page only.
 * piece-04 cloud ×2, piece-05 mountains ×1, piece-06 terraces ×1.
 */
const PIECES: Array<{
  src: string;
  w: number;
  rotate: number;
  opacity: number;
  pos: CSSProperties;
}> = [
  // Clouds (2)
  {
    src: "/images/vn-decor/piece-04.png",
    w: 280,
    rotate: -5,
    opacity: 0.8  ,
    pos: { top: "4%", left: "2%" },
  },
  {
    src: "/images/vn-decor/piece-04.png",
    w: 400,
    rotate: 10,
    opacity: 0.6,
    pos: { top: "10%", right: "3%" },
  },
  // Mountains (1)
  {
    src: "/images/vn-decor/piece-05.png",
    w: 1000,
    rotate: 0,
    opacity: 0.9,
    pos: { bottom: "-20%", right: "-2%" },
  },
  // Terraced fields (1)
  {
    src: "/images/vn-decor/piece-06.png",
    w: 800,
    rotate: -2,
    opacity: 0.4,
    pos: { bottom: "0%", left: "-9%" },
  },
];

export function LocationDecor() {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {PIECES.map((p, i) => (
        <img
          key={`${p.src}-${i}`}
          src={p.src}
          alt=""
          draggable={false}
          style={{
            position: "absolute",
            width: `min(55vw, ${p.w}px)`,
            height: "auto",
            opacity: p.opacity,
            transform: `rotate(${p.rotate}deg)`,
            ...p.pos,
          }}
        />
      ))}
    </div>
  );
}
