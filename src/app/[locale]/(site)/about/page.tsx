import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Hero } from "@/components/common/hero";
import { Ornament } from "@/components/common/ornament";
import { Prose } from "@/components/common/prose";
import { Quote } from "@/components/common/quote";
import { Section } from "@/components/layout/section";
import type { Locale } from "@/i18n/config";
import { localize } from "@/lib/localized";
import { getContentBlock } from "@/repositories/site-content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return { title: t("title") };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const [bio, vision] = await Promise.all([
    getContentBlock("about-bio"),
    getContentBlock("about-vision"),
  ]);

  return (
    <>
      <Hero
        size="sm"
        title={t("about.title")}
        subtitle={t("about.subtitle")}
      />

      <Section size="lg">
        <div className="mx-auto max-w-3xl space-y-6">
          <h2 className="font-serif text-2xl font-bold text-navy-900 md:text-3xl">
            {bio ? localize(bio.title, locale) : t("about.bioTitle")}
          </h2>
          <Ornament width="sm" />
          <Prose content={bio ? localize(bio.body, locale) : t("about.bioPlaceholder")} />
        </div>
      </Section>

      <Section tone="parchment" size="md">
        <Quote>{vision ? localize(vision.body, locale) : t("about.visionPlaceholder")}</Quote>
      </Section>
    </>
  );
}
