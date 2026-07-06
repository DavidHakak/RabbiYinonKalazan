import { Mail, MapPin, Phone } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { ContactForm } from "@/components/contact/contact-form";
import { Hero } from "@/components/common/hero";
import { Section } from "@/components/layout/section";
import { siteConfig, socialLinks } from "@/config/site";
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

  const details = [
    {
      icon: Phone,
      label: t("contact.details.phone"),
      value: siteConfig.contact.phone,
      href: siteConfig.contact.phoneHref,
      ltr: true,
    },
    {
      icon: Mail,
      label: t("contact.details.email"),
      value: siteConfig.contact.email,
      href: `mailto:${siteConfig.contact.email}`,
      ltr: true,
    },
    {
      icon: MapPin,
      label: t("contact.details.location"),
      value: t("footer.location"),
      href: undefined,
      ltr: false,
    },
  ];

  return (
    <>
      <Hero size="sm" title={t("contact.title")} subtitle={t("contact.subtitle")} />

      <Section size="lg">
        <div className="grid gap-10 lg:grid-cols-[1fr_20rem]">
          <ContactForm />

          <aside className="space-y-6">
            <h2 className="font-serif text-xl font-bold text-navy-900">
              {t("contact.details.title")}
            </h2>
            <ul className="space-y-4">
              {details.map((d) => {
                const Icon = d.icon;
                const content = (
                  <span className="flex items-start gap-3">
                    <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-gold-100 text-gold-700 ring-1 ring-gold-500/20">
                      <Icon className="size-4" />
                    </span>
                    <span className="flex flex-col">
                      <span className="text-xs text-muted-foreground">{d.label}</span>
                      <span
                        className="font-medium text-navy-900"
                        dir={d.ltr ? "ltr" : undefined}
                      >
                        {d.value}
                      </span>
                    </span>
                  </span>
                );
                return (
                  <li key={d.label}>
                    {d.href ? (
                      <a href={d.href} className="block transition-opacity hover:opacity-80">
                        {content}
                      </a>
                    ) : (
                      content
                    )}
                  </li>
                );
              })}
            </ul>

            {socialLinks.length > 0 ? (
              <div className="flex gap-3 pt-2">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.key}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="flex size-10 items-center justify-center rounded-full bg-navy-900 text-cream-100 transition-colors hover:bg-gold-500 hover:text-navy-950"
                    >
                      <Icon className="size-4" />
                    </a>
                  );
                })}
              </div>
            ) : null}
          </aside>
        </div>
      </Section>
    </>
  );
}
