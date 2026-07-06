import { createServerClient } from "@supabase/ssr";
import type { NextRequest, NextResponse } from "next/server";

/**
 * Refreshes the Supabase auth session on each request and syncs the auth cookies
 * onto the outgoing response. Required by @supabase/ssr so that Server Components
 * (e.g. the admin guard) can reliably read the session set by the browser client.
 *
 * Cookies are written onto the already-built `response` (produced by the i18n
 * middleware) so both concerns share one response.
 */
export async function updateSession(
  request: NextRequest,
  response: NextResponse,
): Promise<NextResponse> {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  // Touch the session — refreshes tokens and triggers cookie writes via setAll.
  await supabase.auth.getUser();

  return response;
}
