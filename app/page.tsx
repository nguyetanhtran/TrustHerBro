import type { CSSProperties } from "react";
import { cookies } from "next/headers";
import { HomeContent } from "../components/companion/HomeContent";
import { createClient } from "../utils/supabase/server";

const shellStyle: CSSProperties = {
  maxWidth: 1100,
  margin: "0 auto",
  padding: "48px 24px 80px",
};

const heroCard: CSSProperties = {
  padding: 28,
  borderRadius: 24,
  background: "rgba(255,255,255,0.88)",
  border: "1px solid rgba(251,146,60,0.25)",
  boxShadow: "0 18px 50px rgba(15, 23, 42, 0.08)",
};

export default async function HomePage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: todos } = await supabase.from("todos").select();

  return (
    <main style={shellStyle}>
      <div style={heroCard}>
        <HomeContent todos={todos} />
      </div>
    </main>
  );
}
