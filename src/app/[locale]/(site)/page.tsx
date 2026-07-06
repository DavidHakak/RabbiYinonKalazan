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
