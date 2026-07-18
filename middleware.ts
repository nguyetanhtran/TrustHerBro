import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "./utils/supabase/middleware";

// Routes reachable while logged out.
const PUBLIC_PATHS = ["/login"];

// Carry the refreshed auth cookies onto a redirect so the session isn't lost.
function redirectTo(request: NextRequest, pathname: string, from: NextResponse) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  const response = NextResponse.redirect(url);
  from.cookies.getAll().forEach((cookie) => response.cookies.set(cookie));
  return response;
}

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request);
  const { pathname } = request.nextUrl;

  // Dev escape hatch: set DISABLE_AUTH=true in .env.local to skip the login
  // gate entirely (session is still refreshed). Remove it to re-enable auth.
  if (process.env.DISABLE_AUTH === "true") return supabaseResponse;

  // Never redirect API calls — just keep the session fresh.
  if (pathname.startsWith("/api")) return supabaseResponse;

  const isPublic = PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );

  // Logged out: only public routes are allowed.
  if (!user) {
    return isPublic ? supabaseResponse : redirectTo(request, "/login", supabaseResponse);
  }

  // Logged in: gate on whether they've finished the welcome flow.
  const onboarded = Boolean(user.user_metadata?.onboarded);

  if (!onboarded) {
    return pathname === "/welcome"
      ? supabaseResponse
      : redirectTo(request, "/welcome", supabaseResponse);
  }

  // Onboarded users shouldn't sit on the auth/onboarding screens.
  if (pathname === "/login" || pathname === "/welcome") {
    return redirectTo(request, "/", supabaseResponse);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
