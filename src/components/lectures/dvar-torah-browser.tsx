"use client";

import {
  BookOpen,
  CalendarDays,
  Play,
  Scroll,
} from "lucide-react";
import { useMemo } from "react";
import { useTranslations } from "next-intl";

import { CategoryChips } from "@/components/common/category-chips";
import { ContentCard, type CardBadge } from "@/components/common/content-card";
import { EmptyState } from "@/components/common/empty-state";
import { FilterBar } from "@/components/common/filter-bar";
import { Pagination } from "@/components/common/pagination";
import { useFilteredContent } from "@/hooks/use-filtered-content";
import type { ContentType } from "@/db/schema";

/** Already-localized weekly-Torah shape passed from the server page. */
export interface DvarTorahView {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  parasha: string;
  bookLabel: string;
  /** Canonical position of the book (0 = Bereshit … 4 = Devarim) — orders the chips. */
  bookOrder: number;
  /** Canonical reading-order index of the parasha — orders the "by Torah order" sort. */
  parashaOrder: number;
  contentType: ContentType;
  durationLabel: string;
  publishedLabel: string;
  publishedAt: string;
  mediaUrl: string | null;
  /** Embeddable YouTube URL for the in-site player (null when not a video). */
  embedUrl: string | null;
}

const PAGE_SIZE = 9;

export function DvarTorahBrowser({ items }: { items: DvarTorahView[] }) {
  const t = useTranslations();

  // Label → canonical book order, so the chips read Bereshit → Devarim.
  const bookOrder = useMemo(() => {
    const map = new Map<string, number>();
    for (const item of items) {
      if (item.bookLabel && !map.has(item.bookLabel))
        map.set(item.bookLabel, item.bookOrder);
    }
    return map;
  }, [items]);

  const {
    query,
    search,
    selected,
    setFacet,
    facetOptions,
    sort,
    setSort,
    page,
    setPage,
    pageCount,
    visible,
    total,
    isFiltered,
    reset,
    ALL,
  } = useFilteredContent(items, {
    searchAccessor: (d) => `${d.title} ${d.excerpt} ${d.parasha} ${d.bookLabel}`,
    facets: [{ key: "book", accessor: (d) => d.bookLabel }],
    sorts: [
      { key: "newest", compare: (a, b) => b.publishedAt.localeCompare(a.publishedAt) },
      { key: "oldest", compare: (a, b) => a.publishedAt.localeCompare(b.publishedAt) },
      { key: "parasha", compare: (a, b) => a.parashaOrder - b.parashaOrder },
    ],
    defaultSort: "newest",
    pageSize: PAGE_SIZE,
  });

  const bookFacet = facetOptions.find((f) => f.key === "book");
  const bookChips = bookFacet
    ? [...bookFacet.values].sort(
        (a, b) =>
          (bookOrder.get(a.value) ?? 99) - (bookOrder.get(b.value) ?? 99),
      )
    : [];

  return (
    <div className="flex flex-col gap-6">
      {bookChips.length > 0 ? (
        <CategoryChips
          options={bookChips}
          value={selected.book ?? ""}
          onChange={(value) => setFacet("book", value)}
          allValue={ALL}
          allLabel={t("dvarTorah.allBooks")}
          allIcon={Scroll}
          totalCount={items.length}
        />
      ) : null}

      <FilterBar
        searchValue={query}
        onSearch={search}
        searchPlaceholder={t("dvarTorah.searchPlaceholder")}
        allLabel={t("common.all")}
        allValue={ALL}
        isFiltered={isFiltered}
        onReset={reset}
        clearLabel={t("common.clearFilters")}
        sort={{
          value: sort,
          label: t("common.sortBy"),
          onChange: setSort,
          options: [
            { value: "newest", label: t("common.sort.newest") },
            { value: "oldest", label: t("common.sort.oldest") },
            { value: "parasha", label: t("dvarTorah.sort.parasha") },
          ],
        }}
      />

      <p className="text-sm text-muted-foreground" aria-live="polite">
        {t("common.resultsCount", { count: total })}
      </p>

      {visible.length === 0 ? (
        <EmptyState
          title={t("common.noResults")}
          description={t("common.noResultsHint")}
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((item) => {
            const isMedia =
              item.contentType !== "article" && (item.embedUrl || item.mediaUrl);
            return (
              <ContentCard
                key={item.id}
                title={item.title}
                href={`/dvar-torah/${item.slug}`}
                excerpt={item.excerpt}
                placeholderIcon={BookOpen}
                badges={(
                  [
                    { label: `${t("dvarTorah.parasha")} ${item.parasha}`, tone: "gold" },
                    { label: item.bookLabel, tone: "navy" },
                  ] satisfies CardBadge[]
                ).filter((b) => b.label)}
                metas={[
                  { icon: CalendarDays, label: item.publishedLabel },
                ]}
                action={
                  isMedia
                    ? {
                        label: t("common.watch"),
                        icon: Play,
                        variant: "gold",
                        media: {
                          embedUrl: item.embedUrl,
                          audioUrl: null,
                          title: item.title,
                        },
                      }
                    : {
                        label: t("common.readMore"),
                        href: `/dvar-torah/${item.slug}`,
                        icon: BookOpen,
                        variant: "navy",
                      }
                }
                secondaryAction={
                  isMedia
                    ? { label: t("common.readMore"), href: `/dvar-torah/${item.slug}` }
                    : undefined
                }
              />
            );
          })}
        </div>
      )}

      <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />
    </div>
  );
}
