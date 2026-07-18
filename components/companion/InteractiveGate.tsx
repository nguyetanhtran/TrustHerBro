"use client";

import { useRef, type MouseEvent } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { MaskedBrandTitle } from "./MaskedBrandTitle";

/**
 * 🔧 Vị trí chữ theo chiều dọc (độc lập với ảnh nền).
 * Giảm % = chữ lên cao hơn, tăng % = xuống thấp. 50% = giữa.
 */
const TITLE_TOP = "35%";

/**
 * Sticky heritage exhibition poster — cổ đô / bảo tàng editorial.
 */
export function InteractiveGate() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 70, damping: 22 });
  const springY = useSpring(mouseY, { stiffness: 70, damping: 22 });
  const tiltX = useTransform(springY, [-0.5, 0.5], [3, -3]);
  const tiltY = useTransform(springX, [-0.5, 0.5], [-4, 4]);

  const titleScale = useTransform(scrollYProgress, [0, 0.7], [1, 1.03]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.06, 1.14]);

  function onMouseMove(e: MouseEvent) {
    const el = stickyRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function onMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <div
      ref={containerRef}
      style={{ height: "72vh", minHeight: 480, position: "relative", zIndex: 1 }}
    >
      <div
        ref={stickyRef}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={{
          position: "sticky",
          top: 0,
          height: "72vh",
          minHeight: 480,
          overflow: "hidden",
          background: "transparent",
          perspective: 1400,
        }}
      >
        {/* ---- LAYER 1: Landscape backdrop — lớp riêng, KHÔNG bị chữ đẩy ---- */}
        <motion.div
          aria-hidden
          style={{
            position: "absolute",
            inset: "-4%",
            zIndex: 0,
            backgroundImage: `url("/images/gate-landscape.png")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            scale: bgScale,
          }}
        />

        {/* Soft wash centred on the wordmark for legibility */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `
              radial-gradient(ellipse 60% 46% at 50% ${TITLE_TOP}, rgba(250, 244, 232, 0.82) 0%, rgba(250, 244, 232, 0.45) 45%, transparent 72%)
            `,
            zIndex: 1,
          }}
        />

        {/* ---- LAYER 2: Wordmark — lớp riêng, đặt tuyệt đối theo TITLE_TOP ---- */}
        <motion.div
          style={{
            position: "absolute",
            top: TITLE_TOP,
            left: 0,
            right: 0,
            y: "-50%",
            zIndex: 6,
            textAlign: "center",
            scale: titleScale,
            rotateX: tiltX,
            rotateY: tiltY,
            transformStyle: "preserve-3d",
            overflow: "visible",
          }}
        >
          <div style={{ width: "min(760px, 88vw)", margin: "0 auto", padding: "0 8px" }}>
            <MaskedBrandTitle
              size="poster"
              scriptText="Xin chào"
              imageSrc="/images/heritage-collage.png"
              asH1
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

