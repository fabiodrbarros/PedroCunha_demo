"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { WorkCard } from "./WorkCard";
import { cn } from "@/lib/utils";

export type WorkListItem = {
  slug: string;
  title: string;
  description: string;
  cover?: string;
  category?: { name: string; slug: string } | null;
  meta?: string;
  featured?: boolean;
};

type SortKey = "recent" | "alpha" | "category";

export function WorkExplorer({
  items,
  categories,
  type,
  searchPlaceholder,
  enableSort = false,
  compact = false,
}: {
  items: WorkListItem[];
  categories: { slug: string; name: string }[];
  type: "catalog" | "project";
  searchPlaceholder: string;
  enableSort?: boolean;
  /** denser grid with smaller cards + first row sized to the viewport */
  compact?: boolean;
}) {
  // On desktop the first row fills the viewport height, leaving breathing room
  // at the bottom, so only the first row is visible.
  const compactAspect =
    "aspect-[4/5] lg:aspect-auto lg:h-[calc(100vh_-_28rem)]";
  const t = useTranslations("common");
  const tc = useTranslations("catalogPage.sort");
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [sort, setSort] = useState<SortKey>("recent");

  const filtered = useMemo(() => {
    let list = items;
    if (activeCat) list = list.filter((i) => i.category?.slug === activeCat);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q) ||
          (i.category?.name.toLowerCase().includes(q) ?? false) ||
          (i.meta?.toLowerCase().includes(q) ?? false)
      );
    }
    if (enableSort && sort !== "recent") {
      list = [...list].sort((a, b) => {
        if (sort === "alpha") return a.title.localeCompare(b.title);
        return (a.category?.name ?? "").localeCompare(b.category?.name ?? "");
      });
    }
    return list;
  }, [items, activeCat, query, sort, enableSort]);

  return (
    <div className="flex flex-col gap-10 lg:flex-row lg:gap-14">
      {/* ── Vertical filters (sidebar) ───────────────────────── */}
      <aside className="lg:w-48 lg:shrink-0">
        <div className="flex flex-col gap-8 border-b border-stone-200 pb-8 lg:sticky lg:top-24 lg:border-b-0 lg:pb-0">
          {/* Search */}
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="h-9 w-full border-0 border-b border-stone-300 bg-transparent pb-2 text-sm text-ink placeholder:text-stone-400 focus:border-ink focus:outline-none"
          />

          {/* Categories — vertical list */}
          <div className="flex flex-col items-start gap-2.5">
            <FilterChip active={activeCat === null} onClick={() => setActiveCat(null)}>
              {t("filterAll")}
            </FilterChip>
            {categories.map((c) => (
              <FilterChip
                key={c.slug}
                active={activeCat === c.slug}
                onClick={() => setActiveCat(c.slug)}
              >
                {c.name}
              </FilterChip>
            ))}
          </div>

          {/* Sort */}
          {enableSort && (
            <div className="flex flex-col gap-2">
              <span className="text-[0.62rem] uppercase tracking-widest text-stone-400">
                {t("sortBy")}
              </span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="cursor-pointer border-0 border-b border-stone-300 bg-transparent pb-2 text-xs uppercase tracking-widest text-ink focus:border-ink focus:outline-none"
              >
                <option value="recent">{tc("recent")}</option>
                <option value="alpha">{tc("alpha")}</option>
                <option value="category">{tc("category")}</option>
              </select>
            </div>
          )}
        </div>
      </aside>

      {/* ── Cards grid ───────────────────────────────────────── */}
      <div className="flex-1">
        <p className="mb-6 text-[0.7rem] uppercase tracking-widest text-stone-400">
          {t("results", { count: filtered.length })}
        </p>

        {filtered.length > 0 ? (
          <motion.div
            layout
            className={cn(
              "grid",
              compact
                ? "grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 lg:gap-y-16"
                : "grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-3"
            )}
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((item, i) => (
                <motion.div
                  key={item.slug}
                  layout
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: (i % 3) * 0.05 }}
                >
                  <WorkCard
                  item={item}
                  type={type}
                  index={i}
                  priority={i < 3}
                  aspectClassName={compact ? compactAspect : "aspect-[4/5]"}
                />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center gap-3 py-20 text-center">
            <p className="font-serif text-2xl font-light text-ink">{t("noResults")}</p>
            <p className="text-sm text-ink-muted">{t("noResultsHint")}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative pl-4 text-left text-[0.78rem] uppercase tracking-widest transition-colors duration-300",
        active ? "text-ink" : "text-stone-400 hover:text-ink"
      )}
    >
      <span
        className={cn(
          "absolute left-0 top-1/2 h-px w-2.5 -translate-y-1/2 origin-left bg-ink transition-transform duration-300",
          active ? "scale-x-100" : "scale-x-0"
        )}
      />
      {children}
    </button>
  );
}
