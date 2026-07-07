"use client";

import { ArrowDownWideNarrow, Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface FilterFacetOption {
  value: string;
  count?: number;
  /** Display text if it differs from `value` (e.g. an enum with a localized label). */
  label?: string;
}

export interface FilterFacet {
  key: string;
  label: string;
  value: string;
  options: FilterFacetOption[];
  onChange: (value: string) => void;
}

export interface FilterSort {
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  label?: string;
}

interface FilterBarProps {
  searchValue: string;
  onSearch: (value: string) => void;
  searchPlaceholder?: string;
  facets?: FilterFacet[];
  sort?: FilterSort;
  allLabel: string;
  allValue: string;
  isFiltered?: boolean;
  onReset?: () => void;
  clearLabel?: string;
}

/** Search box + a row of single-select facet dropdowns + optional sort. Fully data-driven. */
export function FilterBar({
  searchValue,
  onSearch,
  searchPlaceholder,
  facets = [],
  sort,
  allLabel,
  allValue,
  isFiltered,
  onReset,
  clearLabel,
}: FilterBarProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-gold-500/15 bg-card p-4 shadow-sm md:flex-row md:flex-wrap md:items-center">
      <div className="relative min-w-0 flex-1 md:min-w-[14rem]">
        <Search className="pointer-events-none absolute inset-y-0 start-3 my-auto size-4 text-muted-foreground" />
        <Input
          value={searchValue}
          onChange={(e) => onSearch(e.target.value)}
          placeholder={searchPlaceholder}
          className="ps-9"
        />
        {searchValue ? (
          <button
            type="button"
            onClick={() => onSearch("")}
            aria-label={clearLabel}
            className="absolute inset-y-0 end-2 my-auto flex size-6 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="size-3.5" />
          </button>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {facets.map((facet) => (
          <Select
            key={facet.key}
            value={facet.value || allValue}
            onValueChange={facet.onChange}
          >
            <SelectTrigger className="min-w-[9rem]">
              <SelectValue placeholder={facet.label} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={allValue}>{`${facet.label}: ${allLabel}`}</SelectItem>
              {facet.options.map((option) => {
                const text = option.label ?? option.value;
                return (
                  <SelectItem key={option.value} value={option.value}>
                    {option.count != null ? `${text} (${option.count})` : text}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        ))}

        {sort ? (
          <Select value={sort.value} onValueChange={sort.onChange}>
            <SelectTrigger className="min-w-[9rem]">
              <ArrowDownWideNarrow className="size-4 text-gold-600" />
              <SelectValue placeholder={sort.label} />
            </SelectTrigger>
            <SelectContent>
              {sort.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : null}

        {isFiltered && onReset ? (
          <Button variant="ghost" size="sm" onClick={onReset}>
            <X className="size-4" />
            {clearLabel}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
