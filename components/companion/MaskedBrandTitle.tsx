"use client";

import type { CSSProperties } from "react";
import { theme } from "../../lib/theme";

type Props = {
  style?: CSSProperties;
  showScript?: boolean;
  scriptText?: string;
  /** giữ lại cho tương thích, không còn dùng cho mask */
  imageSrc?: string;
  asH1?: boolean;
  size?: "hero" | "poster";
};

const WORD = "TrustHerBro";
const LETTERS = WORD.toUpperCase().split("");

/**
 * Wordmark "TrustHerBro" dựng từ ảnh từng chữ cái (font 3D hồng ánh kim
 * trong /images/font/). Dòng script "Xin chào" ở trên vẫn dùng font chữ viết.
 */
export function MaskedBrandTitle({
  style,
  showScript = true,
  scriptText = "Xin chào",
  asH1 = true,
  size = "hero",
}: Props) {
  const Tag = asH1 ? "h1" : "p";
  const letterHeight =
    size === "poster"
      ? "clamp(46px, 9.5vw, 104px)"
      : "clamp(44px, 9vw, 96px)";

  return (
    <div
      style={{
        position: "relative",
        textAlign: "center",
        width: "100%",
        maxWidth: "100%",
        overflow: "visible",
        ...style,
      }}
    >
      {showScript && (
        <p
          style={{
            margin: "0 0 4px",
            fontFamily: theme.fonts.script,
            fontStyle: "normal",
            fontSize: "clamp(56px, 11vw, 112px)",
            fontWeight: 400,
            color: theme.colors.lacquer,
            letterSpacing: "0.01em",
            lineHeight: 1,
          }}
        >
          {scriptText}
        </p>
      )}

      <Tag
        aria-label={WORD}
        style={{
          margin: 0,
          display: "flex",
          flexWrap: "nowrap",
          alignItems: "center",
          justifyContent: "center",
          gap: "clamp(1px, 0.35vw, 5px)",
          overflow: "visible",
        }}
      >
        {LETTERS.map((ch, i) => (
          <img
            key={`${ch}-${i}`}
            src={`/images/font/${ch}.png`}
            alt=""
            aria-hidden
            draggable={false}
            style={{
              height: letterHeight,
              width: "auto",
              display: "block",
              userSelect: "none",
              filter: "drop-shadow(0 6px 10px rgba(120, 40, 60, 0.22))",
            }}
          />
        ))}
      </Tag>
    </div>
  );
}
