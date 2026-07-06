"use client";

import { useMemo, useState } from "react";

export interface FacetConfig<T> {
  /** Stable id (also the i18n label key handled by the caller). */
  key: string;
  /** Extracts the facet value for an item (already localized). */
  accessor: (item: T) => string;
}

export interface FacetOption {
  key: string;
  values: string[];
}

const ALL = "__all__";

/**
 * Generic client-side content filtering: free-text search + any number of
 * single-select facets + pagination. Reused by every listing (lectures,
 * divrei torah, events) so filtering logic lives in exactly one place.
 */
export function useFilteredContent<T>(
  items: T[],
  {
    searchAccessor,
    facets = [],
    pageSize = 9,
  }: {
    searchAccessor: (item: T) => string;
    facets?: FacetConfig<T>[];
    pageSize?: number;
  },
) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);

  // Distinct, sorted values for each facet.
  const facetOptions: FacetOption[] = useMemo(
    () =>
      facets.map((facet) => ({
        key: facet.key,
        values: Array.from(
          new Set(items.map(facet.accessor).filter(Boolean)),
        ).sort((a, b) => a.localeCompare(b)),
      })),
    [items, facets],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      if (q && !searchAccessor(item).toLowerCase().includes(q)) return false;
      for (const facet of facets) {
        const value = selected[facet.key];
        if (value && value !== ALL && facet.accessor(item) !== value) return false;
      }
      return true;
    });
  }, [items, query, selected, facets, searchAccessor]);

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

  function reset() {
    setQuery("");
    setSelected({});
    setPage(1);
  }

  const isFiltered = query.trim().length > 0 || Object.values(selected).some((v) => v && v !== ALL);

  return {
    query,
    search,
    selected,
    setFacet,
    facetOptions,
    page: currentPage,
    setPage,
    pageCount,
    visible,
    total: filtered.length,
    isFiltered,
    reset,
    ALL,
  };
}
