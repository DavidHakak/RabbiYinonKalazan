import { CalendarDays, ChevronRight } from "lucide-react";
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
import { getDivreiTorah, getDvarTorahBySlug } from "@/repositories/divrei-torah";

export async function generateStaticParams() {
  const items = await getDivreiTorah();
  return items.map((d) => ({ slug: d.slug }));
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
          <Prose content={localize(item.body, locale)} />
          <div className="pt-2">
            <Button asChild variant="ghost" className="text-gold-700 hover:text-gold-800">
              <Link href="/dvar-torah">
                <ChevronRight className="size-4 flip-rtl" />
                {t("dvarTorah.title")}
              </Link>
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
