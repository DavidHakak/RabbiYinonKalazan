import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";

import { BrandMark } from "@/components/brand/brand-mark";
import { LoginForm } from "@/components/admin/login-form";
import type { Locale } from "@/i18n/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AdminLoginPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  // Already signed in → go straight to the dashboard.
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect(`/${locale}/admin`);

  return (
    <div className="flex min-h-dvh items-center justify-center bg-navy-950 px-4">
      <div className="w-full max-w-sm space-y-8 rounded-2xl border border-navy-700 bg-navy-900 p-8 shadow-2xl">
        <div className="flex flex-col items-center gap-3 text-center">
          <BrandMark className="size-12 text-gold-500" />
          <h1 className="font-serif text-xl font-bold text-cream-100">
            {t("site.name")}
          </h1>
          <p className="text-sm text-cream-100/60">{t("admin.title")}</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
