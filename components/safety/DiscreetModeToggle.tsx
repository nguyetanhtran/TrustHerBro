"use client";

export function DiscreetModeToggle({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        padding: 14,
        borderRadius: 14,
        background: "#eff6ff",
      }}
    >
      <span>
        <strong>Discreet Mode</strong>
        <br />
        <small>English guidance read quietly through your earphones</small>
      </span>
      <input
        type="checkbox"
        checked={enabled}
        onChange={(event) => onChange(event.target.checked)}
      />
    </label>
  );
}
