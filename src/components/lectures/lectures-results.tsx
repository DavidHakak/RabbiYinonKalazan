import { BookOpen, CalendarDays, Clock, Headphones, Layers, Play } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { CardGridSkeleton } from "@/components/common/card-grid-skeleton";
import { ContentCard, type CardBadge } from "@/components/common/content-card";
import { EmptyState } from "@/components/common/empty-state";
import { ListPagination } from "@/components/common/list-pagination";
import type { ContentType } from "@/db/schema";
import type { Locale } from "@/i18n/config";
import { formatDate } from "@/lib/format";
import type { LectureQuery } from "@/lib/lectures-query";
import { localize } from "@/lib/localized";
import { getYouTubeEmbedUrl } from "@/lib/media";
import { getLecturesPage } from "@/repositories/lectures";

const typeIcon: Record<ContentType, typeof Play> = {
  video: Play,
  audio: Headphones,
  article: BookOpen,
};

export { CardGridSkeleton as LecturesResultsFallback };

/**
 * Async server component: fetches exactly one page of lectures for the current
 * filters and renders it. Wrapped in <Suspense> by the page, so switching page
 * or filter shows a skeleton while only the next page is fetched — never the
 * whole table.
 */
export async function LecturesResults({
  query,
  locale,
}: {
  query: LectureQuery;
  locale: Locale;
}) {
  const t = await getTranslations();
  const { items, total, page, pageCount } = await getLecturesPage(query);

  if (items.length === 0) {
    return (
      <EmptyState
        title={t("common.noResults")}
        description={t("common.noResultsHint")}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-muted-foreground">
        {t("common.resultsCount", { count: total })}
      </p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((lecture) => {
          const title = localize(lecture.title, locale);
          const embedUrl = getYouTubeEmbedUrl(lecture.mediaUrl);
          const isMedia =
            lecture.contentType !== "article" &&
            (embedUrl || lecture.mediaUrl);
          const topic = localize(lecture.topic, locale);
          const series = localize(lecture.series, locale);

          return (
            <ContentCard
              key={lecture.id}
              title={title}
              href={`/lectures/${lecture.slug}`}
              excerpt={localize(lecture.description, locale)}
              placeholderIcon={typeIcon[lecture.contentType]}
              badges={(
                [
                  { label: topic, tone: "gold" },
                  {
                    label: t(`lectures.contentTypes.${lecture.contentType}`),
                    tone: "navy",
                  },
                ] satisfies CardBadge[]
              ).filter((b) => b.label)}
              metas={[
                series
                  ? { icon: Layers, label: `${t("lectures.inSeries")}: ${series}` }
                  : null,
                lecture.durationMinutes
                  ? { icon: Clock, label: `${lecture.durationMinutes} ${t("common.minutes")}` }
                  : null,
                { icon: CalendarDays, label: formatDate(lecture.publishedAt, locale) },
              ].filter((m): m is { icon: typeof Clock; label: string } => m !== null)}
              action={
                isMedia
                  ? {
                      label:
                        lecture.contentType === "audio"
                          ? t("common.listen")
                          : t("common.watch"),
                      icon: typeIcon[lecture.contentType],
                      variant: "gold",
                      media: {
                        embedUrl,
                        audioUrl:
                          lecture.contentType === "audio" ? lecture.mediaUrl : null,
                        title,
                      },
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

      <ListPagination page={page} pageCount={pageCount} />
    </div>
  );
}
