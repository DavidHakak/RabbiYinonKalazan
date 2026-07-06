"use client";

import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { useTransition } from "react";

import { locales, localeMeta, type Locale } from "@/i18n/config";
import { usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  tone?: "light" | "dark";
  className?: string;
}

/**
 * Switches the active locale while staying on the current route.
 * Renders every configured locale, so adding a language needs no code change.
 */
export function LanguageSwitcher({ tone = "dark", className }: LanguageSwitcherProps) {
  const activeLocale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [isPending, startTransition] = useTransition();

  function switchTo(locale: Locale) {
    if (locale === activeLocale) return;
    startTransition(() => {
      // Preserve dynamic segments by passing the current params through.
      router.replace(
        // @ts-expect-error -- pathname + params are compatible at runtime
        { pathname, params },
        { locale },
      );
    });
  }

  return (
    <div
      className={cn("flex items-center gap-2 text-sm font-medium", className)}
      aria-label="Language"
    >
      {locales.map((locale, index) => {
        const isActive = locale === activeLocale;
        return (
          <span key={locale} className="flex items-center gap-2">
            {index > 0 ? (
              <span
                className={cn(
                  "select-none",
                  tone === "light" ? "text-cream-300/40" : "text-border",
                )}
              >
                |
              </span>
            ) : null}
            <button
              type="button"
              onClick={() => switchTo(locale)}
              disabled={isPending}
              aria-current={isActive ? "true" : undefined}
              className={cn(
                "transition-colors hover:text-gold-400 disabled:opacity-60",
                isActive
                  ? "text-gold-500"
                  : tone === "light"
                    ? "text-cream-100/80"
                    : "text-muted-foreground",
              )}
            >
              {localeMeta[locale].nativeLabel}
            </button>
          </span>
        );
      })}
    </div>
  );
}
