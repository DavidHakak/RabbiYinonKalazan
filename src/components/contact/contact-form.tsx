"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { submitContact } from "@/app/[locale]/(site)/contact/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { contactSchema, type ContactInput } from "@/lib/validation/contact";
import { cn } from "@/lib/utils";

export function ContactForm() {
  const t = useTranslations("contact.form");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", phone: "", subject: "", message: "" },
  });

  async function onSubmit(values: ContactInput) {
    const result = await submitContact(values);
    if (result.ok) {
      toast.success(t("successTitle"), { description: t("successText") });
      reset();
    } else {
      toast.error(t("errorText"));
    }
  }

  const fieldClass = (hasError: boolean) =>
    cn(hasError && "border-destructive focus-visible:ring-destructive/30");

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5 rounded-2xl border border-gold-500/15 bg-card p-6 shadow-sm md:p-8"
      noValidate
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">{t("name")}</Label>
          <Input id="name" {...register("name")} className={fieldClass(!!errors.name)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">{t("email")}</Label>
          <Input
            id="email"
            type="email"
            dir="ltr"
            {...register("email")}
            className={fieldClass(!!errors.email)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">{t("phone")}</Label>
          <Input id="phone" type="tel" dir="ltr" {...register("phone")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="subject">{t("subject")}</Label>
          <Input id="subject" {...register("subject")} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">{t("message")}</Label>
        <Textarea
          id="message"
          rows={6}
          {...register("message")}
          className={fieldClass(!!errors.message)}
        />
      </div>

      <Button type="submit" variant="gold" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
        <Send className="size-4 flip-rtl" />
        {t("send")}
      </Button>
    </form>
  );
}
