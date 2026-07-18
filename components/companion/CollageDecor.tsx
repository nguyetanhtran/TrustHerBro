"use client";

import type { CSSProperties } from "react";

/**
 * Các element cắt rời từ collage "Việt Nam", rải quanh khung gate.
 * Giữa để trống cho chữ Xin chào / TrustHerBro.
 * 🔧 Chỉnh SCALE để phóng to/thu nhỏ toàn bộ.
 */
const SCALE = 1;

type Piece = {
  src: string;
  w: number; // px cơ bản
  rotate: number;
  float: string;
  pos: CSSProperties;
};

const PIECES: Piece[] = [
  // hàng trái
  {
    src: "/images/collage/piece-01.png",
    w: 240,
    rotate: -3,
    float: "cdFloatA 16s ease-in-out infinite",
    pos: { top: "1%", left: "1%" },
  },
  {
    src: "/images/collage/piece-04.png",
    w: 120,
    rotate: 4,
    float: "cdFloatB 13s ease-in-out infinite",
    pos: { top: "40%", left: "2%" },
  },
  {
    src: "/images/collage/piece-05.png",
    w: 118,
    rotate: -5,
    float: "cdFloatA 15s ease-in-out infinite reverse",
    pos: { top: "60%", left: "0%" },
  },
  {
    src: "/images/collage/piece-06.png",
    w: 150,
    rotate: 3,
    float: "cdFloatB 17s ease-in-out infinite",
    pos: { bottom: "3%", left: "3%" },
  },
  // hàng phải
  {
    src: "/images/collage/piece-03.png",
    w: 120,
    rotate: 4,
    float: "cdFloatA 14s ease-in-out infinite",
    pos: { top: "6%", right: "3%" },
  },
  {
    src: "/images/collage/piece-07.png",
    w: 120,
    rotate: -4,
    float: "cdFloatB 12s ease-in-out infinite reverse",
    pos: { top: "46%", right: "1%" },
  },
  {
    src: "/images/collage/piece-09.png",
    w: 240,
    rotate: 2,
    float: "cdFloatA 18s ease-in-out infinite",
    pos: { bottom: "0%", right: "1%" },
  },
  // đáy giữa
  {
    src: "/images/collage/piece-08.png",
    w: 150,
    rotate: -2,
    float: "cdFloatB 15s ease-in-out infinite",
    pos: { bottom: "1%", left: "34%" },
  },
];

export function CollageDecor({ opacity = 1 }: { opacity?: number }) {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 4,
      }}
    >
      <style>{`
        @keyframes cdFloatA {
          0%, 100% { transform: translateY(0) rotate(var(--r)); }
          50% { transform: translateY(-12px) rotate(var(--r)); }
        }
        @keyframes cdFloatB {
          0%, 100% { transform: translateY(0) rotate(var(--r)); }
          50% { transform: translateY(10px) rotate(var(--r)); }
        }
      `}</style>

      {PIECES.map((p) => (
        <img
          key={p.src}
          src={p.src}
          alt=""
          style={{
            position: "absolute",
            width: `min(38vw, ${Math.round(p.w * SCALE)}px)`,
            height: "auto",
            opacity,
            filter: "drop-shadow(0 8px 16px rgba(90,50,20,0.18))",
            ["--r" as string]: `${p.rotate}deg`,
            animation: p.float,
            ...p.pos,
          }}
        />
      ))}
    </div>
  );
}
