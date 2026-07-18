import type { Metadata } from "next";
import type { CSSProperties, ReactNode } from "react";
import { Archivo_Black, Great_Vibes, Source_Sans_3 } from "next/font/google";
import { ModeNav } from "../components/mode-switch/ModeNav";
import { LanguageProvider } from "../lib/i18n/LanguageContext";
import { BackgroundDecorations } from "../components/companion/BackgroundDecorations";

const display = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const script = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-script",
  display: "swap",
});

const body = Source_Sans_3({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TrustHerBro",
  description: "Safety-first travel companion scaffold",
};

const bodyStyle: CSSProperties = {
  margin: 0,
  fontFamily: "var(--font-body), ui-sans-serif, system-ui, sans-serif",
  background: "transparent",
  color: "#2A2218",
  minHeight: "100vh",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${script.variable} ${body.variable}`}>
      <body style={bodyStyle}>
        <LanguageProvider>
          <BackgroundDecorations />
          <ModeNav />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
