"use client";

import { Save } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { saveProfile } from "@/app/[locale]/admin/(panel)/users/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { userRoles, userStatuses, type Profile } from "@/db/schema";
import { locales } from "@/i18n/config";
import { useRouter } from "@/i18n/navigation";
import { callingCode, countryOptions } from "@/lib/phone";
import type { ProfileFormValues } from "@/lib/validation/user";

const selectClass =
  "h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50";

export function UserForm({ profile }: { profile?: Profile }) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();

  const regionNames = useMemo(() => {
    try {
      return new Intl.DisplayNames([locale], { type: "region" });
    } catch {
      return null;
    }
  }, [locale]);
  const countryLabel = (code: string) => regionNames?.of(code) ?? code;
  const countries = useMemo(() => countryOptions(), []);

  const { register, handleSubmit, formState: { isSubmitting } } =
    useForm<ProfileFormValues>({
      defaultValues: {
        firstName: profile?.firstName ?? "",
        lastName: profile?.lastName ?? "",
        email: profile?.email ?? "",
        phone: profile?.phone ?? "",
        phoneCountry: profile?.phoneCountry ?? "IL",
        country: profile?.country ?? "IL",
        city: profile?.city ?? "",
        addressLine: profile?.addressLine ?? "",
        postalCode: profile?.postalCode ?? "",
        preferredLocale: profile?.preferredLocale ?? "he",
        role: profile?.role ?? "user",
        status: profile?.status ?? "active",
        birthDate: profile?.birthDate ?? "",
        notes: profile?.notes ?? "",
      },
    });

  async function onSubmit(values: ProfileFormValues) {
    const result = await saveProfile(profile?.id ?? null, values);
    if (result.ok) {
      toast.success(t("admin.saved"));
      router.push("/admin/users");
      router.refresh();
    } else {
      const key = `admin.users.errors.${result.error}`;
      const translated = t.has(key) ? t(key) : t("admin.saveError");
      toast.error(translated);
    }
  }

  const f = (name: string) => t(`admin.users.fields.${name}`);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl space-y-6">
      {/* Identity */}
      <fieldset className="grid gap-4 rounded-2xl border border-border bg-card p-5 sm:grid-cols-2">
        <legend className="px-1 font-serif font-semibold text-navy-900">
          {t("admin.users.sections.identity")}
        </legend>
        <div className="space-y-1.5">
          <Label htmlFor="firstName">{f("firstName")}</Label>
          <Input id="firstName" required {...register("firstName")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="lastName">{f("lastName")}</Label>
          <Input id="lastName" required {...register("lastName")} />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="email">{f("email")}</Label>
          <Input id="email" type="email" dir="ltr" required {...register("email")} />
        </div>
      </fieldset>

      {/* Phone & location */}
      <fieldset className="grid gap-4 rounded-2xl border border-border bg-card p-5 sm:grid-cols-2">
        <legend className="px-1 font-serif font-semibold text-navy-900">
          {t("admin.users.sections.contact")}
        </legend>
        <div className="space-y-1.5">
          <Label htmlFor="phoneCountry">{f("phoneCountry")}</Label>
          <select id="phoneCountry" className={selectClass} {...register("phoneCountry")}>
            {countries.map((c) => (
              <option key={c} value={c}>
                {countryLabel(c)} ({callingCode(c)})
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone">{f("phone")}</Label>
          <Input id="phone" type="tel" dir="ltr" placeholder="050-123-4567" {...register("phone")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="country">{f("country")}</Label>
          <select id="country" className={selectClass} {...register("country")}>
            {countries.map((c) => (
              <option key={c} value={c}>
                {countryLabel(c)}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="city">{f("city")}</Label>
          <Input id="city" {...register("city")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="addressLine">{f("addressLine")}</Label>
          <Input id="addressLine" {...register("addressLine")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="postalCode">{f("postalCode")}</Label>
          <Input id="postalCode" dir="ltr" {...register("postalCode")} />
        </div>
      </fieldset>

      {/* Account */}
      <fieldset className="grid gap-4 rounded-2xl border border-border bg-card p-5 sm:grid-cols-2">
        <legend className="px-1 font-serif font-semibold text-navy-900">
          {t("admin.users.sections.account")}
        </legend>
        <div className="space-y-1.5">
          <Label htmlFor="role">{f("role")}</Label>
          <select id="role" className={selectClass} {...register("role")}>
            {userRoles.map((r) => (
              <option key={r} value={r}>
                {t(`admin.users.roles.${r}`)}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="status">{f("status")}</Label>
          <select id="status" className={selectClass} {...register("status")}>
            {userStatuses.map((s) => (
              <option key={s} value={s}>
                {t(`admin.users.statuses.${s}`)}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="preferredLocale">{f("preferredLocale")}</Label>
          <select id="preferredLocale" className={selectClass} {...register("preferredLocale")}>
            {locales.map((l) => (
              <option key={l} value={l}>
                {t(`admin.users.localeNames.${l}`)}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="birthDate">{f("birthDate")}</Label>
          <Input id="birthDate" type="date" dir="ltr" {...register("birthDate")} />
        </div>
      </fieldset>

      <fieldset className="space-y-1.5 rounded-2xl border border-border bg-card p-5">
        <Label htmlFor="notes">{f("notes")}</Label>
        <Textarea id="notes" rows={3} {...register("notes")} />
      </fieldset>

      <div className="flex gap-3">
        <Button type="submit" variant="gold" size="lg" disabled={isSubmitting}>
          <Save className="size-4" />
          {t("admin.save")}
        </Button>
        <Button type="button" variant="outline" size="lg" onClick={() => router.push("/admin/users")}>
          {t("admin.cancel")}
        </Button>
      </div>
    </form>
  );
}
