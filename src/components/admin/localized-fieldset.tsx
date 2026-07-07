"use client";

import type { UseFormRegister } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { locales, localeMeta } from "@/i18n/config";

/**
 * Renders one input per configured locale for a translatable field
 * (`name.he`, `name.en`, …). Shared by every admin content form so the
 * per-language editing UI lives in exactly one place.
 */
export function LocalizedFieldset({
  name,
  legend,
  register,
  multiline = false,
  rows = 4,
}: {
  name: string;
  legend: string;
  // Loosely typed so any form's register works without generic gymnastics.
  register: UseFormRegister<Record<string, unknown>>;
  multiline?: boolean;
  rows?: number;
}) {
  return (
    <fieldset className="space-y-3 rounded-2xl border border-border bg-card p-5">
      <legend className="px-1 font-serif font-semibold text-navy-900">
        {legend}
      </legend>
      {locales.map((locale) => {
        const path = `${name}.${locale}`;
        return (
          <div key={locale} className="space-y-1.5">
            <Label htmlFor={path} className="text-xs text-muted-foreground">
              {localeMeta[locale].nativeLabel}
            </Label>
            {multiline ? (
              <Textarea
                id={path}
                rows={rows}
                dir={localeMeta[locale].dir}
                {...register(path)}
              />
            ) : (
              <Input id={path} dir={localeMeta[locale].dir} {...register(path)} />
            )}
          </div>
        );
      })}
    </fieldset>
  );
}
