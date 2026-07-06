import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";

import { BrandLogo } from "@/components/brand/brand-logo";
import { LoginForm } from "@/components/admin/login-form";
import type { Locale } from "@/i18n/config";
import { getSessionUser, isAdminUser } from "@/lib/auth";

export default async function AdminLoginPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  // Already signed in as an admin → go straight to the dashboard.
  const user = await getSessionUser();
  if (user && (await isAdminUser(user))) redirect(`/${locale}/admin`);

  return (
    <div className="flex min-h-dvh items-center justify-center bg-navy-950 px-4 py-10">
      <div className="w-full max-w-sm space-y-8 rounded-2xl border border-gold-500/25 bg-card p-8 shadow-2xl">
        <div className="flex flex-col items-center gap-3 text-center">
          <BrandLogo size={48} className="size-12" />
          <h1 className="font-serif text-xl font-bold text-navy-900">
            {t("site.name")}
          </h1>
          <p className="text-sm text-muted-foreground">{t("admin.title")}</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
