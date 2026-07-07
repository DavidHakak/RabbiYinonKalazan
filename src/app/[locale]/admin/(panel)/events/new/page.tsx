import { ChevronRight } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { EventForm } from "@/components/admin/event-form";
import type { Locale } from "@/i18n/config";
import { Link } from "@/i18n/navigation";

export default async function NewEventPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/events"
          className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-gold-700"
        >
          <ChevronRight className="size-4 flip-rtl" />
          {t("admin.backToList")}
        </Link>
        <h1 className="font-serif text-2xl font-bold text-navy-900">
          {t("admin.events.new")}
        </h1>
      </div>
      <EventForm />
    </div>
  );
}
