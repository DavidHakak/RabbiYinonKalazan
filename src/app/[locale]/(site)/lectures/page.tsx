import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";

import { CardGridSkeleton } from "@/components/common/card-grid-skeleton";
import { Hero } from "@/components/common/hero";
import { LecturesFilters } from "@/components/lectures/lectures-filters";
import { LecturesResults } from "@/components/lectures/lectures-results";
import { Section } from "@/components/layout/section";
import type { ContentType } from "@/db/schema";
import type { Locale } from "@/i18n/config";
import type { LectureQuery, LectureSort } from "@/lib/lectures-query";
import { getLectureFacets } from "@/repositories/lectures";

// Reads searchParams (filters + page) → rendered per request. Each navigation
// fetches only one page from the DB, so the page never ships the whole table.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "lectures" });
  return { title: t("title"), description: t("subtitle") };
}

type SearchParams = Record<string, string | string[] | undefined>;

function str(value: string | string[] | undefined): string | undefined {
  const v = Array.isArray(value) ? value[0] : value;
  return v && v.trim() ? v.trim() : undefined;
}

const CONTENT_TYPES: ContentType[] = ["video", "audio", "article"];
const SORTS: LectureSort[] = ["newest", "oldest", "longest", "shortest"];

export default async function LecturesPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<SearchParams>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const sp = await searchParams;

  const typeParam = str(sp.type);
  const sortParam = str(sp.sort);
  const pageNum = Number.parseInt(str(sp.page) ?? "1", 10);

  const query: LectureQuery = {
    locale,
    q: str(sp.q),
    topic: str(sp.topic),
    series: str(sp.series),
    type: CONTENT_TYPES.includes(typeParam as ContentType)
      ? (typeParam as ContentType)
      : undefined,
    sort: SORTS.includes(sortParam as LectureSort)
      ? (sortParam as LectureSort)
      : "newest",
    page: Number.isFinite(pageNum) && pageNum > 0 ? pageNum : 1,
    pageSize: 9,
  };

  const facets = await getLectureFacets(query);

  // Re-key the Suspense boundary on the query so a filter/page change swaps in
  // the skeleton while the new page loads.
  const suspenseKey = JSON.stringify(query);

  return (
    <>
      <Hero
        size="sm"
        title={t("lectures.title")}
        subtitle={t("lectures.subtitle")}
      />
      <Section size="lg">
        <div className="flex flex-col gap-6">
          <LecturesFilters
            facets={facets}
            current={{
              q: query.q,
              topic: query.topic,
              series: query.series,
              type: query.type,
              sort: query.sort === "newest" ? undefined : query.sort,
            }}
          />
          <Suspense key={suspenseKey} fallback={<CardGridSkeleton />}>
            <LecturesResults query={query} locale={locale} />
          </Suspense>
        </div>
      </Section>
    </>
  );
}
