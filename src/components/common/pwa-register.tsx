"use client";

import { useEffect } from "react";

/** Registers the service worker once on the client — required for installability. */
export function PwaRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    const register = () =>
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .catch((error) => console.error("SW registration failed:", error));
    // Defer to idle so it never competes with first paint.
    if (document.readyState === "complete") register();
    else window.addEventListener("load", register, { once: true });
  }, []);

  return null;
}
