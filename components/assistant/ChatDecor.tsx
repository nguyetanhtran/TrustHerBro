"use client";

import type { CSSProperties } from "react";

/**
 * Chat (/assistant) background accents — one of each cultural illustration.
 * Files: di_thuyen, don_ca_tai_tu, hang_rong.
 */
const PIECES: Array<{
  src: string;
  w: number;
  rotate: number;
  opacity: number;
  pos: CSSProperties;
}> = [
  {
    src: "/images/di_thuyen.png",
    w: 400,
    rotate: 5,
    opacity: 0.45,
    pos: { bottom: "8%", left: "1%" },
  },
  {
    src: "/images/don_ca_tai_tu.png",
    w: 500,
    rotate: 3,
    opacity: 0.5,
    pos: { top: "12%", right: "0%" },
  },
  {
    src: "/images/hang_rong.png",
    w: 400,
    rotate: -2,
    opacity: 0.40,
    pos: { bottom: "5%", right: "5%" },
  },
];

export function ChatDecor() {
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
