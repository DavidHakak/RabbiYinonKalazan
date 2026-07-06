"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { submitContact } from "@/app/[locale]/(site)/contact/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { contactCategories } from "@/db/schema";
import { contactSchema, type ContactInput } from "@/lib/validation/contact";
import { cn } from "@/lib/utils";

export function ContactForm() {
  const t = useTranslations("contact.form");
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      category: "rabbi",
      email: "",
      phone: "",
      message: "",
    },
  });

  async function onSubmit(values: ContactInput) {
    const result = await submitContact(values);
    if (result.ok) {
      toast.success(t("successTitle"), { description: t("successText") });
      reset();
    } else {
      toast.error(t(`errors.${result.error ?? "server"}`));
    }
  }

  const fieldClass = (hasError: boolean) =>
    cn(hasError && "border-destructive focus-visible:ring-destructive/30");

  /** Localized inline error for a field (message doubles as an i18n key). */
  const fieldError = (key: keyof ContactInput) => {
    const msg = errors[key]?.message;
    if (!msg) return null;
    return <p className="text-xs text-destructive">{t(`errors.${msg}`)}</p>;
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5 rounded-2xl border border-gold-500/15 bg-card p-6 shadow-sm md:p-8"
      noValidate
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">
            {t("name")} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            {...register("name")}
            className={fieldClass(!!errors.name)}
          />
          {fieldError("name")}
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">{t("category")}</Label>
          <Controller
            control={control}
            name="category"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="category" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {contactCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {t(`categories.${category}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">
            {t("email")}{" "}
            <span className="text-xs font-normal text-muted-foreground">
              ({t("optional")})
            </span>
          </Label>
          <Input
            id="email"
            type="email"
            dir="ltr"
            {...register("email")}
            className={fieldClass(!!errors.email)}
          />
          {fieldError("email")}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">
            {t("phone")}{" "}
            <span className="text-xs font-normal text-muted-foreground">
              ({t("optional")})
            </span>
          </Label>
          <Input
            id="phone"
            type="tel"
            dir="ltr"
            {...register("phone")}
            className={fieldClass(!!errors.phone)}
          />
          {fieldError("phone")}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">
          {t("message")} <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="message"
          rows={6}
          placeholder={t("messagePlaceholder")}
          {...register("message")}
          className={fieldClass(!!errors.message)}
        />
        {fieldError("message")}
      </div>

      <Button
        type="submit"
        variant="gold"
        size="lg"
        disabled={isSubmitting}
        className="w-full sm:w-auto"
      >
        <Send className="size-4 flip-rtl" />
        {isSubmitting ? t("sending") : t("send")}
      </Button>
    </form>
  );
}
