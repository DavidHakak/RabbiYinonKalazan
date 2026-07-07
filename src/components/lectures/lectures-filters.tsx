"use client";

import { LayoutGrid } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import { CategoryChips } from "@/components/common/category-chips";
import { FilterBar } from "@/components/common/filter-bar";
import { useListParams } from "@/hooks/use-list-params";
import type { LectureFacets } from "@/lib/lectures-query";

const ALL = "__all__";

export interface LecturesFilterState {
  q?: string;
  topic?: string;
  series?: string;
  type?: string;
  sort?: string;
}

/**
 * Filter controls for the lectures listing. Every change is written to the URL
 * (via useListParams), so the server returns the matching page and the browser
 * Back button restores the visitor's exact filter + page.
 */
export function LecturesFilters({
  facets,
  current,
}: {
  facets: LectureFacets;
  current: LecturesFilterState;
}) {
  const t = useTranslations();
  const { setParams } = useListParams();

  // The search box is debounced locally, then pushed to the URL.
  const [q, setQ] = useState(current.q ?? "");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  function pushSearch(value: string) {
    setQ(value);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setParams({ q: value || null, page: null });
    }, 300);
  }

  function pick(key: string, value: string) {
    setParams({ [key]: value === ALL ? null : value, page: null });
  }

  function resetAll() {
    setQ("");
    setParams(
      { q: null, topic: null, series: null, type: null, sort: null, page: null },
    );
  }

  const isFiltered = Boolean(
    q || current.topic || current.series || current.type || current.sort,
  );

  return (
    <div className="flex flex-col gap-6">
      {facets.topics.length > 0 ? (
        <CategoryChips
          options={facets.topics}
          value={current.topic ?? ""}
          onChange={(value) => pick("topic", value)}
          allValue={ALL}
          allLabel={t("lectures.allTopics")}
          allIcon={LayoutGrid}
          totalCount={facets.total}
        />
      ) : null}

      <FilterBar
        searchValue={q}
        onSearch={pushSearch}
        searchPlaceholder={t("lectures.searchPlaceholder")}
        allLabel={t("common.all")}
        allValue={ALL}
        isFiltered={isFiltered}
        onReset={resetAll}
        clearLabel={t("common.clearFilters")}
        facets={[
          {
            key: "series",
            label: t("lectures.filters.series"),
            value: current.series ?? ALL,
            options: facets.series,
            onChange: (value) => pick("series", value),
          },
          {
            key: "type",
            label: t("lectures.filters.contentType"),
            value: current.type ?? ALL,
            options: facets.types.map((ty) => ({
              value: ty.value,
              count: ty.count,
              label: t(`lectures.contentTypes.${ty.value}`),
            })),
            onChange: (value) => pick("type", value),
          },
        ]}
        sort={{
          value: current.sort ?? "newest",
          label: t("common.sortBy"),
          onChange: (value) =>
            setParams({ sort: value === "newest" ? null : value, page: null }),
          options: [
            { value: "newest", label: t("common.sort.newest") },
            { value: "oldest", label: t("common.sort.oldest") },
            { value: "longest", label: t("common.sort.longest") },
            { value: "shortest", label: t("common.sort.shortest") },
          ],
        }}
      />
    </div>
  );
}
