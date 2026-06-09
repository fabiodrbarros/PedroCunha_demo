import "server-only";
import { prisma } from "./prisma";
import type { Locale } from "@/i18n/routing";
import {
  localizeCatalogItem,
  localizeProject,
  localizeCategory,
  type LocalizedCatalogItem,
  type LocalizedProject,
} from "./content";

const cap = (l: Locale) => (l.charAt(0).toUpperCase() + l.slice(1)) as "Pt" | "En" | "Fr";

// ── Categories ────────────────────────────────────────────────
export async function getCategories(scope: "catalog" | "project") {
  const categories = await prisma.category.findMany({
    where: { scope: { in: [scope, "both"] } },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
  return categories;
}

export async function getLocalizedCategories(
  scope: "catalog" | "project",
  locale: Locale
) {
  const categories = await getCategories(scope);
  return categories.map((c) => localizeCategory(c, locale)!);
}

// ── Catalog ───────────────────────────────────────────────────
export async function getCatalogItems(
  locale: Locale,
  opts: { categorySlug?: string; search?: string; sort?: string; publishedOnly?: boolean } = {}
): Promise<LocalizedCatalogItem[]> {
  const items = await prisma.catalogItem.findMany({
    where: {
      ...(opts.publishedOnly !== false ? { published: true } : {}),
      ...(opts.categorySlug ? { category: { slug: opts.categorySlug } } : {}),
    },
    include: { category: true },
    orderBy:
      opts.sort === "alpha"
        ? [{ [`title${cap(locale)}`]: "asc" }]
        : [{ order: "asc" }, { createdAt: "desc" }],
  });

  let localized = items.map((i) => localizeCatalogItem(i, locale));

  if (opts.search) {
    const q = opts.search.toLowerCase();
    localized = localized.filter(
      (i) =>
        i.title.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q) ||
        (i.category?.name.toLowerCase().includes(q) ?? false)
    );
  }
  return localized;
}

export async function getCatalogItem(slug: string, locale: Locale) {
  const item = await prisma.catalogItem.findFirst({
    where: { slug, published: true },
    include: { category: true },
  });
  return item ? localizeCatalogItem(item, locale) : null;
}

export async function getFeaturedCatalog(locale: Locale, limit = 4) {
  const items = await prisma.catalogItem.findMany({
    where: { published: true },
    include: { category: true },
    orderBy: [{ featured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
    take: limit,
  });
  return items.map((i) => localizeCatalogItem(i, locale));
}

export async function getCatalogSlugs() {
  try {
    return await prisma.catalogItem.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    });
  } catch {
    // DB may be unavailable during build — render detail pages on demand.
    return [];
  }
}

// ── Projects ──────────────────────────────────────────────────
export async function getProjects(
  locale: Locale,
  opts: { categorySlug?: string; search?: string; publishedOnly?: boolean } = {}
): Promise<LocalizedProject[]> {
  const projects = await prisma.project.findMany({
    where: {
      ...(opts.publishedOnly !== false ? { published: true } : {}),
      ...(opts.categorySlug ? { category: { slug: opts.categorySlug } } : {}),
    },
    include: { category: true },
    orderBy: [{ order: "asc" }, { year: "desc" }, { createdAt: "desc" }],
  });

  let localized = projects.map((p) => localizeProject(p, locale));

  if (opts.search) {
    const q = opts.search.toLowerCase();
    localized = localized.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.location?.toLowerCase().includes(q) ?? false) ||
        (p.category?.name.toLowerCase().includes(q) ?? false)
    );
  }
  return localized;
}

export async function getProject(slug: string, locale: Locale) {
  const project = await prisma.project.findFirst({
    where: { slug, published: true },
    include: { category: true },
  });
  return project ? localizeProject(project, locale) : null;
}

export async function getFeaturedProjects(locale: Locale, limit = 3) {
  const projects = await prisma.project.findMany({
    where: { published: true },
    include: { category: true },
    orderBy: [{ featured: "desc" }, { order: "asc" }, { year: "desc" }],
    take: limit,
  });
  return projects.map((p) => localizeProject(p, locale));
}

export async function getProjectSlugs() {
  try {
    return await prisma.project.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    });
  } catch {
    return [];
  }
}
