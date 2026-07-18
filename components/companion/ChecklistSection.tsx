"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { theme } from "../../lib/theme";

const sectionStyle: CSSProperties = {
  maxWidth: 1100,
  margin: "0 auto",
  padding: "24px",
};

const containerStyle: CSSProperties = {
  padding: 24,
  borderRadius: theme.borderRadius.card,
  background: theme.colors.card,
  border: `1px solid ${theme.colors.border}`,
  boxShadow: theme.shadows.soft,
};

const headerStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 16,
};

const titleStyle: CSSProperties = {
  fontSize: 20,
  fontWeight: 700,
  color: theme.colors.text,
  margin: 0,
};

const linkStyle: CSSProperties = {
  color: theme.colors.primary,
  textDecoration: "none",
  fontWeight: 600,
  fontSize: 14,
};

const listStyle: CSSProperties = {
  listStyle: "none",
  padding: 0,
  margin: 0,
  display: "flex",
  flexDirection: "column",
  gap: 12,
};

const itemStyle: CSSProperties = {
  padding: "12px 16px",
  background: "#FAF7F2",
  borderRadius: 12,
  border: `1px solid ${theme.colors.border}`,
  color: theme.colors.text,
};

type Todo = { id: string | number; name: string };

export function ChecklistSection({ todos }: { todos: Todo[] | null }) {
  return (
    <section style={sectionStyle}>
      <div style={containerStyle}>
        <div style={headerStyle}>
          <h2 style={titleStyle}>Today's Checklist</h2>
          <Link href="/timeline" style={linkStyle}>
            View full plan →
          </Link>
        </div>
        <ul style={listStyle}>
          {todos?.length ? (
            todos.map((todo) => (
              <li key={todo.id} style={itemStyle}>
                {todo.name}
              </li>
            ))
          ) : (
            <li style={{ color: theme.colors.textLight }}>Nothing on the checklist yet.</li>
          )}
        </ul>
      </div>
    </section>
  );
}
