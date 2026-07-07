"use client";

import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";

/** Generic confirm-then-delete button; pass the entity's server delete action. */
export function DeleteButton({
  action,
  id,
}: {
  action: (id: string) => Promise<{ ok: boolean; error?: string }>;
  id: string;
}) {
  const t = useTranslations("admin");
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function onDelete() {
    if (!window.confirm(t("confirmDelete"))) return;
    startTransition(async () => {
      const result = await action(id);
      if (result.ok) {
        toast.success(t("deleted"));
        router.refresh();
      } else {
        toast.error(result.error ?? t("saveError"));
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
