import { createNavigation } from "next-intl/navigation";

import { routing } from "./routing";

/**
 * Locale-aware navigation primitives. Always import `Link`, `useRouter`,
 * `usePathname`, `redirect` from here instead of `next/navigation` so the
 * active locale prefix is handled automatically.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
