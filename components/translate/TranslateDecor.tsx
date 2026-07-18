"use client";

import type { CSSProperties } from "react";

/**
 * Translate (/translate) background accents.
 * Files: nhay_bao_bo, ruoc_den, rong_ran_len_may.
 */
const PIECES: Array<{
  src: string;
  w: number;
  rotate: number;
  opacity: number;
  pos: CSSProperties;
}> = [
  {
    src: "/images/nhay_bao_bo.png",
    w: 550,
    rotate: -3,
    opacity: 0.42,
    pos: { bottom: "2%", right: "6%" },
  },
  {
    src: "/images/tha_dieu.png",
    w: 550,
    rotate: 2,
    opacity: 0.44,
    pos: { top: "8%", left: "2%" },
  },
  {
    src: "/images/ruoc_den.png",
    w: 550,
    rotate: 4,
    opacity: 0.4,
    pos: { bottom: "2%", left: "6%" },
  },
  {
    src: "/images/rong_ran_len_may.png",
    w: 550,
    rotate: 2,
    opacity: 0.44,
    pos: { top: "8%", right: "2%" },
  },
];

export function TranslateDecor() {
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
