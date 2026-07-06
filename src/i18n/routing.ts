import { defineRouting } from "next-intl/routing";

import { defaultLocale, locales } from "./config";

export const routing = defineRouting({
  locales,
  defaultLocale,
  // Every locale is prefixed in the URL (/he/..., /en/...) for clean SEO + hreflang.
  localePrefix: "always",
});
