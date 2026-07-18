export const theme = {
  colors: {
    // Heritage editorial — sơn mài / giấy cổ
    background: "#F3EBD8", // ngà vàng báo cũ
    paper: "#EFE4CC",
    paperDeep: "#E6D7B8",
    primary: "#9B2C1F", // đỏ son
    secondary: "#C45A2C", // đỏ gạch / terracotta
    brick: "#8B3A2A",
    cinnabar: "#B83A2A",
    gold: "#C4A35A", // vàng đồng
    bronze: "#8A6B2F",
    teal: "#3D6B62", // muted, secondary only
    tealDeep: "#2A4A44",
    tealSoft: "#A8BDB6",
    tealMid: "#4F7A70",
    text: "#2A2218",
    card: "#FAF6EC",
    textLight: "#6B5E4E",
    border: "#D4C4A4",
    mist: "#F3EBD8",
    sky: "#F7F0E0",
    maskInk: "#6E1A12", // solid top of masked letters
    lacquer: "#7A1F16",
  },
  shadows: {
    soft: "0 8px 24px rgba(42, 34, 24, 0.06)",
    medium: "0 12px 32px rgba(42, 34, 24, 0.1)",
  },
  borderRadius: {
    card: 16,
    button: 12,
  },
  fonts: {
    display: "var(--font-display), 'Arial Narrow', Impact, sans-serif",
    script: "var(--font-script), Georgia, 'Times New Roman', serif",
    body: "var(--font-body), ui-sans-serif, system-ui, sans-serif",
  },
  motion: {
    easeOut: [0.16, 1, 0.3, 1] as const,
    easeSoft: [0.22, 1, 0.36, 1] as const,
  },
};
