import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { use } from "react";

import { Quote } from "@/components/common/quote";
import { SectionHeading } from "@/components/common/section-heading";
import { Hero } from "@/components/common/hero";
import { Section } from "@/components/layout/section";
import { DonationMethods } from "@/components/support/donation-methods";
import type { Locale } from "@/i18n/config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "support" });
  return { title: t("heading"), description: t("lead") };
}

export default function SupportPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations("support");
  const paragraphs = t.raw("body") as string[];

  return (
    <>
      <Hero size="sm" title={t("heading")} subtitle={t("lead")} />

      {/* The teaching: featured verse + article */}
      <Section tone="default" size="lg">
        <Quote>{t("verse")}</Quote>
        <p className="mt-3 text-center text-sm text-muted-foreground">
          {t("verseRef")}
        </p>

        <div className="mx-auto mt-14 max-w-3xl space-y-6 text-lg leading-loose text-foreground/90">
          {paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </Section>

      {/* Ways to give */}
      <Section tone="parchment" size="lg">
        <SectionHeading
          title={t("give.title")}
          subtitle={t("give.subtitle")}
          className="mb-12"
        />
        <DonationMethods />
      </Section>
    </>
  );
}
