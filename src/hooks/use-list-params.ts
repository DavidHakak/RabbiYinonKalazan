"use client";

import { useSearchParams } from "next/navigation";
import { useCallback } from "react";

import { usePathname, useRouter } from "@/i18n/navigation";

/**
 * URL-as-state helper for server-driven listings. Filter selections and the page
 * number live in the query string, so each change is a light RSC navigation that
 * fetches only the next page from the server (never the whole dataset).
 */
export function useListParams() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const setParams = useCallback(
    (
      updates: Record<string, string | null | undefined>,
      opts?: { scroll?: boolean },
    ) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value == null || value === "") params.delete(key);
        else params.set(key, value);
      }
      // Pass the query as an object (not a query string baked into the href):
      // next-intl only preserves the query on navigation in this form, which is
      // what lets the browser Back button restore the exact filter + page.
      const query = Object.fromEntries(params.entries());
      router.replace({ pathname, query }, { scroll: opts?.scroll ?? false });
    },
    [router, pathname, searchParams],
  );

  return { searchParams, setParams };
}
