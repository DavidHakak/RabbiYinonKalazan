import { CalendarDays } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { BackButton } from "@/components/common/back-button";
import { Ornament } from "@/components/common/ornament";
import { Prose } from "@/components/common/prose";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import type { Locale } from "@/i18n/config";
import { formatDate } from "@/lib/format";
import { localize } from "@/lib/localized";
import { getYouTubeEmbedUrl } from "@/lib/media";
import { getDvarTorahBySlug } from "@/repositories/divrei-torah";

// Rendered on demand + cached (ISR) so daily-synced divrei-torah appear without
// a rebuild. See the lectures detail page for the rationale.
export const revalidate = 3600;

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const item = await getDvarTorahBySlug(slug);
  if (!item) return {};
  return {
    title: localize(item.title, locale),
    description: localize(item.excerpt, locale),
  };
}

export default async function DvarTorahDetailPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const item = await getDvarTorahBySlug(slug);
  if (!item) notFound();

  const embedUrl = getYouTubeEmbedUrl(item.mediaUrl);

  return (
    <>
      <Section tone="parchment" size="sm">
        <div className="mx-auto max-w-3xl space-y-4 text-center">
          <span className="inline-flex rounded-full bg-gold-100 px-3 py-1 text-xs font-medium text-gold-800 ring-1 ring-inset ring-gold-500/20">
            {`${t("dvarTorah.parasha")} ${localize(item.parasha, locale)}`}
          </span>
          <h1 className="font-serif text-3xl font-bold text-navy-900 md:text-4xl">
            {localize(item.title, locale)}
          </h1>
          <Ornament className="justify-center" />
          <p className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
            <CalendarDays className="size-4 text-gold-600" />
            {formatDate(item.publishedAt, locale)}
          </p>
        </div>
      </Section>

      <Section size="lg">
        <Container className="max-w-3xl space-y-8 px-0">
          {embedUrl ? (
            <div className="aspect-video overflow-hidden rounded-2xl shadow-lg ring-1 ring-gold-500/20">
              <iframe
                src={embedUrl}
                title={localize(item.title, locale)}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          ) : null}

          <Prose content={localize(item.body, locale)} />
          <div className="pt-2">
            <BackButton fallbackHref="/dvar-torah" label={t("dvarTorah.title")} />
          </div>
        </Container>
      </Section>
    </>
  );
}
