"use client";

import type { CSSProperties } from "react";

/**
 * Đông Sơn motifs cut from the sheet — soft fixed watermarks for a
 * Vietnamese heritage atmosphere. Opacity stays low so content stays readable.
 */
const PIECES: Array<{
  src: string;
  w: number;
  rotate: number;
  opacity: number;
  pos: CSSProperties;
}> = [
  { src: "/images/dongson/motif-06.png", w: 220, rotate: -6, opacity: 0.14, pos: { top: "6%", left: "0%" } },
  { src: "/images/dongson/motif-01.png", w: 110, rotate: 8, opacity: 0.16, pos: { top: "8%", right: "10%" } },
  { src: "/images/dongson/motif-03.png", w: 150, rotate: -4, opacity: 0.13, pos: { top: "28%", left: "15%" } },
  { src: "/images/dongson/motif-13.png", w: 90, rotate: 12, opacity: 0.15, pos: { top: "36%", right: "18%" } },
  { src: "/images/dongson/motif-04.png", w: 130, rotate: 5, opacity: 0.12, pos: { top: "52%", left: "12%" } },
  { src: "/images/dongson/motif-09.png", w: 88, rotate: -10, opacity: 0.14, pos: { top: "58%", right: "6%" } },
  { src: "/images/dongson/motif-14.png", w: 160, rotate: 3, opacity: 0.12, pos: { bottom: "14%", left: "4%" } },
  { src: "/images/dongson/motif-08.png", w: 70, rotate: -8, opacity: 0.15, pos: { bottom: "6%", right: "15%" } },
  { src: "/images/dongson/motif-02.png", w: 100, rotate: 14, opacity: 0.11, pos: { bottom: "4%", left: "28%" } },
  { src: "/images/dongson/motif-18.png", w: 48, rotate: 0, opacity: 0.13, pos: { top: "72%", left: "42%" } },
];

export function DongSonDecor() {
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
          key={p.src + String(p.pos.top ?? p.pos.bottom)}
          src={p.src}
          alt=""
          draggable={false}
          style={{
            position: "absolute",
            width: `min(42vw, ${p.w}px)`,
            height: "auto",
            opacity: p.opacity,
            transform: `rotate(${p.rotate}deg)`,
            filter: "sepia(0.15) saturate(1.1)",
            ...p.pos,
          }}
        />
      ))}
    </div>
  );
}
