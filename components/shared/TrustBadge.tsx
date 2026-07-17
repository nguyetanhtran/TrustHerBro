export function TrustBadge({
  score,
  label = "rated by female travelers",
}: {
  score: number;
  label?: string;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 12px",
        borderRadius: 999,
        background: "#ecfccb",
        color: "#365314",
        fontWeight: 700,
      }}
    >
      {score.toFixed(1)}/10 {label}
    </span>
  );
}
