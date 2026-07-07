import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { EmptyState } from "@/components/common/empty-state";
import { Hero } from "@/components/common/hero";
import {
  DvarTorahBrowser,
  type DvarTorahView,
} from "@/components/lectures/dvar-torah-browser";
import { Section } from "@/components/layout/section";
import type { Locale } from "@/i18n/config";
import { formatDate } from "@/lib/format";
import { localize } from "@/lib/localized";
import { getYouTubeEmbedUrl } from "@/lib/media";
import { CHUMASHIM, parashaOrder, resolveBook } from "@/lib/youtube/parashot";
import { getDivreiTorah } from "@/repositories/divrei-torah";

// Refresh hourly so divrei-torah added by the daily YouTube sync appear on their own.
export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "dvarTorah" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function DvarTorahPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const items = await getDivreiTorah();

  const bookIndex = new Map(CHUMASHIM.map((c, i) => [c.slug, i]));

  const views: DvarTorahView[] = items.map((item) => {
    const parashaHe = localize(item.parasha, "he");
    const book = resolveBook(item.parashaSlug, parashaHe);
    return {
      id: item.id,
      slug: item.slug,
      title: localize(item.title, locale),
      excerpt: localize(item.excerpt, locale),
      parasha: localize(item.parasha, locale),
      bookLabel: book ? localize({ he: book.he, en: book.en }, locale) : "",
      bookOrder: book ? (bookIndex.get(book.slug) ?? 99) : 99,
      parashaOrder: parashaOrder(item.parashaSlug, parashaHe),
      contentType: item.contentType,
      durationLabel: item.durationMinutes
        ? `${item.durationMinutes} ${t("common.minutes")}`
        : "",
      publishedLabel: formatDate(item.publishedAt, locale),
      publishedAt: item.publishedAt.toISOString(),
      mediaUrl: item.mediaUrl,
      embedUrl: getYouTubeEmbedUrl(item.mediaUrl),
    };
  });

  return (
    <>
      <Hero
        size="sm"
        title={t("dvarTorah.title")}
        subtitle={t("dvarTorah.subtitle")}
      />
      <Section size="lg">
        {views.length === 0 ? (
          <EmptyState title={t("dvarTorah.empty")} />
        ) : (
          <DvarTorahBrowser items={views} />
        )}
      </Section>
    </>
  );
}
