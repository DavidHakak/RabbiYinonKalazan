import { Pencil, Plus, Users } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { DeleteUserButton } from "@/components/admin/delete-user-button";
import { EmptyState } from "@/components/common/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/i18n/config";
import { Link } from "@/i18n/navigation";
import { formatPhone } from "@/lib/phone";
import type { CountryCode } from "libphonenumber-js";
import { getProfiles } from "@/repositories/profiles";

const roleTone: Record<string, "default" | "secondary" | "outline"> = {
  admin: "default",
  editor: "secondary",
  user: "outline",
};

export default async function AdminUsersPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const profiles = await getProfiles();

  const regionNames = (() => {
    try {
      return new Intl.DisplayNames([locale], { type: "region" });
    } catch {
      return null;
    }
  })();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-serif text-2xl font-bold text-navy-900">
          {t("admin.users.title")}
        </h1>
        <Button asChild variant="gold">
          <Link href="/admin/users/new">
            <Plus className="size-4" />
            {t("admin.users.new")}
          </Link>
        </Button>
      </div>

      {profiles.length === 0 ? (
        <EmptyState icon={Users} title={t("admin.users.empty")} />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/40">
              <tr className="text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3 text-start font-medium">{t("admin.users.fields.firstName")}</th>
                <th className="hidden px-4 py-3 text-start font-medium md:table-cell">{t("admin.users.fields.email")}</th>
                <th className="hidden px-4 py-3 text-start font-medium sm:table-cell">{t("admin.users.fields.phone")}</th>
                <th className="px-4 py-3 text-start font-medium">{t("admin.users.fields.role")}</th>
                <th className="hidden px-4 py-3 text-start font-medium lg:table-cell">{t("admin.users.fields.country")}</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {profiles.map((p) => (
                <tr key={p.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium text-navy-900">
                    <Link href={`/admin/users/${p.id}`} className="hover:text-gold-700">
                      {p.firstName} {p.lastName}
                    </Link>
                  </td>
                  <td className="hidden px-4 py-3 text-muted-foreground md:table-cell" dir="ltr">
                    {p.email}
                  </td>
                  <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell" dir="ltr">
                    {formatPhone(p.phone, p.phoneCountry as CountryCode)}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={roleTone[p.role] ?? "outline"}>
                      {t(`admin.users.roles.${p.role}`)}
                    </Badge>
                  </td>
                  <td className="hidden px-4 py-3 text-muted-foreground lg:table-cell">
                    {regionNames?.of(p.country) ?? p.country}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button asChild variant="ghost" size="icon-sm">
                        <Link href={`/admin/users/${p.id}`} aria-label={t("admin.edit")}>
                          <Pencil className="size-4" />
                        </Link>
                      </Button>
                      <DeleteUserButton id={p.id} />
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
