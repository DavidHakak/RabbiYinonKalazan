"use client";

import {
  BookOpen,
  CalendarDays,
  GraduationCap,
  Loader2,
  Search,
  X,
  type LucideIcon,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "@/i18n/navigation";
import type { SearchResult, SearchResultType } from "@/lib/search";
import { cn } from "@/lib/utils";

const typeIcon: Record<SearchResultType, LucideIcon> = {
  lecture: GraduationCap,
  dvarTorah: BookOpen,
  event: CalendarDays,
};

const groupOrder: SearchResultType[] = ["lecture", "dvarTorah", "event"];

/** Site-wide search: a header trigger that opens a debounced results dialog. */
export function SiteSearch({ tone = "light" }: { tone?: "light" | "dark" }) {
  const t = useTranslations("search");
  const locale = useLocale();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  // Global shortcut: ⌘K / Ctrl-K opens search from anywhere.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Debounced fetch against the full-site search endpoint. Below the minimum
  // length the effect does nothing — the render derives the empty/hint state, so
  // stale results are simply never shown.
  const hasQuery = query.trim().length >= 2;

  useEffect(() => {
    if (!hasQuery) return;
    const q = query.trim();
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(q)}&locale=${locale}`,
          { signal: controller.signal },
        );
        const data = (await res.json()) as { results: SearchResult[] };
        setResults(data.results ?? []);
      } catch (err) {
        if ((err as Error).name !== "AbortError") setResults([]);
      } finally {
        setLoading(false);
      }
    }, 220);
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [query, locale, hasQuery]);

  const onOpenChange = useCallback((next: boolean) => {
    setOpen(next);
    if (!next) {
      setQuery("");
      setResults([]);
      setLoading(false);
    }
  }, []);

  const go = useCallback(
    (href: string) => {
      onOpenChange(false);
      router.push(href);
    },
    [router, onOpenChange],
  );

  const grouped = groupOrder
    .map((type) => ({ type, items: results.filter((r) => r.type === type) }))
    .filter((g) => g.items.length > 0);

  return (
    <>
      {/* Desktop trigger — a search pill */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "hidden items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors lg:inline-flex",
          tone === "light"
            ? "border-cream-100/25 text-cream-100/70 hover:border-gold-400/60 hover:text-gold-300"
            : "border-navy-900/15 text-navy-600 hover:border-gold-500/60 hover:text-gold-700",
        )}
        aria-label={t("open")}
      >
        <Search className="size-4" />
        <span>{t("placeholder")}</span>
        <kbd className="ms-1 rounded border border-current/30 px-1.5 text-[10px] font-medium opacity-70">
          ⌘K
        </kbd>
      </button>

      {/* Mobile / tablet trigger — icon only */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "inline-flex size-9 items-center justify-center rounded-md transition-colors lg:hidden",
          tone === "light"
            ? "text-cream-100 hover:bg-navy-700 hover:text-gold-400"
            : "text-navy-700 hover:bg-muted hover:text-gold-700",
        )}
        aria-label={t("open")}
      >
        <Search className="size-5" />
      </button>

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          showCloseButton={false}
          className="top-[10%] w-full max-w-xl translate-y-0 gap-0 overflow-hidden p-0"
        >
          <DialogTitle className="sr-only">{t("title")}</DialogTitle>
          <DialogDescription className="sr-only">{t("hint")}</DialogDescription>

          {/* Search input row */}
          <div className="flex items-center gap-3 border-b border-border px-4 py-3">
            <Search className="size-5 shrink-0 text-gold-600" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("placeholder")}
              autoFocus
              className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
            />
            {loading ? (
              <Loader2 className="size-4 shrink-0 animate-spin text-muted-foreground" />
            ) : query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label={t("clear")}
                className="flex size-6 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            ) : null}
          </div>

          {/* Results */}
          <div className="max-h-[60vh] overflow-y-auto p-2">
            {!hasQuery ? (
              <p className="px-3 py-8 text-center text-sm text-muted-foreground">
                {t("hint")}
              </p>
            ) : !loading && results.length === 0 ? (
              <p className="px-3 py-8 text-center text-sm text-muted-foreground">
                {t("empty", { query: query.trim() })}
              </p>
            ) : (
              grouped.map((group) => {
                const Icon = typeIcon[group.type];
                return (
                  <div key={group.type} className="mb-2 last:mb-0">
                    <p className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {t(`groups.${group.type}`)}
                    </p>
                    <ul>
                      {group.items.map((r) => (
                        <li key={r.id}>
                          <button
                            type="button"
                            onClick={() => go(r.href)}
                            className="flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-start transition-colors hover:bg-gold-50/70"
                          >
                            <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-navy-100 text-navy-700">
                              <Icon className="size-4" />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate font-medium text-navy-900">
                                {r.title}
                              </span>
                              {r.excerpt ? (
                                <span className="block truncate text-sm text-muted-foreground">
                                  {r.excerpt}
                                </span>
                              ) : null}
                            </span>
                            {r.badge ? (
                              <span className="mt-1 hidden shrink-0 rounded-full bg-gold-100 px-2 py-0.5 text-xs text-gold-800 sm:inline-block">
                                {r.badge}
                              </span>
                            ) : null}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
