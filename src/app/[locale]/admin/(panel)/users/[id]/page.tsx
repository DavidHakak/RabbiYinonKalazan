import { ChevronRight } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { UserForm } from "@/components/admin/user-form";
import type { Locale } from "@/i18n/config";
import { Link } from "@/i18n/navigation";
import { getProfileById } from "@/repositories/profiles";

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ locale: Locale; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin");
  const profile = await getProfileById(id);
  if (!profile) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/users"
          className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-gold-700"
        >
          <ChevronRight className="size-4 flip-rtl" />
          {t("backToList")}
        </Link>
        <h1 className="font-serif text-2xl font-bold text-navy-900">
          {t("users.edit")}
        </h1>
      </div>
      <UserForm profile={profile} />
    </div>
  );
}
