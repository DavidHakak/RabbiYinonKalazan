"use client";

import { useMemo, useState } from "react";

export interface FacetConfig<T> {
  /** Stable id (also the i18n label key handled by the caller). */
  key: string;
  /** Extracts the facet value for an item (already localized). */
  accessor: (item: T) => string;
}

export interface FacetOptionValue {
  value: string;
  /** How many items (matching the *other* active filters) carry this value. */
  count: number;
}

export interface FacetOption {
  key: string;
  values: FacetOptionValue[];
}

/** A named sort order the caller can offer in the UI. */
export interface SortConfig<T> {
  key: string;
  compare: (a: T, b: T) => number;
}

const ALL = "__all__";

/**
 * Generic client-side content filtering: free-text search + any number of
 * single-select facets + optional sort + pagination. Reused by every listing
 * (lectures, divrei torah, events) so filtering logic lives in exactly one place.
 *
 * Facet option counts are computed against every *other* active filter (classic
 * faceted-search behaviour) so a count reflects "how many results if I also pick
 * this value", never dropping to a stale zero.
 */
export function useFilteredContent<T>(
  items: T[],
  {
    searchAccessor,
    facets = [],
    sorts = [],
    defaultSort,
    pageSize = 9,
  }: {
    searchAccessor: (item: T) => string;
    facets?: FacetConfig<T>[];
    sorts?: SortConfig<T>[];
    defaultSort?: string;
    pageSize?: number;
  },
) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [sort, setSort] = useState<string>(defaultSort ?? sorts[0]?.key ?? "");
  const [page, setPage] = useState(1);

  const q = query.trim().toLowerCase();

  // Does an item pass the search box + a chosen subset of facets?
  const matches = useMemo(
    () =>
      (item: T, ignoreFacet?: string) => {
        if (q && !searchAccessor(item).toLowerCase().includes(q)) return false;
        for (const facet of facets) {
          if (facet.key === ignoreFacet) continue;
          const value = selected[facet.key];
          if (value && value !== ALL && facet.accessor(item) !== value)
            return false;
        }
        return true;
      },
    [q, facets, selected, searchAccessor],
  );

  // Distinct values per facet, with counts against every *other* active filter.
  const facetOptions: FacetOption[] = useMemo(
    () =>
      facets.map((facet) => {
        const counts = new Map<string, number>();
        for (const item of items) {
          const value = facet.accessor(item);
          if (!value) continue;
          if (!matches(item, facet.key)) continue;
          counts.set(value, (counts.get(value) ?? 0) + 1);
        }
        return {
          key: facet.key,
          values: Array.from(counts.entries())
            .map(([value, count]) => ({ value, count }))
            .sort((a, b) => a.value.localeCompare(b.value)),
        };
      }),
    [items, facets, matches],
  );

  const filtered = useMemo(() => {
    const result = items.filter((item) => matches(item));
    const sorter = sorts.find((s) => s.key === sort)?.compare;
    if (sorter) result.sort(sorter);
    return result;
  }, [items, matches, sorts, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const visible = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  function setFacet(key: string, value: string) {
    setSelected((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  }

  function search(value: string) {
    setQuery(value);
    setPage(1);
  }

  function changeSort(value: string) {
    setSort(value);
    setPage(1);
  }

  function reset() {
    setQuery("");
    setSelected({});
    setPage(1);
  }

  const activeFacetCount = Object.values(selected).filter(
    (v) => v && v !== ALL,
  ).length;
  const isFiltered = query.trim().length > 0 || activeFacetCount > 0;

  return {
    query,
    search,
    selected,
    setFacet,
    facetOptions,
    sort,
    setSort: changeSort,
    page: currentPage,
    setPage,
    pageCount,
    visible,
    total: filtered.length,
    activeFacetCount,
    isFiltered,
    reset,
    ALL,
  };
}
