"use client";

import { Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface FilterFacet {
  key: string;
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

interface FilterBarProps {
  searchValue: string;
  onSearch: (value: string) => void;
  searchPlaceholder?: string;
  facets?: FilterFacet[];
  allLabel: string;
  allValue: string;
  isFiltered?: boolean;
  onReset?: () => void;
  clearLabel?: string;
}

/** Search box + a row of single-select facet dropdowns. Fully data-driven. */
export function FilterBar({
  searchValue,
  onSearch,
  searchPlaceholder,
  facets = [],
  allLabel,
  allValue,
  isFiltered,
  onReset,
  clearLabel,
}: FilterBarProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-gold-500/15 bg-card p-4 shadow-sm md:flex-row md:items-center">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute inset-y-0 start-3 my-auto size-4 text-muted-foreground" />
        <Input
          value={searchValue}
          onChange={(e) => onSearch(e.target.value)}
          placeholder={searchPlaceholder}
          className="ps-9"
        />
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
              {facet.options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ))}

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
