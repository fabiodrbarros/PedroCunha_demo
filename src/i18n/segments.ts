import type { Locale } from "./routing";

/**
 * First-segment translations for the localized routes. Used by the
 * language switcher to translate the current URL into another locale
 * while preserving the trailing slug (slugs are shared across locales).
 */
const SEGMENTS: Record<string, Record<Locale, string>> = {
  catalog: { pt: "catalogo", en: "catalog", fr: "catalogue" },
  projects: { pt: "projetos", en: "projects", fr: "projets" },
  about: { pt: "sobre", en: "about", fr: "a-propos" },
  contact: { pt: "contacto", en: "contact", fr: "contact" },
};

const ALL = Object.values(SEGMENTS);

/** Translate a full pathname (incl. locale prefix) into the target locale. */
export function translatePath(rawPathname: string, target: Locale): string {
  const parts = rawPathname.split("/").filter(Boolean);
  if (parts.length === 0) return `/${target}`;

  const rest = parts.slice(1); // drop current locale
  if (rest.length === 0) return `/${target}`;

  const [seg, ...tail] = rest;
  const match = ALL.find((s) => Object.values(s).includes(seg));
  const newSeg = match ? match[target] : seg;

  return "/" + [target, newSeg, ...tail].join("/");
}
