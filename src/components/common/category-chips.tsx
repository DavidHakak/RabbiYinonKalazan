"use client";

import type { LucideIcon } from "lucide-react";
import { LayoutGrid } from "lucide-react";

import { cn } from "@/lib/utils";

export interface CategoryChip {
  value: string;
  count: number;
}

/**
 * A horizontal, scrollable row of pill filters for a single facet — the primary,
 * "fun" way to browse a listing by category. Single-select: clicking the active
 * chip is a no-op (use the "all" chip to clear). Reused by lectures (by topic)
 * and divrei torah (by book of the Torah).
 */
export function CategoryChips({
  options,
  value,
  onChange,
  allValue,
  allLabel,
  allIcon: AllIcon = LayoutGrid,
  totalCount,
  className,
}: {
  options: CategoryChip[];
  value: string;
  onChange: (value: string) => void;
  allValue: string;
  allLabel: string;
  allIcon?: LucideIcon;
  totalCount: number;
  className?: string;
}) {
  if (options.length === 0) return null;

  const chips: Array<CategoryChip & { icon?: LucideIcon }> = [
    { value: allValue, count: totalCount, icon: AllIcon },
    ...options,
  ];

  return (
    <div
      className={cn(
        "-mx-1 flex snap-x gap-2 overflow-x-auto px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        className,
      )}
      role="tablist"
      aria-label={allLabel}
    >
      {chips.map((chip) => {
        const isActive =
          chip.value === value || (chip.value === allValue && !value);
        const Icon = chip.icon;
        const label = chip.value === allValue ? allLabel : chip.value;
        return (
          <button
            key={chip.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(chip.value)}
            className={cn(
              "group inline-flex shrink-0 snap-start items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium whitespace-nowrap transition-all",
              isActive
                ? "border-gold-500 bg-gold-500 text-navy-950 shadow-sm"
                : "border-gold-500/20 bg-card text-navy-800 hover:border-gold-500/50 hover:bg-gold-50/60",
            )}
          >
            {Icon ? (
              <Icon
                className={cn(
                  "size-4",
                  isActive ? "text-navy-900" : "text-gold-600",
                )}
              />
            ) : null}
            {label}
            <span
              className={cn(
                "inline-flex min-w-5 items-center justify-center rounded-full px-1.5 text-xs tabular-nums transition-colors",
                isActive
                  ? "bg-navy-900/15 text-navy-900"
                  : "bg-navy-100 text-navy-700 group-hover:bg-gold-100",
              )}
            >
              {chip.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
