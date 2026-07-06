"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Compact numbered pagination. Direction-agnostic: the chevrons rely on the
 * document `dir`, so "previous/next" read correctly in both RTL and LTR.
 */
export function Pagination({
  page,
  pageCount,
  onPageChange,
  className,
}: {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  className?: string;
}) {
  const t = useTranslations("common");
  if (pageCount <= 1) return null;

  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);

  return (
    <nav
      className={cn("flex items-center justify-center gap-1.5", className)}
      aria-label={t("page")}
    >
      <Button
        variant="outline"
        size="icon-sm"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label={t("previous")}
      >
        <ChevronLeft className="size-4 flip-rtl" />
      </Button>

      {pages.map((p) => (
        <Button
          key={p}
          variant={p === page ? "gold" : "outline"}
          size="icon-sm"
          onClick={() => onPageChange(p)}
          aria-current={p === page ? "page" : undefined}
        >
          {p}
        </Button>
      ))}

      <Button
        variant="outline"
        size="icon-sm"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= pageCount}
        aria-label={t("next")}
      >
        <ChevronRight className="size-4 flip-rtl" />
      </Button>
    </nav>
  );
}
