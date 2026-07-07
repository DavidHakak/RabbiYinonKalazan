import { NextResponse } from "next/server";

import { defaultLocale, locales, type Locale } from "@/i18n/config";
import { searchContent } from "@/lib/search";

export const dynamic = "force-dynamic";

/** GET /api/search?q=…&locale=he — full-site content search for the header box. */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") ?? "").slice(0, 100);
  const localeParam = searchParams.get("locale");
  const locale: Locale = locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : defaultLocale;

  try {
    const results = await searchContent(q, locale);
    return NextResponse.json({ results });
  } catch (err) {
    console.error("[search] failed:", err);
    return NextResponse.json({ results: [], error: "search failed" }, { status: 500 });
  }
}
