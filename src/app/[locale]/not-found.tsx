import { useTranslations } from "next-intl";

import { BrandLogo } from "@/components/brand/brand-logo";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export default function LocaleNotFound() {
  const t = useTranslations("notFound");

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 bg-parchment px-6 text-center">
      <BrandLogo size={72} className="size-18" />
      <p className="font-serif text-6xl font-bold text-navy-900">404</p>
      <h1 className="font-serif text-2xl font-bold text-navy-900">{t("title")}</h1>
      <p className="max-w-md text-muted-foreground">{t("text")}</p>
      <Button asChild variant="gold" size="lg">
        <Link href="/">{t("cta")}</Link>
      </Button>
    </div>
  );
}
