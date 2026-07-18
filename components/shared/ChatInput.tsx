"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { theme } from "../../lib/theme";

export function ChatInput({
  onSend,
  placeholder,
  disabled,
  initialValue = "",
}: {
  onSend: (value: string) => Promise<void> | void;
  placeholder?: string;
  disabled?: boolean;
  initialValue?: string;
}) {
  const [value, setValue] = useState(initialValue);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!value.trim()) return;

    const nextValue = value;
    setValue("");
    await onSend(nextValue);
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", gap: 12 }}>
      <input
        value={value}
        disabled={disabled}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder ?? "Type your message"}
        style={{
          flex: 1,
          minWidth: 0,
          padding: "12px 14px",
          borderRadius: theme.borderRadius.button,
          border: `1px solid ${theme.colors.border}`,
          background: "#FAF7F2",
          color: theme.colors.text,
          fontFamily: "inherit",
          fontSize: 15,
          outline: "none",
          boxSizing: "border-box",
        }}
      />
      <button
        type="submit"
        disabled={disabled}
        style={{
          padding: "12px 16px",
          borderRadius: theme.borderRadius.button,
          border: "none",
          background: theme.colors.primary,
          color: "#ffffff",
          fontWeight: 700,
          cursor: disabled ? "default" : "pointer",
          opacity: disabled ? 0.7 : 1,
        }}
      >
        Send
      </button>
    </form>
  );
}
