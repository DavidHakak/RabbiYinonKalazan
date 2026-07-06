"use client";

import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { toast } from "sonner";

import { deleteProfileAction } from "@/app/[locale]/admin/(panel)/users/actions";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";

export function DeleteUserButton({ id }: { id: string }) {
  const t = useTranslations("admin");
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function onDelete() {
    if (!window.confirm(t("confirmDelete"))) return;
    startTransition(async () => {
      const result = await deleteProfileAction(id);
      if (result.ok) {
        toast.success(t("deleted"));
        router.refresh();
      } else {
        toast.error(t("saveError"));
      }
    });
  }

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={onDelete}
      disabled={pending}
      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
      aria-label={t("delete")}
    >
      <Trash2 className="size-4" />
    </Button>
  );
}
