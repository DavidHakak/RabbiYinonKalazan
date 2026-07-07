"use client";

import { Save } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm, type UseFormRegister } from "react-hook-form";
import { toast } from "sonner";

import { saveDvarTorah } from "@/app/[locale]/admin/(panel)/dvar-torah/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { DvarTorah } from "@/db/schema";
import { useRouter } from "@/i18n/navigation";
import { toDateInput, toLocalizedForm } from "@/lib/admin-form";
import type { DvarTorahFormValues } from "@/lib/validation/dvar-torah";

import { LocalizedFieldset } from "./localized-fieldset";

export function DvarTorahForm({ dvarTorah }: { dvarTorah?: DvarTorah }) {
  const t = useTranslations();
  const router = useRouter();

  const { register, handleSubmit, formState: { isSubmitting } } =
    useForm<DvarTorahFormValues>({
      defaultValues: {
        slug: dvarTorah?.slug ?? "",
        title: toLocalizedForm(dvarTorah?.title),
        parasha: toLocalizedForm(dvarTorah?.parasha),
        excerpt: toLocalizedForm(dvarTorah?.excerpt),
        body: toLocalizedForm(dvarTorah?.body),
        mediaUrl: dvarTorah?.mediaUrl ?? "",
        publishedAt: toDateInput(dvarTorah?.publishedAt),
        featured: dvarTorah?.featured ?? false,
        published: dvarTorah?.published ?? true,
      },
    });

  const reg = register as unknown as UseFormRegister<Record<string, unknown>>;
  const f = (name: string) => t(`admin.dvarTorah.fields.${name}`);

  async function onSubmit(values: DvarTorahFormValues) {
    const result = await saveDvarTorah(dvarTorah?.id ?? null, values);
    if (result.ok) {
      toast.success(t("admin.saved"));
      router.push("/admin/dvar-torah");
      router.refresh();
    } else {
      const key = `admin.dvarTorah.errors.${result.error}`;
      toast.error(t.has(key) ? t(key) : t("admin.saveError"));
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl space-y-6">
      <LocalizedFieldset name="title" legend={f("title")} register={reg} />
      <LocalizedFieldset name="parasha" legend={f("parasha")} register={reg} />
      <LocalizedFieldset name="excerpt" legend={f("excerpt")} register={reg} multiline rows={2} />
      <LocalizedFieldset name="body" legend={f("body")} register={reg} multiline rows={8} />

      <fieldset className="grid gap-4 rounded-2xl border border-border bg-card p-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="slug">{f("slug")}</Label>
          <Input id="slug" dir="ltr" required {...register("slug")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="publishedAt">{f("publishedAt")}</Label>
          <Input id="publishedAt" type="date" dir="ltr" {...register("publishedAt")} />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="mediaUrl">{f("mediaUrl")}</Label>
          <Input id="mediaUrl" dir="ltr" placeholder="https://youtube.com/…" {...register("mediaUrl")} />
        </div>
        <div className="flex items-end gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register("featured")} className="size-4 accent-gold-500" />
            {f("featured")}
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register("published")} className="size-4 accent-gold-500" />
            {f("published")}
          </label>
        </div>
      </fieldset>

      <div className="flex gap-3">
        <Button type="submit" variant="gold" size="lg" disabled={isSubmitting}>
          <Save className="size-4" />
          {t("admin.save")}
        </Button>
        <Button type="button" variant="outline" size="lg" onClick={() => router.push("/admin/dvar-torah")}>
          {t("admin.cancel")}
        </Button>
      </div>
    </form>
  );
}
