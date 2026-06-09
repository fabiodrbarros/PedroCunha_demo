import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { SITE } from "./site";
import { routing, type Locale } from "@/i18n/routing";

const OG_LOCALE: Record<Locale, string> = {
  pt: "pt_PT",
  en: "en_US",
  fr: "fr_FR",
};

/**
 * Build localized, SEO-complete metadata for a page.
 * Handles canonical URLs, hreflang alternates and OpenGraph.
 */
export async function buildMetadata({
  locale,
  path = "",
  title,
  description,
  image,
}: {
  locale: Locale;
  /** locale-prefixed path segment after the locale, e.g. "/catalogo" */
  path?: string;
  title?: string;
  description?: string;
  image?: string;
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "meta" });
  const siteName = t("siteName");
  const metaTitle = title ? `${title} — ${siteName}` : `${siteName} · ${t("tagline")}`;
  const metaDescription = description ?? t("description");
  const ogImage = image ?? "/og-image.png";

  const canonical = `${SITE.url}/${locale}${path}`;
  const languages: Record<string, string> = {};
  for (const l of routing.locales) {
    languages[l] = `${SITE.url}/${l}${path}`;
  }
  languages["x-default"] = `${SITE.url}/${routing.defaultLocale}${path}`;

  return {
    title: metaTitle,
    description: metaDescription,
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      type: "website",
      url: canonical,
      siteName,
      title: metaTitle,
      description: metaDescription,
      locale: OG_LOCALE[locale],
      images: [{ url: ogImage, width: 1200, height: 630, alt: t("ogAlt") }],
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      images: [ogImage],
    },
  };
}
