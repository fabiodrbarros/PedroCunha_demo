import type { Locale } from "@/i18n/routing";
import { parseImages } from "./utils";
import type { CatalogItem, Project, Category } from "@prisma/client";

const cap = (l: Locale) => (l.charAt(0).toUpperCase() + l.slice(1)) as "Pt" | "En" | "Fr";

export type LocalizedCatalogItem = {
  id: string;
  slug: string;
  title: string;
  description: string;
  materials?: string;
  dimensions?: string;
  images: string[];
  cover?: string;
  featured: boolean;
  category?: { slug: string; name: string } | null;
};

export type LocalizedProject = {
  id: string;
  slug: string;
  title: string;
  description: string;
  location?: string;
  year?: number;
  images: string[];
  cover?: string;
  featured: boolean;
  category?: { slug: string; name: string } | null;
};

export function localizeCategory(
  category: Category | null | undefined,
  locale: Locale
): { slug: string; name: string } | null {
  if (!category) return null;
  return { slug: category.slug, name: category[`name${cap(locale)}`] };
}

export function localizeCatalogItem(
  item: CatalogItem & { category?: Category | null },
  locale: Locale
): LocalizedCatalogItem {
  const c = cap(locale);
  const images = parseImages(item.images);
  return {
    id: item.id,
    slug: item.slug,
    title: item[`title${c}`],
    description: item[`description${c}`],
    materials: item[`materials${c}`] ?? undefined,
    dimensions: item.dimensions ?? undefined,
    images,
    cover: images[0],
    featured: item.featured,
    category: localizeCategory(item.category, locale),
  };
}

export function localizeProject(
  project: Project & { category?: Category | null },
  locale: Locale
): LocalizedProject {
  const c = cap(locale);
  const images = parseImages(project.images);
  return {
    id: project.id,
    slug: project.slug,
    title: project[`title${c}`],
    description: project[`description${c}`],
    location: project.location ?? undefined,
    year: project.year ?? undefined,
    images,
    cover: images[0],
    featured: project.featured,
    category: localizeCategory(project.category, locale),
  };
}
