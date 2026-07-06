import { ShieldAlert } from "lucide-react";
import { useTranslations } from "next-intl";

import { LogoutButton } from "./logout-button";

/** Shown when a signed-in user is authenticated but not an admin. */
export function NoAccess() {
  const t = useTranslations("admin");

  return (
    <div className="flex min-h-dvh items-center justify-center bg-navy-950 px-4">
      <div className="w-full max-w-sm space-y-5 rounded-2xl border border-gold-500/25 bg-card p-8 text-center shadow-2xl">
        <div className="flex justify-center">
          <span className="inline-flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <ShieldAlert className="size-7" />
          </span>
        </div>
        <h1 className="font-serif text-xl font-bold text-navy-900">
          {t("noAccess.title")}
        </h1>
        <p className="text-sm text-muted-foreground">{t("noAccess.text")}</p>
        <div className="pt-2">
          <LogoutButton tone="card" />
        </div>
      </div>
    </div>
  );
}
