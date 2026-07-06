"use client";

import { ExternalLink, GraduationCap, LayoutDashboard, MessageSquare, Users } from "lucide-react";
import { useTranslations } from "next-intl";

import { BrandLogo } from "@/components/brand/brand-logo";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

import { LogoutButton } from "./logout-button";

const items = [
  { key: "dashboard", href: "/admin", icon: LayoutDashboard, exact: true, labelKey: "admin.dashboard" },
  { key: "lectures", href: "/admin/lectures", icon: GraduationCap, exact: false, labelKey: "nav.lectures" },
  { key: "users", href: "/admin/users", icon: Users, exact: false, labelKey: "admin.users.title" },
  { key: "messages", href: "/admin/messages", icon: MessageSquare, exact: false, labelKey: "admin.messages.title" },
];

export function AdminSidebar() {
  const t = useTranslations();
  const pathname = usePathname();

  return (
    <aside className="flex w-full shrink-0 flex-col gap-6 border-b border-navy-700 bg-navy-900 p-4 md:h-dvh md:w-64 md:border-b-0 md:border-e">
      <Link href="/admin" className="flex items-center gap-2 px-2 pt-2">
        <BrandLogo size={32} className="size-8" />
        <span className="font-serif text-sm font-bold text-cream-100">
          {t("admin.title")}
        </span>
      </Link>

      <nav className="flex flex-1 flex-col gap-1">
        {items.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.key}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-navy-800 text-gold-500"
                  : "text-cream-100/70 hover:bg-navy-800 hover:text-gold-400",
              )}
            >
              <Icon className="size-4" />
              {t(item.labelKey)}
            </Link>
          );
        })}
      </nav>

      <div className="flex flex-col gap-1 border-t border-navy-700 pt-3">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-cream-100/70 transition-colors hover:bg-navy-800 hover:text-gold-400"
        >
          <ExternalLink className="size-4 flip-rtl" />
          {t("nav.home")}
        </Link>
        <LogoutButton />
      </div>
    </aside>
  );
}
