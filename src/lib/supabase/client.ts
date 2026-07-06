import { createBrowserClient } from "@supabase/ssr";

/** Supabase client for browser/client components (login form). Cookie-based so SSR can read the session. */
export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
