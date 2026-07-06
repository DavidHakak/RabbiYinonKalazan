import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { ContactForm } from "@/components/contact/contact-form";
import { Hero } from "@/components/common/hero";
import { Section } from "@/components/layout/section";
import { socialLinks } from "@/config/site";
import type { Locale } from "@/i18n/config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <>
      <Hero size="sm" title={t("contact.title")} subtitle={t("contact.subtitle")} />

      <Section size="lg">
        <div className="mx-auto max-w-2xl space-y-8">
          <p className="text-center text-base leading-relaxed text-muted-foreground">
            {t("contact.intro")}
          </p>

          <ContactForm />

          {socialLinks.length > 0 ? (
            <div className="flex flex-col items-center gap-4 border-t border-gold-500/15 pt-8">
              <h2 className="font-serif text-lg font-bold text-navy-900">
                {t("contact.social")}
              </h2>
              <div className="flex gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.key}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="flex size-11 items-center justify-center rounded-full bg-navy-900 text-cream-100 transition-colors hover:bg-gold-500 hover:text-navy-950"
                    >
                      <Icon className="size-5" />
                    </a>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
      </Section>
    </>
  );
}
