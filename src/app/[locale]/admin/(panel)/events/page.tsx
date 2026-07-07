import { CalendarDays, Pencil, Plus } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { DeleteButton } from "@/components/admin/delete-button";
import { EmptyState } from "@/components/common/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/i18n/config";
import { Link } from "@/i18n/navigation";
import { formatDateTime } from "@/lib/format";
import { localize } from "@/lib/localized";
import { getAllEventsAdmin } from "@/repositories/events";

import { deleteEventAction } from "./actions";

export default async function AdminEventsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const events = await getAllEventsAdmin();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-serif text-2xl font-bold text-navy-900">
          {t("nav.events")}
        </h1>
        <Button asChild variant="gold">
          <Link href="/admin/events/new">
            <Plus className="size-4" />
            {t("admin.events.new")}
          </Link>
        </Button>
      </div>

      {events.length === 0 ? (
        <EmptyState icon={CalendarDays} title={t("admin.empty")} />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/40">
              <tr className="text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3 text-start font-medium">{t("admin.events.fields.title")}</th>
                <th className="hidden px-4 py-3 text-start font-medium sm:table-cell">{t("admin.events.fields.startsAt")}</th>
                <th className="px-4 py-3 text-start font-medium">{t("admin.fields.published")}</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {events.map((event) => (
                <tr key={event.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium text-navy-900">
                    <Link href={`/admin/events/${event.id}`} className="hover:text-gold-700">
                      {localize(event.title, locale) || event.slug}
                    </Link>
                  </td>
                  <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">
                    {formatDateTime(event.startsAt, locale)}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={event.published ? "default" : "secondary"}>
                      {event.published ? "✓" : "—"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button asChild variant="ghost" size="icon-sm">
                        <Link href={`/admin/events/${event.id}`} aria-label={t("admin.edit")}>
                          <Pencil className="size-4" />
                        </Link>
                      </Button>
                      <DeleteButton action={deleteEventAction} id={event.id} />
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
