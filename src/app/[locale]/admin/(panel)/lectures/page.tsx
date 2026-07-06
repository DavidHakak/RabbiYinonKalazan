import { Pencil, Plus } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { DeleteLectureButton } from "@/components/admin/delete-lecture-button";
import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Locale } from "@/i18n/config";
import { Link } from "@/i18n/navigation";
import { formatDate } from "@/lib/format";
import { localize } from "@/lib/localized";
import { getAllLecturesAdmin } from "@/repositories/lectures";

export default async function AdminLecturesPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const lectures = await getAllLecturesAdmin();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-serif text-2xl font-bold text-navy-900">
          {t("nav.lectures")}
        </h1>
        <Button asChild variant="gold">
          <Link href="/admin/lectures/new">
            <Plus className="size-4" />
            {t("admin.newLecture")}
          </Link>
        </Button>
      </div>

      {lectures.length === 0 ? (
        <EmptyState title={t("admin.empty")} />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/40 text-start">
              <tr className="text-start text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3 text-start font-medium">{t("admin.fields.title")}</th>
                <th className="px-4 py-3 text-start font-medium">{t("admin.fields.contentType")}</th>
                <th className="hidden px-4 py-3 text-start font-medium sm:table-cell">
                  {t("admin.fields.publishedAt")}
                </th>
                <th className="px-4 py-3 text-start font-medium">{t("admin.fields.published")}</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {lectures.map((lecture) => (
                <tr key={lecture.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium text-navy-900">
                    <Link
                      href={`/admin/lectures/${lecture.id}`}
                      className="hover:text-gold-700"
                    >
                      {localize(lecture.title, locale) || lecture.slug}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {t(`lectures.contentTypes.${lecture.contentType}`)}
                  </td>
                  <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">
                    {formatDate(lecture.publishedAt, locale)}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={lecture.published ? "default" : "secondary"}>
                      {lecture.published ? "✓" : "—"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button asChild variant="ghost" size="icon-sm">
                        <Link href={`/admin/lectures/${lecture.id}`} aria-label={t("admin.edit")}>
                          <Pencil className="size-4" />
                        </Link>
                      </Button>
                      <DeleteLectureButton id={lecture.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
