import { ChevronRight } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { DvarTorahForm } from "@/components/admin/dvar-torah-form";
import type { Locale } from "@/i18n/config";
import { Link } from "@/i18n/navigation";
import { getDvarTorahById } from "@/repositories/divrei-torah";

export default async function EditDvarTorahPage({
  params,
}: {
  params: Promise<{ locale: Locale; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const dvarTorah = await getDvarTorahById(id);
  if (!dvarTorah) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/dvar-torah"
          className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-gold-700"
        >
          <ChevronRight className="size-4 flip-rtl" />
          {t("admin.backToList")}
        </Link>
        <h1 className="font-serif text-2xl font-bold text-navy-900">
          {t("admin.dvarTorah.edit")}
        </h1>
      </div>
      <DvarTorahForm dvarTorah={dvarTorah} />
    </div>
  );
}
