"use client";

import type { CSSProperties } from "react";

/**
 * First Night (/onboarding, /timeline) background accents.
 * Files: bieu_dien, ca_tru.
 */
const PIECES: Array<{
  src: string;
  w: number;
  rotate: number;
  opacity: number;
  pos: CSSProperties;
}> = [
  {
    src: "/images/bieu_dien.png",
    w: 500,
    rotate: -2,
    opacity: 0.42,
    pos: { top: "15%", left: "-2%" },
  },
  {
    src: "/images/ca_tru.png",
    w: 450,
    rotate: 3,
    opacity: 0.45,
    pos: { bottom: "25%", right: "-2%" },
  },
  {
    src: "/images/nha_nhac_cung_dinh.png",
    w: 400,
    rotate: 3,
    opacity: 0.4,
    pos: { bottom: "4%", left: "1%" },
  },
];

export function FirstNightDecor() {
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
      {PIECES.map((p) => (
        <img
          key={p.src}
          src={p.src}
          alt=""
          draggable={false}
          style={{
            position: "absolute",
            width: `min(48vw, ${p.w}px)`,
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
