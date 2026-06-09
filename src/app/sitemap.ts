import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { routing } from "@/i18n/routing";
import { getCatalogSlugs, getProjectSlugs } from "@/lib/queries";

// Localized path segments per route key.
const ROUTES: { segments: Record<string, string>; priority: number }[] = [
  { segments: { pt: "", en: "", fr: "" }, priority: 1 },
  { segments: { pt: "catalogo", en: "catalog", fr: "catalogue" }, priority: 0.9 },
  { segments: { pt: "projetos", en: "projects", fr: "projets" }, priority: 0.9 },
  { segments: { pt: "sobre", en: "about", fr: "a-propos" }, priority: 0.6 },
  { segments: { pt: "contacto", en: "contact", fr: "contact" }, priority: 0.7 },
];

const CATALOG_SEG: Record<string, string> = { pt: "catalogo", en: "catalog", fr: "catalogue" };
const PROJECT_SEG: Record<string, string> = { pt: "projetos", en: "projects", fr: "projets" };

function alternates(buildHref: (locale: string) => string) {
  const languages: Record<string, string> = {};
  for (const l of routing.locales) languages[l] = buildHref(l);
  return { languages };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const route of ROUTES) {
    for (const locale of routing.locales) {
      const seg = route.segments[locale];
      const path = seg ? `/${locale}/${seg}` : `/${locale}`;
      entries.push({
        url: `${SITE.url}${path}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: route.priority,
        alternates: alternates((l) =>
          route.segments[l] ? `${SITE.url}/${l}/${route.segments[l]}` : `${SITE.url}/${l}`
        ),
      });
    }
  }

  const [catalog, projects] = await Promise.all([getCatalogSlugs(), getProjectSlugs()]);

  for (const item of catalog) {
    for (const locale of routing.locales) {
      entries.push({
        url: `${SITE.url}/${locale}/${CATALOG_SEG[locale]}/${item.slug}`,
        lastModified: item.updatedAt,
        changeFrequency: "monthly",
        priority: 0.8,
        alternates: alternates(
          (l) => `${SITE.url}/${l}/${CATALOG_SEG[l]}/${item.slug}`
        ),
      });
    }
  }

  for (const p of projects) {
    for (const locale of routing.locales) {
      entries.push({
        url: `${SITE.url}/${locale}/${PROJECT_SEG[locale]}/${p.slug}`,
        lastModified: p.updatedAt,
        changeFrequency: "monthly",
        priority: 0.8,
        alternates: alternates((l) => `${SITE.url}/${l}/${PROJECT_SEG[l]}/${p.slug}`),
      });
    }
  }

  return entries;
}
