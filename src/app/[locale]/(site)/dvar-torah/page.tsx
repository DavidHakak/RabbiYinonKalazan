import { BookOpen, CalendarDays } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { ContentCard } from "@/components/common/content-card";
import { EmptyState } from "@/components/common/empty-state";
import { Hero } from "@/components/common/hero";
import { Section } from "@/components/layout/section";
import type { Locale } from "@/i18n/config";
import { formatDate } from "@/lib/format";
import { localize } from "@/lib/localized";
import { getDivreiTorah } from "@/repositories/divrei-torah";

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

  return (
    <>
      <Hero size="sm" title={t("dvarTorah.title")} subtitle={t("dvarTorah.subtitle")} />
      <Section size="lg">
        {items.length === 0 ? (
          <EmptyState title={t("dvarTorah.empty")} />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <ContentCard
                key={item.id}
                title={localize(item.title, locale)}
                href={`/dvar-torah/${item.slug}`}
                excerpt={localize(item.excerpt, locale)}
                placeholderIcon={BookOpen}
                badges={[
                  {
                    label: `${t("dvarTorah.parasha")} ${localize(item.parasha, locale)}`,
                    tone: "gold",
                  },
                ]}
                metas={[
                  { icon: CalendarDays, label: formatDate(item.publishedAt, locale) },
                ]}
                action={{
                  label: t("common.readMore"),
                  href: `/dvar-torah/${item.slug}`,
                  icon: BookOpen,
                  variant: "navy",
                }}
              />
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
