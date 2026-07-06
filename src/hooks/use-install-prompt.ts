"use client";

import { useSyncExternalStore } from "react";

/** The non-standard event Chromium fires when a site is installable. */
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

// Capture the event as early as the module loads — it can fire before any
// component mounts, so we buffer it and re-broadcast for late subscribers.
let deferredPrompt: BeforeInstallPromptEvent | null = null;

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e as BeforeInstallPromptEvent;
    window.dispatchEvent(new Event("pwa:installable"));
  });
  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;
    window.dispatchEvent(new Event("pwa:installable"));
  });
}

function subscribeInstallable(callback: () => void) {
  window.addEventListener("pwa:installable", callback);
  return () => window.removeEventListener("pwa:installable", callback);
}

function subscribeDisplayMode(callback: () => void) {
  const mq = window.matchMedia("(display-mode: standalone)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

const noopSubscribe = () => () => {};

function detectStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // iOS Safari uses a non-standard flag
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

function detectIOS() {
  const ua = navigator.userAgent;
  const isIOSDevice = /iPad|iPhone|iPod/.test(ua);
  // iPadOS 13+ reports as Mac but is touch-capable — treat as iOS for hints.
  const isIPadOS = /Macintosh/.test(ua) && "ontouchend" in document;
  return (isIOSDevice || isIPadOS) && !/CriOS|FxiOS|EdgiOS/.test(ua);
}

interface InstallPromptState {
  /** Native install prompt is available (Android / desktop Chromium). */
  canInstall: boolean;
  /** iOS Safari — needs manual "Add to Home Screen" instructions. */
  isIOS: boolean;
  /** Already running as an installed app — hide all install UI. */
  isStandalone: boolean;
  /** Ready to render some install affordance (native or iOS hint). */
  isInstallable: boolean;
  /** Trigger the native prompt; resolves to whether the user accepted. */
  promptInstall: () => Promise<boolean>;
}

/**
 * Cross-platform "install this site as an app" state + trigger. Reads
 * client-only signals via `useSyncExternalStore`, so it stays SSR-safe
 * (everything is `false` on the server) and updates as the browser fires
 * install-related events.
 */
export function useInstallPrompt(): InstallPromptState {
  const canInstall = useSyncExternalStore(
    subscribeInstallable,
    () => deferredPrompt !== null,
    () => false,
  );
  const isStandalone = useSyncExternalStore(
    subscribeDisplayMode,
    detectStandalone,
    () => false,
  );
  const isIOS = useSyncExternalStore(noopSubscribe, detectIOS, () => false);

  const promptInstall = async () => {
    if (!deferredPrompt) return false;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    deferredPrompt = null;
    window.dispatchEvent(new Event("pwa:installable"));
    return outcome === "accepted";
  };

  return {
    canInstall,
    isIOS,
    isStandalone,
    isInstallable: !isStandalone && (canInstall || isIOS),
    promptInstall,
  };
}
