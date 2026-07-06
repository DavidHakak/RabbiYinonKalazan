import Image from "next/image";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { use } from "react";

import { Hero } from "@/components/common/hero";
import { HighlightCard } from "@/components/common/highlight-card";
import { Quote } from "@/components/common/quote";
import { SectionHeading } from "@/components/common/section-heading";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { homeHighlightKeys, navByKey } from "@/config/navigation";
import { Link } from "@/i18n/navigation";

export default function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations();

  return (
    <>
      <Hero
        title={t("site.name")}
        subtitle={t("site.tagline")}
        image={{ src: "/images/rabbi.png", alt: t("site.name"), priority: true }}
        actions={
          <>
            <Button asChild variant="gold" size="lg">
              <Link href={navByKey.support.href}>{t("home.hero.ctaSupport")}</Link>
            </Button>
            <Button asChild variant="navy" size="lg">
              <Link href={navByKey.contact.href}>{t("home.hero.ctaContact")}</Link>
            </Button>
          </>
        }
      />

      {/* The Jewish bookshelf */}
      <Section tone="parchment" size="lg">
        <SectionHeading
          title={t("home.sections.aronTitle")}
          subtitle={t("home.sections.aronSubtitle")}
          className="mb-12"
        />
        <figure className="mx-auto w-full max-w-4xl">
          <div className="relative aspect-1800/456 w-full overflow-hidden rounded-2xl shadow-2xl ring-1 ring-gold-500/25">
            <Image
              src="/images/sefarim-shelf.jpg"
              alt={t("home.sections.aronAlt")}
              fill
              sizes="(max-width: 768px) 92vw, 56rem"
              className="object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-navy-950/40 via-transparent to-navy-950/10" />
            <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-navy-950/10" />
          </div>
          <figcaption className="mt-3 text-center text-xs text-muted-foreground/70">
            {t("home.sections.aronCredit")}
          </figcaption>
        </figure>
      </Section>

      {/* Highlights */}
      <Section tone="default" size="lg">
        <SectionHeading
          title={t("home.sections.highlightsTitle")}
          subtitle={t("home.sections.highlightsSubtitle")}
          className="mb-12"
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {homeHighlightKeys.map((key) => {
            const item = navByKey[key];
            return (
              <HighlightCard
                key={key}
                href={item.href}
                icon={item.icon}
                title={t(`home.cards.${key}Title`)}
                description={t(`home.cards.${key}Text`)}
              />
            );
          })}
        </div>
      </Section>

      {/* Quote */}
      <Section tone="parchment" size="md">
        <Quote>{t("home.quote")}</Quote>
      </Section>
    </>
  );
}
