import { ChevronRight } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { LectureForm } from "@/components/admin/lecture-form";
import type { Locale } from "@/i18n/config";
import { Link } from "@/i18n/navigation";
import { getLectureById } from "@/repositories/lectures";

export default async function EditLecturePage({
  params,
}: {
  params: Promise<{ locale: Locale; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin");
  const lecture = await getLectureById(id);
  if (!lecture) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/lectures"
          className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-gold-700"
        >
          <ChevronRight className="size-4 flip-rtl" />
          {t("backToList")}
        </Link>
        <h1 className="font-serif text-2xl font-bold text-navy-900">
          {t("editLecture")}
        </h1>
      </div>
      <LectureForm lecture={lecture} />
    </div>
  );
}
