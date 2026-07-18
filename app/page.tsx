import type { CSSProperties } from "react";
import { cookies } from "next/headers";
import { HomeContent } from "../components/companion/HomeContent";
import { createClient } from "../utils/supabase/server";

export default async function HomePage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  
  // Fetch user for personalized greeting
  const { data: { user } } = await supabase.auth.getUser();
  const firstName = user?.user_metadata?.first_name || user?.email?.split('@')[0] || undefined;

  const { data: todos } = await supabase.from("todos").select();

  return (
    <main>
      <HomeContent todos={todos} firstName={firstName} />
    </main>
  );
}
