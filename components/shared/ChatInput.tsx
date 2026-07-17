"use client";

import type { FormEvent } from "react";
import { useState } from "react";

export function ChatInput({
  onSend,
  placeholder,
  disabled,
}: {
  onSend: (value: string) => Promise<void> | void;
  placeholder?: string;
  disabled?: boolean;
}) {
  const [value, setValue] = useState("");

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
          padding: "12px 14px",
          borderRadius: 14,
          border: "1px solid #cbd5e1",
        }}
      />
      <button
        type="submit"
        disabled={disabled}
        style={{
          padding: "12px 16px",
          borderRadius: 14,
          border: "none",
          background: "#1d4ed8",
          color: "#ffffff",
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        Send
      </button>
    </form>
  );
}
