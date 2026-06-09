import { defineRouting } from "next-intl/routing";

export const locales = ["pt", "en", "fr"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "pt";

export const localeNames: Record<Locale, string> = {
  pt: "Português",
  en: "English",
  fr: "Français",
};

/**
 * Localized routing. Canonical (internal) pathnames use the Portuguese
 * slugs; each locale resolves to its own public URL:
 *   /pt/catalogo   /en/catalog   /fr/catalogue
 *   /pt/projetos   /en/projects  /fr/projets
 */
export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "always",
  pathnames: {
    "/": "/",
    "/catalogo": {
      pt: "/catalogo",
      en: "/catalog",
      fr: "/catalogue",
    },
    "/catalogo/[slug]": {
      pt: "/catalogo/[slug]",
      en: "/catalog/[slug]",
      fr: "/catalogue/[slug]",
    },
    "/projetos": {
      pt: "/projetos",
      en: "/projects",
      fr: "/projets",
    },
    "/projetos/[slug]": {
      pt: "/projetos/[slug]",
      en: "/projects/[slug]",
      fr: "/projets/[slug]",
    },
    "/sobre": {
      pt: "/sobre",
      en: "/about",
      fr: "/a-propos",
    },
    "/contacto": {
      pt: "/contacto",
      en: "/contact",
      fr: "/contact",
    },
  },
});

export type AppPathnames = keyof typeof routing.pathnames;
