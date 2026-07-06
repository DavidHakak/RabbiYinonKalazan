"use client";

import { BookOpen, CalendarDays, Clock, Headphones, Layers, Play } from "lucide-react";
import { useTranslations } from "next-intl";

import { ContentCard, type CardBadge } from "@/components/common/content-card";
import { EmptyState } from "@/components/common/empty-state";
import { FilterBar } from "@/components/common/filter-bar";
import { Pagination } from "@/components/common/pagination";
import { useFilteredContent } from "@/hooks/use-filtered-content";
import type { ContentType } from "@/db/schema";

/** Serializable, already-localized lecture shape passed from the server page. */
export interface LectureView {
  id: string;
  slug: string;
  title: string;
  description: string;
  topic: string;
  series: string;
  contentType: ContentType;
  typeLabel: string;
  durationLabel: string;
  publishedLabel: string;
  mediaUrl: string | null;
}

const typeIcon: Record<ContentType, typeof Play> = {
  video: Play,
  audio: Headphones,
  article: BookOpen,
};

export function LecturesBrowser({ lectures }: { lectures: LectureView[] }) {
  const t = useTranslations();
  const {
    query,
    search,
    selected,
    setFacet,
    facetOptions,
    page,
    setPage,
    pageCount,
    visible,
    isFiltered,
    reset,
    ALL,
  } = useFilteredContent(lectures, {
    searchAccessor: (l) => `${l.title} ${l.description} ${l.topic} ${l.series}`,
    facets: [
      { key: "topic", accessor: (l) => l.topic },
      { key: "series", accessor: (l) => l.series },
      { key: "type", accessor: (l) => l.typeLabel },
    ],
    pageSize: 9,
  });

  const facetLabels: Record<string, string> = {
    topic: t("lectures.filters.topic"),
    series: t("lectures.filters.series"),
    type: t("lectures.filters.contentType"),
  };

  return (
    <div className="flex flex-col gap-8">
      <FilterBar
        searchValue={query}
        onSearch={search}
        searchPlaceholder={t("lectures.searchPlaceholder")}
        allLabel={t("common.all")}
        allValue={ALL}
        isFiltered={isFiltered}
        onReset={reset}
        clearLabel={t("common.clearFilters")}
        facets={facetOptions.map((facet) => ({
          key: facet.key,
          label: facetLabels[facet.key],
          value: selected[facet.key] ?? ALL,
          options: facet.values,
          onChange: (value) => setFacet(facet.key, value),
        }))}
      />

      {visible.length === 0 ? (
        <EmptyState
          title={t("common.noResults")}
          description={t("common.noResultsHint")}
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((lecture) => {
            const isMedia = lecture.contentType !== "article" && lecture.mediaUrl;
            return (
              <ContentCard
                key={lecture.id}
                title={lecture.title}
                href={`/lectures/${lecture.slug}`}
                excerpt={lecture.description}
                placeholderIcon={typeIcon[lecture.contentType]}
                badges={(
                  [
                    { label: lecture.topic, tone: "gold" },
                    { label: lecture.typeLabel, tone: "navy" },
                  ] satisfies CardBadge[]
                ).filter((b) => b.label)}
                metas={[
                  lecture.series
                    ? { icon: Layers, label: `${t("lectures.inSeries")}: ${lecture.series}` }
                    : null,
                  lecture.durationLabel
                    ? { icon: Clock, label: lecture.durationLabel }
                    : null,
                  { icon: CalendarDays, label: lecture.publishedLabel },
                ].filter((m): m is { icon: typeof Clock; label: string } => m !== null)}
                action={
                  isMedia
                    ? {
                        label:
                          lecture.contentType === "audio"
                            ? t("common.listen")
                            : t("common.watch"),
                        href: lecture.mediaUrl!,
                        icon: typeIcon[lecture.contentType],
                        variant: "gold",
                        external: true,
                      }
                    : {
                        label: t("common.readMore"),
                        href: `/lectures/${lecture.slug}`,
                        icon: BookOpen,
                        variant: "navy",
                      }
                }
                secondaryAction={
                  isMedia
                    ? { label: t("common.readMore"), href: `/lectures/${lecture.slug}` }
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
