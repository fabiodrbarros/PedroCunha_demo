import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";
import { getProjects, getLocalizedCategories } from "@/lib/queries";
import { PageIntro } from "@/components/sections/PageIntro";
import { WorkExplorer, type WorkListItem } from "@/components/work/WorkExplorer";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "projectsPage" });
  return buildMetadata({
    locale,
    path: "/projetos",
    title: t("title"),
    description: t("lead"),
  });
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  const t = await getTranslations({ locale, namespace: "projectsPage" });
  const [projects, categories] = await Promise.all([
    getProjects(locale),
    getLocalizedCategories("project", locale),
  ]);

  const listItems: WorkListItem[] = projects.map((p) => ({
    slug: p.slug,
    title: p.title,
    description: p.description,
    cover: p.cover,
    category: p.category,
    meta: [p.location, p.year].filter(Boolean).join(" · "),
    featured: p.featured,
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
            type="project"
            searchPlaceholder={t("searchPlaceholder")}
            compact
          />
        </div>
      </section>
    </>
  );
}
