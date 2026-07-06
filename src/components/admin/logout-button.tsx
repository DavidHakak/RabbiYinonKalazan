"use client";

import { LogOut } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function LogoutButton() {
  const t = useTranslations("admin");
  const router = useRouter();

  async function logout() {
    await createSupabaseBrowserClient().auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={logout}
      className="w-full justify-start text-cream-100/70 hover:bg-navy-800 hover:text-gold-400"
    >
      <LogOut className="size-4 flip-rtl" />
      {t("logout")}
    </Button>
  );
}
