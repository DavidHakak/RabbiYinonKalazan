import type { ContentType } from "@/db/schema";
import type { Locale } from "@/i18n/config";

/**
 * Shared shapes for the server-side lectures listing. Kept out of the
 * `server-only` repository so client controls can import the types too.
 */

export type LectureSort = "newest" | "oldest" | "longest" | "shortest";

export const LECTURE_SORTS: LectureSort[] = [
  "newest",
  "oldest",
  "longest",
  "shortest",
];

export interface LectureQuery {
  locale: Locale;
  q?: string;
  topic?: string;
  series?: string;
  type?: ContentType;
  sort?: LectureSort;
  page?: number;
  pageSize?: number;
}

export interface Paged<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
}

export interface FacetValue {
  value: string;
  count: number;
}

export interface LectureFacets {
  total: number;
  topics: FacetValue[];
  series: FacetValue[];
  types: { value: ContentType; count: number }[];
}
