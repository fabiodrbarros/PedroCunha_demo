import { connection } from "next/server";
import type { Locale } from "@/i18n/routing";
import { getFeaturedCatalog } from "@/lib/queries";
import { Hero } from "@/components/sections/Hero";
import { ValuesMethod } from "@/components/sections/ValuesMethod";
import { CatalogCarousel } from "@/components/sections/CatalogCarousel";
import { CtaBand } from "@/components/sections/CtaBand";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  // Content is admin-managed — opt into dynamic rendering so edits show live.
  await connection();
  const { locale } = await params;

  const catalog = await getFeaturedCatalog(locale, 8);

  const catalogCards = catalog.map((c) => ({
    slug: c.slug,
    title: c.title,
    cover: c.cover,
    category: c.category,
    featured: c.featured,
  }));

  return (
    <>
      <Hero />
      <ValuesMethod />
      <CatalogCarousel items={catalogCards} />
      <CtaBand />
    </>
  );
}
