import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";

import { routing } from "./i18n/routing";
import { updateSession } from "./lib/supabase/middleware";

const handleI18n = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  // 1. next-intl resolves the locale (may rewrite/redirect) and builds a response.
  const response = handleI18n(request);
  // 2. Only admin routes need the auth session refreshed + cookies synced.
  if (/\/admin(\/|$)/.test(request.nextUrl.pathname)) {
    return updateSession(request, response);
  }
  return response;
}

export const config = {
  // Run on every path except API routes, Next internals and static files.
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
