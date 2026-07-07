"use client";

import { Menu } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { mainNav } from "@/config/navigation";

import { LanguageSwitcher } from "./language-switcher";
import { NavLink } from "./nav-link";
import { SiteSearch } from "./site-search";

/** Sticky public site header: brand, primary nav, language switcher, mobile menu. */
export function SiteHeader() {
  const t = useTranslations("nav");
  const tSite = useTranslations("site");
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-navy-700/60 bg-navy-900/95 backdrop-blur supports-backdrop-filter:bg-navy-900/85">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo name={tSite("name")} tone="light" />

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-1 lg:flex">
          {mainNav.map((item) => (
            <NavLink
              key={item.key}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-cream-100/80 transition-colors hover:text-gold-400"
              activeClassName="text-gold-500"
            >
              {t(item.key)}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <SiteSearch tone="light" />

          <div className="hidden sm:block">
            <LanguageSwitcher tone="light" />
          </div>

          {/* Mobile menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-cream-100 hover:bg-navy-700 hover:text-gold-400 lg:hidden"
                aria-label={t("menu")}
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 border-navy-700 bg-navy-900 text-cream-100">
              <SheetHeader>
                <SheetTitle className="text-start font-serif text-cream-100">
                  {tSite("name")}
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-2 flex flex-col gap-1 px-4">
                {mainNav.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.key}
                      href={item.href}
                      onNavigate={() => setOpen(false)}
                      className="flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium text-cream-100/85 transition-colors hover:bg-navy-700 hover:text-gold-400"
                      activeClassName="bg-navy-700 text-gold-500"
                    >
                      <Icon className="size-5 text-gold-500/80" />
                      {t(item.key)}
                    </NavLink>
                  );
                })}
              </nav>
              <div className="mt-6 border-t border-navy-700 px-6 pt-6">
                <LanguageSwitcher tone="light" />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
