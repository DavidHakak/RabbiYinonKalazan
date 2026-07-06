import { BookOpen, CalendarDays, GraduationCap, MessageSquare } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Button } from "@/components/ui/button";
import type { Locale } from "@/i18n/config";
import { Link } from "@/i18n/navigation";
import { getDivreiTorah } from "@/repositories/divrei-torah";
import { getPastEvents, getUpcomingEvents } from "@/repositories/events";
import { getAllLecturesAdmin } from "@/repositories/lectures";

export default async function AdminDashboardPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  const [lectures, divrei, upcoming, past] = await Promise.all([
    getAllLecturesAdmin(),
    getDivreiTorah(),
    getUpcomingEvents(),
    getPastEvents(),
  ]);

  const stats = [
    { icon: GraduationCap, label: t("nav.lectures"), value: lectures.length, href: "/admin/lectures" },
    { icon: BookOpen, label: t("nav.dvarTorah"), value: divrei.length, href: "/admin/lectures" },
    { icon: CalendarDays, label: t("nav.events"), value: upcoming.length + past.length, href: "/admin/lectures" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-navy-900">
            {t("admin.dashboard")}
          </h1>
          <p className="text-sm text-muted-foreground">{t("site.name")}</p>
        </div>
        <Button asChild variant="gold">
          <Link href="/admin/lectures/new">{t("admin.create")}</Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="flex items-center gap-4 rounded-2xl border border-gold-500/15 bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <span className="inline-flex size-12 items-center justify-center rounded-full bg-gold-100 text-gold-700">
                <Icon className="size-6" strokeWidth={1.75} />
              </span>
              <span className="flex flex-col">
                <span className="font-serif text-3xl font-bold text-navy-900">
                  {stat.value}
                </span>
                <span className="text-sm text-muted-foreground">{stat.label}</span>
              </span>
            </Link>
          );
        })}
      </div>

      <p className="flex items-center gap-2 rounded-xl border border-dashed border-border bg-card/50 p-4 text-sm text-muted-foreground">
        <MessageSquare className="size-4 shrink-0 text-gold-600" />
        {t("admin.title")} — {t("nav.lectures")}.
      </p>
    </div>
  );
}
