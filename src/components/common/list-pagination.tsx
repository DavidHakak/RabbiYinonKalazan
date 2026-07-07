"use client";

import { useListParams } from "@/hooks/use-list-params";

import { Pagination } from "./pagination";

/**
 * URL-driven pagination for server-rendered listings. Writing the page into the
 * query string means the browser Back button restores the exact page (and every
 * active filter) a visitor was on.
 */
export function ListPagination({
  page,
  pageCount,
}: {
  page: number;
  pageCount: number;
}) {
  const { setParams } = useListParams();
  return (
    <Pagination
      page={page}
      pageCount={pageCount}
      onPageChange={(p) =>
        setParams({ page: p <= 1 ? null : String(p) }, { scroll: true })
      }
    />
  );
}
