import type { Metadata } from "next";
import type { CSSProperties, ReactNode } from "react";

export const metadata: Metadata = {
  title: "TrustHerBro",
  description: "Safety-first travel companion scaffold",
};

const bodyStyle: CSSProperties = {
  margin: 0,
  fontFamily: "ui-sans-serif, system-ui, sans-serif",
  background:
    "radial-gradient(circle at top, #fff7ed 0%, #fffaf5 35%, #f8fafc 100%)",
  color: "#172554",
  minHeight: "100vh",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="vi">
      <body style={bodyStyle}>{children}</body>
    </html>
  );
}
