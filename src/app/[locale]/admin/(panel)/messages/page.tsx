import { Mail, Phone } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { MessageActions } from "@/components/admin/message-actions";
import { EmptyState } from "@/components/common/empty-state";
import { Badge } from "@/components/ui/badge";
import type { Locale } from "@/i18n/config";
import { formatDateTime } from "@/lib/format";
import { getContactMessages } from "@/repositories/contact";

const categoryVariant: Record<string, "default" | "secondary" | "outline"> = {
  rabbi: "default",
  site: "secondary",
  general: "outline",
};

export default async function AdminMessagesPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const messages = await getContactMessages();
  const unhandled = messages.filter((m) => !m.handled).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-navy-900">
            {t("admin.messages.title")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("admin.messages.summary", { total: messages.length, unhandled })}
          </p>
        </div>
      </div>

      {messages.length === 0 ? (
        <EmptyState title={t("admin.messages.empty")} />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/40">
              <tr className="text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3 text-start font-medium">{t("admin.messages.sender")}</th>
                <th className="px-4 py-3 text-start font-medium">{t("admin.messages.category")}</th>
                <th className="px-4 py-3 text-start font-medium">{t("admin.messages.message")}</th>
                <th className="hidden px-4 py-3 text-start font-medium md:table-cell">
                  {t("admin.messages.date")}
                </th>
                <th className="px-4 py-3 text-start font-medium">{t("admin.messages.status")}</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {messages.map((m) => (
                <tr key={m.id} className={m.handled ? "opacity-60" : undefined}>
                  <td className="px-4 py-3 align-top">
                    <div className="font-medium text-navy-900">{m.name}</div>
                    {m.email ? (
                      <a
                        href={`mailto:${m.email}`}
                        dir="ltr"
                        className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground hover:text-gold-700"
                      >
                        <Mail className="size-3 shrink-0" />
                        {m.email}
                      </a>
                    ) : null}
                    {m.phone ? (
                      <a
                        href={`tel:${m.phone}`}
                        dir="ltr"
                        className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground hover:text-gold-700"
                      >
                        <Phone className="size-3 shrink-0" />
                        {m.phone}
                      </a>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 align-top">
                    <Badge variant={categoryVariant[m.category] ?? "outline"}>
                      {t(`contact.form.categories.${m.category}`)}
                    </Badge>
                  </td>
                  <td className="max-w-md px-4 py-3 align-top text-navy-900">
                    <p className="whitespace-pre-line">{m.message}</p>
                  </td>
                  <td className="hidden px-4 py-3 align-top text-muted-foreground md:table-cell">
                    {formatDateTime(m.createdAt, locale)}
                  </td>
                  <td className="px-4 py-3 align-top">
                    <Badge variant={m.handled ? "secondary" : "default"}>
                      {m.handled ? t("admin.messages.handled") : t("admin.messages.new")}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <MessageActions id={m.id} handled={m.handled} />
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
