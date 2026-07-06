import { CalendarDays, ChevronRight, Clock, Layers } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { Ornament } from "@/components/common/ornament";
import { Prose } from "@/components/common/prose";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/i18n/config";
import { Link } from "@/i18n/navigation";
import { formatDate } from "@/lib/format";
import { localize } from "@/lib/localized";
import { getYouTubeEmbedUrl } from "@/lib/media";
import { getLectureBySlug, getLectures } from "@/repositories/lectures";

export async function generateStaticParams() {
  const lectures = await getLectures();
  return lectures.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const lecture = await getLectureBySlug(slug);
  if (!lecture) return {};
  return {
    title: localize(lecture.title, locale),
    description: localize(lecture.description, locale),
  };
}

export default async function LectureDetailPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const lecture = await getLectureBySlug(slug);
  if (!lecture) notFound();

  const title = localize(lecture.title, locale);
  const embedUrl = getYouTubeEmbedUrl(lecture.mediaUrl);

  const metas = [
    localize(lecture.series, locale)
      ? { icon: Layers, label: `${t("lectures.inSeries")}: ${localize(lecture.series, locale)}` }
      : null,
    lecture.durationMinutes
      ? { icon: Clock, label: `${lecture.durationMinutes} ${t("common.minutes")}` }
      : null,
    { icon: CalendarDays, label: formatDate(lecture.publishedAt, locale) },
  ].filter((m): m is { icon: typeof Clock; label: string } => m !== null);

  return (
    <>
      <Section tone="parchment" size="sm">
        <div className="mx-auto max-w-3xl space-y-5 text-center">
          <div className="flex flex-wrap justify-center gap-2">
            {localize(lecture.topic, locale) ? (
              <span className="rounded-full bg-gold-100 px-3 py-1 text-xs font-medium text-gold-800 ring-1 ring-inset ring-gold-500/20">
                {localize(lecture.topic, locale)}
              </span>
            ) : null}
            <span className="rounded-full bg-navy-100 px-3 py-1 text-xs font-medium text-navy-800 ring-1 ring-inset ring-navy-500/20">
              {t(`lectures.contentTypes.${lecture.contentType}`)}
            </span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-navy-900 md:text-4xl">
            {title}
          </h1>
          <Ornament className="justify-center" />
          <ul className="flex flex-wrap justify-center gap-x-5 gap-y-1 text-sm text-muted-foreground">
            {metas.map((m, i) => {
              const Icon = m.icon;
              return (
                <li key={i} className="flex items-center gap-1.5">
                  <Icon className="size-4 text-gold-600" />
                  {m.label}
                </li>
              );
            })}
          </ul>
        </div>
      </Section>

      <Section size="lg">
        <Container className="max-w-3xl space-y-8 px-0">
          {embedUrl ? (
            <div className="aspect-video overflow-hidden rounded-2xl shadow-lg ring-1 ring-gold-500/20">
              <iframe
                src={embedUrl}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          ) : lecture.contentType === "audio" && lecture.mediaUrl ? (
            <audio controls src={lecture.mediaUrl} className="w-full">
              <track kind="captions" />
            </audio>
          ) : null}

          <Prose content={localize(lecture.description, locale)} />

          <div className="pt-4">
            <Button asChild variant="ghost" className="text-gold-700 hover:text-gold-800">
              <Link href="/lectures">
                <ChevronRight className="size-4 flip-rtl" />
                {t("lectures.title")}
              </Link>
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
