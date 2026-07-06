"use client";

import { Save } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { saveLecture } from "@/app/[locale]/admin/(panel)/lectures/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { contentTypes, type Lecture } from "@/db/schema";
import { locales, localeMeta, type Locale } from "@/i18n/config";
import { useRouter } from "@/i18n/navigation";
import type { LocalizedText } from "@/lib/localized";
import type { LectureFormValues } from "@/lib/validation/lecture";

/** Fill every locale key so react-hook-form has controlled defaults. */
function toLocalizedForm(value: LocalizedText | undefined): Record<Locale, string> {
  return Object.fromEntries(
    locales.map((l) => [l, value?.[l] ?? ""]),
  ) as Record<Locale, string>;
}

function toDateInput(date: Date | undefined) {
  if (!date) return "";
  return new Date(date).toISOString().slice(0, 10);
}

const LOCALIZED_FIELDS = ["title", "description", "topic", "series"] as const;

export function LectureForm({ lecture }: { lecture?: Lecture }) {
  const t = useTranslations();
  const router = useRouter();

  const { register, handleSubmit, formState: { isSubmitting } } =
    useForm<LectureFormValues>({
      defaultValues: {
        slug: lecture?.slug ?? "",
        title: toLocalizedForm(lecture?.title),
        description: toLocalizedForm(lecture?.description),
        topic: toLocalizedForm(lecture?.topic),
        series: toLocalizedForm(lecture?.series),
        contentType: lecture?.contentType ?? "video",
        mediaUrl: lecture?.mediaUrl ?? "",
        durationMinutes: lecture?.durationMinutes?.toString() ?? "",
        featured: lecture?.featured ?? false,
        published: lecture?.published ?? true,
        sortOrder: lecture?.sortOrder?.toString() ?? "0",
        publishedAt: toDateInput(lecture?.publishedAt),
      },
    });

  async function onSubmit(values: LectureFormValues) {
    const result = await saveLecture(lecture?.id ?? null, values);
    if (result.ok) {
      toast.success(t("admin.saved"));
      router.push("/admin/lectures");
      router.refresh();
    } else {
      toast.error(result.error ?? t("admin.saveError"));
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl space-y-8">
      {/* Localized fields */}
      {LOCALIZED_FIELDS.map((field) => (
        <fieldset key={field} className="space-y-3 rounded-2xl border border-border bg-card p-5">
          <legend className="px-1 font-serif font-semibold text-navy-900">
            {t(`admin.fields.${field}`)}
          </legend>
          {locales.map((locale) => (
            <div key={locale} className="space-y-1.5">
              <Label htmlFor={`${field}.${locale}`} className="text-xs text-muted-foreground">
                {localeMeta[locale].nativeLabel}
              </Label>
              {field === "description" ? (
                <Textarea
                  id={`${field}.${locale}`}
                  rows={3}
                  dir={localeMeta[locale].dir}
                  {...register(`${field}.${locale}` as const)}
                />
              ) : (
                <Input
                  id={`${field}.${locale}`}
                  dir={localeMeta[locale].dir}
                  {...register(`${field}.${locale}` as const)}
                />
              )}
            </div>
          ))}
        </fieldset>
      ))}

      {/* Scalar fields */}
      <fieldset className="grid gap-4 rounded-2xl border border-border bg-card p-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="slug">{t("admin.fields.slug")}</Label>
          <Input id="slug" dir="ltr" required {...register("slug")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="contentType">{t("admin.fields.contentType")}</Label>
          <select
            id="contentType"
            {...register("contentType")}
            className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            {contentTypes.map((ct) => (
              <option key={ct} value={ct}>
                {t(`lectures.contentTypes.${ct}`)}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="mediaUrl">{t("admin.fields.mediaUrl")}</Label>
          <Input id="mediaUrl" dir="ltr" placeholder="https://…" {...register("mediaUrl")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="durationMinutes">{t("admin.fields.duration")}</Label>
          <Input id="durationMinutes" type="number" dir="ltr" {...register("durationMinutes")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="publishedAt">{t("admin.fields.publishedAt")}</Label>
          <Input id="publishedAt" type="date" dir="ltr" {...register("publishedAt")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="sortOrder">{t("admin.fields.sortOrder")}</Label>
          <Input id="sortOrder" type="number" dir="ltr" {...register("sortOrder")} />
        </div>
        <div className="flex items-end gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register("featured")} className="size-4 accent-gold-500" />
            {t("admin.fields.featured")}
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register("published")} className="size-4 accent-gold-500" />
            {t("admin.fields.published")}
          </label>
        </div>
      </fieldset>

      <div className="flex gap-3">
        <Button type="submit" variant="gold" size="lg" disabled={isSubmitting}>
          <Save className="size-4" />
          {t("admin.save")}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() => router.push("/admin/lectures")}
        >
          {t("admin.cancel")}
        </Button>
      </div>
    </form>
  );
}
