import { getTranslations, setRequestLocale } from "next-intl/server";

import { RegisterForm } from "@/components/admin/register-form";
import { BrandLogo } from "@/components/brand/brand-logo";
import type { Locale } from "@/i18n/config";

/**
 * Public self-registration — intentionally unlinked (no nav points here).
 * Accounts created here are regular users (role `user`) with NO admin access;
 * admin entry is gated separately by `isAdminUser`.
 */
export default async function RegisterPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <div className="flex min-h-dvh items-center justify-center bg-navy-950 px-4 py-10">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-gold-500/25 bg-card p-8 shadow-2xl">
        <div className="flex flex-col items-center gap-3 text-center">
          <BrandLogo size={48} className="size-12" />
          <h1 className="font-serif text-xl font-bold text-navy-900">
            {t("admin.register.title")}
          </h1>
          <p className="text-sm text-muted-foreground">{t("admin.register.subtitle")}</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
