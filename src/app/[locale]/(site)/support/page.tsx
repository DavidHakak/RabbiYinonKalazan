import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { use } from "react";

import { Quote } from "@/components/common/quote";
import { Hero } from "@/components/common/hero";
import { Ornament } from "@/components/common/ornament";
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
  return { title: t("heading") };
}

export default function SupportPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations("support");
  const body = t.raw("body") as string[];
  const body2 = t.raw("body2") as string[];

  return (
    <>
      <Hero size="sm" eyebrow={t("bsd")} title={t("heading")} />

      {/* The article — rendered exactly in the order it was written */}
      <Section tone="default" size="lg">
        <div className="mx-auto max-w-3xl space-y-6 text-lg leading-loose text-foreground/90">
          {body.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}

          {/* "As the sages explained in the verse:" + the verse */}
          <p className="pt-2">{t("sagesIntro")}</p>
        </div>

        <div className="my-8">
          <Quote>{t("verse")}</Quote>
        </div>

        <div className="mx-auto max-w-3xl space-y-6 text-lg leading-loose text-foreground/90">
          {body2.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </Section>

      {/* Ways to give */}
      <Section tone="parchment" size="lg">
        <div className="mb-12 flex justify-center">
          <Ornament width="lg" />
        </div>
        <DonationMethods />
      </Section>
    </>
  );
}
