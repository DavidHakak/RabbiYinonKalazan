import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Hero } from "@/components/common/hero";
import { Section } from "@/components/layout/section";
import {
  LecturesBrowser,
  type LectureView,
} from "@/components/lectures/lectures-browser";
import type { Locale } from "@/i18n/config";
import { formatDate } from "@/lib/format";
import { localize } from "@/lib/localized";
import { getLectures } from "@/repositories/lectures";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "lectures" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function LecturesPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const lectures = await getLectures();

  const views: LectureView[] = lectures.map((l) => ({
    id: l.id,
    slug: l.slug,
    title: localize(l.title, locale),
    description: localize(l.description, locale),
    topic: localize(l.topic, locale),
    series: localize(l.series, locale),
    contentType: l.contentType,
    typeLabel: t(`lectures.contentTypes.${l.contentType}`),
    durationLabel: l.durationMinutes
      ? `${l.durationMinutes} ${t("common.minutes")}`
      : "",
    publishedLabel: formatDate(l.publishedAt, locale),
    mediaUrl: l.mediaUrl,
  }));

  return (
    <>
      <Hero
        size="sm"
        title={t("lectures.title")}
        subtitle={t("lectures.subtitle")}
        image={{ src: "/images/rabbi.png", alt: t("site.name") }}
      />
      <Section size="lg">
        <LecturesBrowser lectures={views} />
      </Section>
    </>
  );
}
