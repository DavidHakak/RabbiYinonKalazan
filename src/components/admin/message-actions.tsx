"use client";

import { Check, RotateCcw, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { toast } from "sonner";

import {
  deleteMessageAction,
  setMessageHandledAction,
} from "@/app/[locale]/admin/(panel)/messages/actions";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";

export function MessageActions({
  id,
  handled,
}: {
  id: string;
  handled: boolean;
}) {
  const t = useTranslations("admin");
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function toggleHandled() {
    startTransition(async () => {
      const result = await setMessageHandledAction(id, !handled);
      if (result.ok) {
        toast.success(t(handled ? "messages.markedUnhandled" : "messages.markedHandled"));
        router.refresh();
      } else {
        toast.error(result.error ?? t("saveError"));
      }
    });
  }

  function onDelete() {
    if (!window.confirm(t("confirmDelete"))) return;
    startTransition(async () => {
      const result = await deleteMessageAction(id);
      if (result.ok) {
        toast.success(t("deleted"));
        router.refresh();
      } else {
        toast.error(result.error ?? t("saveError"));
      }
    });
  }

  return (
    <div className="flex items-center justify-end gap-1">
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={toggleHandled}
        disabled={pending}
        aria-label={t(handled ? "messages.markUnhandled" : "messages.markHandled")}
        title={t(handled ? "messages.markUnhandled" : "messages.markHandled")}
        className={
          handled
            ? "text-muted-foreground hover:text-navy-900"
            : "text-emerald-600 hover:bg-emerald-500/10 hover:text-emerald-700"
        }
      >
        {handled ? <RotateCcw className="size-4" /> : <Check className="size-4" />}
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={onDelete}
        disabled={pending}
        aria-label={t("delete")}
        title={t("delete")}
        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
      >
        <Trash2 className="size-4" />
      </Button>
    </div>
  );
}
