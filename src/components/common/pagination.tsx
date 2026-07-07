"use client";

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PageItem = number | "gap-start" | "gap-end";

/**
 * Build a compact page window: always the first and last page, the current page
 * with `siblings` neighbours on each side, and an ellipsis where pages are
 * skipped. Keeps the control small even with hundreds of pages.
 */
function pageItems(page: number, pageCount: number, siblings = 1): PageItem[] {
  // Small enough to show every page without gaps.
  if (pageCount <= siblings * 2 + 5) {
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }

  const left = Math.max(2, page - siblings);
  const right = Math.min(pageCount - 1, page + siblings);
  const items: PageItem[] = [1];

  if (left > 2) items.push("gap-start");
  for (let i = left; i <= right; i++) items.push(i);
  if (right < pageCount - 1) items.push("gap-end");

  items.push(pageCount);
  return items;
}

/**
 * Compact numbered pagination with a first/last + windowed range and ellipses.
 * Direction-agnostic: the chevrons rely on the document `dir`, so
 * "previous/next" read correctly in both RTL and LTR.
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

  const items = pageItems(page, pageCount);

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

      {items.map((item) =>
        typeof item === "number" ? (
          <Button
            key={item}
            variant={item === page ? "gold" : "outline"}
            size="icon-sm"
            onClick={() => onPageChange(item)}
            aria-current={item === page ? "page" : undefined}
          >
            {item}
          </Button>
        ) : (
          <span
            key={item}
            className="flex size-8 items-center justify-center text-muted-foreground"
            aria-hidden
          >
            <MoreHorizontal className="size-4" />
          </span>
        ),
      )}

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
