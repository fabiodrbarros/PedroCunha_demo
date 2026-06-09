import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";
import { getCatalogItems, getLocalizedCategories } from "@/lib/queries";
import { PageIntro } from "@/components/sections/PageIntro";
import { WorkExplorer, type WorkListItem } from "@/components/work/WorkExplorer";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "catalogPage" });
  return buildMetadata({
    locale,
    path: "/catalogo",
    title: t("title"),
    description: t("lead"),
  });
}

export default async function CatalogPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  const t = await getTranslations({ locale, namespace: "catalogPage" });
  const [items, categories] = await Promise.all([
    getCatalogItems(locale),
    getLocalizedCategories("catalog", locale),
  ]);

  const listItems: WorkListItem[] = items.map((i) => ({
    slug: i.slug,
    title: i.title,
    description: i.description,
    cover: i.cover,
    category: i.category,
    featured: i.featured,
  }));

  return (
    <>
      <PageIntro
        eyebrow={t("eyebrow")}
        bordered={false}
        markClassName="right-6 bottom-4 h-28 w-28"
      />
      <section className="section pt-14 md:pt-16">
        <div className="container">
          <WorkExplorer
            items={listItems}
            categories={categories}
            type="catalog"
            searchPlaceholder={t("searchPlaceholder")}
            compact
          />
        </div>
      </section>
    </>
  );
}
