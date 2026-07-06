"use client";

import { Download, Share, SquarePlus, Sparkles, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useSyncExternalStore } from "react";

import { BrandLogo } from "@/components/brand/brand-logo";
import { Button } from "@/components/ui/button";
import { useInstallPrompt } from "@/hooks/use-install-prompt";
import { cn } from "@/lib/utils";

const DISMISS_KEY = "ryk:install-dismissed";
const DISMISS_EVENT = "ryk:install-dismissed-change";
const DISMISS_DAYS = 14;

function subscribeDismiss(callback: () => void) {
  window.addEventListener(DISMISS_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(DISMISS_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function isDismissed() {
  try {
    return Date.now() < Number(localStorage.getItem(DISMISS_KEY) ?? 0);
  } catch {
    return false;
  }
}

/** True while the banner is snoozed. SSR-safe (hidden on the server). */
function useDismissed() {
  return useSyncExternalStore(subscribeDismiss, isDismissed, () => true);
}

/** Short iOS "Add to Home Screen" walkthrough (no native prompt on Safari). */
function IOSInstructions() {
  const t = useTranslations("pwa");
  return (
    <p className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm text-muted-foreground">
      {t("iosStep1")}
      <Share className="inline size-4 shrink-0 text-gold-600" aria-hidden />
      {t("iosStep2")}
      <SquarePlus className="inline size-4 shrink-0 text-gold-600" aria-hidden />
    </p>
  );
}

/**
 * Inline "install as an app" card — a warm, always-available invitation.
 * Renders nothing once the app is already installed.
 */
export function InstallAppCard({ className }: { className?: string }) {
  const t = useTranslations("pwa");
  const { isInstallable, isIOS, canInstall, promptInstall } = useInstallPrompt();
  const [showIOS, setShowIOS] = useState(false);

  if (!isInstallable) return null;

  return (
    <div
      className={cn(
        "rounded-2xl border border-gold-500/25 bg-navy-900/60 p-5 shadow-lg",
        className,
      )}
    >
      <div className="flex items-start gap-4">
        <BrandLogo size={48} className="size-12" />
        <div className="min-w-0 flex-1 space-y-1">
          <h2 className="flex items-center gap-2 font-serif text-lg font-bold text-cream-100">
            <Sparkles className="size-4 shrink-0 text-gold-500" aria-hidden />
            {t("title")}
          </h2>
          <p className="text-sm text-cream-100/70">{t("subtitle")}</p>
        </div>
      </div>

      <div className="mt-4">
        {isIOS ? (
          showIOS ? (
            <IOSInstructions />
          ) : (
            <Button variant="gold" className="w-full sm:w-auto" onClick={() => setShowIOS(true)}>
              <Download className="size-4" />
              {t("cta")}
            </Button>
          )
        ) : (
          <Button
            variant="gold"
            className="w-full sm:w-auto"
            disabled={!canInstall}
            onClick={() => promptInstall()}
          >
            <Download className="size-4" />
            {canInstall ? t("cta") : t("ctaUnavailable")}
          </Button>
        )}
      </div>
    </div>
  );
}

/**
 * Floating, dismissible bottom banner shown on mobile — the primary nudge to
 * "keep us close." Remembers dismissal for two weeks so it never nags.
 */
export function InstallAppBanner() {
  const t = useTranslations("pwa");
  const { isInstallable, isIOS, canInstall, promptInstall } = useInstallPrompt();
  const dismissed = useDismissed();
  const [showIOS, setShowIOS] = useState(false);

  const dismiss = () => {
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now() + DISMISS_DAYS * 864e5));
    } catch {
      /* ignore storage errors (private mode) */
    }
    window.dispatchEvent(new Event(DISMISS_EVENT));
  };

  const install = async () => {
    if (isIOS) {
      setShowIOS(true);
      return;
    }
    const accepted = await promptInstall();
    if (accepted) dismiss();
  };

  if (dismissed || !isInstallable) return null;

  return (
    <div
      role="dialog"
      aria-label={t("title")}
      className="fixed inset-x-3 bottom-3 z-60 mx-auto max-w-md rounded-2xl border border-gold-500/30 bg-navy-900/95 p-4 shadow-2xl backdrop-blur lg:hidden"
    >
      <div className="flex items-start gap-3">
        <BrandLogo size={44} className="size-11" />
        <div className="min-w-0 flex-1">
          <p className="font-serif text-base font-bold text-cream-100">{t("title")}</p>
          <p className="mt-0.5 text-sm text-cream-100/70">{t("subtitle")}</p>
        </div>
        <button
          type="button"
          onClick={dismiss}
          aria-label={t("dismiss")}
          className="-me-1 -mt-1 rounded-full p-1 text-cream-100/60 transition-colors hover:bg-navy-700 hover:text-cream-100"
        >
          <X className="size-4" />
        </button>
      </div>

      {isIOS && showIOS ? (
        <div className="mt-3">
          <IOSInstructions />
        </div>
      ) : (
        <Button
          variant="gold"
          className="mt-3 w-full"
          disabled={!isIOS && !canInstall}
          onClick={install}
        >
          <Download className="size-4" />
          {isIOS || canInstall ? t("cta") : t("ctaUnavailable")}
        </Button>
      )}
    </div>
  );
}
