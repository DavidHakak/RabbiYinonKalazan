import { Mail, MapPin, Phone } from "lucide-react";
import { useTranslations } from "next-intl";

import { Logo } from "@/components/brand/logo";
import { footerNavKeys, navByKey } from "@/config/navigation";
import { siteConfig, socialLinks } from "@/config/site";
import { Link } from "@/i18n/navigation";

/** Public site footer: brand, contact channels, key links and socials. */
export function SiteFooter() {
  const t = useTranslations();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-navy-950 text-cream-100/80">
      <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Brand */}
          <div className="space-y-4">
            <Logo name={t("site.name")} tagline={t("site.tagline")} tone="light" />
          </div>

          {/* Links */}
          <nav aria-label={t("footer.linksTitle")} className="space-y-4">
            <h2 className="font-serif text-lg font-semibold text-gold-500">
              {t("footer.linksTitle")}
            </h2>
            <ul className="space-y-2.5 text-sm">
              {footerNavKeys.map((key) => (
                <li key={key}>
                  <Link
                    href={navByKey[key].href}
                    className="transition-colors hover:text-gold-400"
                  >
                    {t(`nav.${key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div className="space-y-4">
            <h2 className="font-serif text-lg font-semibold text-gold-500">
              {t("footer.contactTitle")}
            </h2>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href={siteConfig.contact.phoneHref}
                  className="flex items-center gap-3 transition-colors hover:text-gold-400"
                  dir="ltr"
                >
                  <Phone className="size-4 shrink-0 text-gold-500" />
                  <span>{siteConfig.contact.phone}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="flex items-center gap-3 transition-colors hover:text-gold-400"
                >
                  <Mail className="size-4 shrink-0 text-gold-500" />
                  <span>{siteConfig.contact.email}</span>
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="size-4 shrink-0 text-gold-500" />
                <span>{t("footer.location")}</span>
              </li>
            </ul>

            {socialLinks.length > 0 ? (
              <div className="flex items-center gap-3 pt-2">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.key}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="flex size-9 items-center justify-center rounded-full border border-navy-700 text-cream-100/80 transition-colors hover:border-gold-500 hover:text-gold-400"
                    >
                      <Icon className="size-4" />
                    </a>
                  );
                })}
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-12 border-t border-navy-700/70 pt-6 text-center text-xs text-cream-100/60">
          © {year} {t("footer.rights")} — {t("site.name")}
        </div>
      </div>
    </footer>
  );
}
