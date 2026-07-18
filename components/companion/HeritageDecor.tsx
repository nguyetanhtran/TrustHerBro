"use client";

import type { CSSProperties } from "react";

/**
 * 🔧 CHỈNH KÍCH THƯỚC Ở ĐÂY.
 * Tăng SCALE → tất cả di tích to lên (1 = mặc định, 1.5 = to gấp rưỡi...).
 * Hoặc chỉnh riêng `basePx` của từng ảnh bên dưới.
 */
const SCALE = 1.3;

type Piece = {
  src: string;
  float: string;
  basePx: number; 
  pos: CSSProperties; // vị trí
};

const PIECES: Piece[] = [
  {
    src: "/images/vn-pavilion.png",
    float: "hdFloatA 15s ease-in-out infinite",
    basePx: 600,
    pos: { top: "5%", right: "0%" },
  },
  {
    src: "/images/vn-naround.png",
    float: "hdFloatB 18s ease-in-out infinite",
    basePx: 600,
    pos: { top: "29%", left: "0%" },
  },
  {
    src: "/images/vn-onepillar.png",
    float: "hdFloatA 17s ease-in-out infinite reverse",
    basePx: 600,
    pos: { top: "53%", right: "0%" },
  },
  {
    src: "/images/vn-junkboat.png",
    float: "hdFloatB 16s ease-in-out infinite",
    basePx: 600,
    pos: { top: "77%", left: "0%" },
  },
];

export function HeritageDecor({ opacity = 0.7 }: { opacity?: number }) {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      <style>{`
        @keyframes hdFloatA {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-14px); }
        }
        @keyframes hdFloatB {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(12px); }
        }
      `}</style>

      {PIECES.map((p) => (
        <img
          key={p.src}
          src={p.src}
          alt=""
          style={{
            position: "absolute",
            height: "auto",
            width: `min(92vw, ${Math.round(p.basePx * SCALE)}px)`,
            opacity,
            animation: p.float,
            ...p.pos,
          }}
        />
      ))}

      {/* Soft veil so foreground text stays readable */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(247,240,223,0.32) 0%, rgba(247,240,223,0.5) 45%, rgba(247,240,223,0.55) 100%)",
        }}
      />
    </div>
  );
}
