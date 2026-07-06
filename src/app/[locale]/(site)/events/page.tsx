import { CalendarDays, MapPin, Ticket } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { ContentCard } from "@/components/common/content-card";
import { EmptyState } from "@/components/common/empty-state";
import { Hero } from "@/components/common/hero";
import { SectionHeading } from "@/components/common/section-heading";
import { Section } from "@/components/layout/section";
import type { Event } from "@/db/schema";
import type { Locale } from "@/i18n/config";
import { formatDateTime } from "@/lib/format";
import { localize } from "@/lib/localized";
import { getPastEvents, getUpcomingEvents } from "@/repositories/events";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "events" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function EventsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const [upcoming, past] = await Promise.all([
    getUpcomingEvents(),
    getPastEvents(),
  ]);

  const renderEvent = (event: Event, isPast: boolean) => (
    <ContentCard
      key={event.id}
      title={localize(event.title, locale)}
      excerpt={localize(event.description, locale)}
      placeholderIcon={CalendarDays}
      metas={[
        { icon: CalendarDays, label: formatDateTime(event.startsAt, locale) },
        localize(event.location, locale)
          ? { icon: MapPin, label: localize(event.location, locale) }
          : null,
      ].filter((m): m is { icon: typeof MapPin; label: string } => m !== null)}
      action={
        !isPast && event.registrationUrl
          ? {
              label: t("events.register"),
              href: event.registrationUrl,
              icon: Ticket,
              variant: "gold",
              external: true,
            }
          : undefined
      }
    />
  );

  return (
    <>
      <Hero size="sm" title={t("events.title")} subtitle={t("events.subtitle")} />

      <Section size="lg">
        <SectionHeading title={t("events.upcoming")} align="start" ornament={false} className="mb-8" as="h2" />
        {upcoming.length === 0 ? (
          <EmptyState title={t("events.empty")} />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((e) => renderEvent(e, false))}
          </div>
        )}
      </Section>

      {past.length > 0 ? (
        <Section tone="muted" size="lg">
          <SectionHeading title={t("events.past")} align="start" ornament={false} className="mb-8" as="h2" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {past.map((e) => renderEvent(e, true))}
          </div>
        </Section>
      ) : null}
    </>
  );
}
