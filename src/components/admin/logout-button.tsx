"use client";

import { LogOut } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export function LogoutButton({ tone = "sidebar" }: { tone?: "sidebar" | "card" }) {
  const t = useTranslations("admin");
  const router = useRouter();

  async function logout() {
    await createSupabaseBrowserClient().auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <Button
      variant={tone === "card" ? "outline" : "ghost"}
      size="sm"
      onClick={logout}
      className={cn(
        tone === "sidebar"
          ? "w-full justify-start text-cream-100/70 hover:bg-navy-800 hover:text-gold-400"
          : "w-full",
      )}
    >
      <LogOut className="size-4 flip-rtl" />
      {t("logout")}
    </Button>
  );
}
