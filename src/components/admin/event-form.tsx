"use client";

import { Save } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm, type UseFormRegister } from "react-hook-form";
import { toast } from "sonner";

import { saveEvent } from "@/app/[locale]/admin/(panel)/events/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Event } from "@/db/schema";
import { useRouter } from "@/i18n/navigation";
import { toDateTimeLocal, toLocalizedForm } from "@/lib/admin-form";
import type { EventFormValues } from "@/lib/validation/event";

import { LocalizedFieldset } from "./localized-fieldset";

export function EventForm({ event }: { event?: Event }) {
  const t = useTranslations();
  const router = useRouter();

  const { register, handleSubmit, formState: { isSubmitting } } =
    useForm<EventFormValues>({
      defaultValues: {
        slug: event?.slug ?? "",
        title: toLocalizedForm(event?.title),
        description: toLocalizedForm(event?.description),
        location: toLocalizedForm(event?.location),
        startsAt: toDateTimeLocal(event?.startsAt),
        endsAt: toDateTimeLocal(event?.endsAt),
        registrationUrl: event?.registrationUrl ?? "",
        imageUrl: event?.imageUrl ?? "",
        published: event?.published ?? true,
      },
    });

  const reg = register as unknown as UseFormRegister<Record<string, unknown>>;
  const f = (name: string) => t(`admin.events.fields.${name}`);

  async function onSubmit(values: EventFormValues) {
    const result = await saveEvent(event?.id ?? null, values);
    if (result.ok) {
      toast.success(t("admin.saved"));
      router.push("/admin/events");
      router.refresh();
    } else {
      const key = `admin.events.errors.${result.error}`;
      toast.error(t.has(key) ? t(key) : t("admin.saveError"));
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl space-y-6">
      <LocalizedFieldset name="title" legend={f("title")} register={reg} />
      <LocalizedFieldset name="description" legend={f("description")} register={reg} multiline />
      <LocalizedFieldset name="location" legend={f("location")} register={reg} />

      <fieldset className="grid gap-4 rounded-2xl border border-border bg-card p-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="slug">{f("slug")}</Label>
          <Input id="slug" dir="ltr" required {...register("slug")} />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="registrationUrl">{f("registrationUrl")}</Label>
          <Input id="registrationUrl" dir="ltr" placeholder="https://…" {...register("registrationUrl")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="startsAt">{f("startsAt")}</Label>
          <Input id="startsAt" type="datetime-local" dir="ltr" required {...register("startsAt")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="endsAt">{f("endsAt")}</Label>
          <Input id="endsAt" type="datetime-local" dir="ltr" {...register("endsAt")} />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="imageUrl">{f("imageUrl")}</Label>
          <Input id="imageUrl" dir="ltr" placeholder="https://…" {...register("imageUrl")} />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...register("published")} className="size-4 accent-gold-500" />
          {f("published")}
        </label>
      </fieldset>

      <div className="flex gap-3">
        <Button type="submit" variant="gold" size="lg" disabled={isSubmitting}>
          <Save className="size-4" />
          {t("admin.save")}
        </Button>
        <Button type="button" variant="outline" size="lg" onClick={() => router.push("/admin/events")}>
          {t("admin.cancel")}
        </Button>
      </div>
    </form>
  );
}
