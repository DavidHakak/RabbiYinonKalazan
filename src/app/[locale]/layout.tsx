import type { Metadata, Viewport } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Assistant, Frank_Ruhl_Libre } from "next/font/google";
import { notFound } from "next/navigation";

import { InstallAppBanner } from "@/components/common/install-app";
import { PwaRegister } from "@/components/common/pwa-register";
import { Toaster } from "@/components/ui/sonner";
import { getDirection, type Locale } from "@/i18n/config";
import { routing } from "@/i18n/routing";

import "../globals.css";

/** Display serif — elegant Hebrew + Latin, used for headings. */
const frankRuhl = Frank_Ruhl_Libre({
  subsets: ["hebrew", "latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-frank-ruhl",
  display: "swap",
});

/** UI / body sans — clean Hebrew + Latin. */
const assistant = Assistant({
  subsets: ["hebrew", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-assistant",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/** Matches the navy header so the mobile browser chrome / status bar blends in. */
export const viewport: Viewport = {
  themeColor: "#0a1730",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "site" });

  return {
    title: {
      default: `${t("name")} — ${t("tagline")}`,
      template: `%s | ${t("name")}`,
    },
    description: t("description"),
    applicationName: t("shortName"),
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: t("shortName"),
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const dir = getDirection(locale as Locale);

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${frankRuhl.variable} ${assistant.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-dvh flex-col bg-background text-foreground">
        <NextIntlClientProvider>
          {children}
          <InstallAppBanner />
          <PwaRegister />
          <Toaster richColors position={dir === "rtl" ? "bottom-left" : "bottom-right"} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
