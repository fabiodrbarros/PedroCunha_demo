import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { routing } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";
import { getProject, getProjectSlugs } from "@/lib/queries";
import { Gallery } from "@/components/work/Gallery";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { Monogram } from "@/components/brand/Monogram";

export const revalidate = 0;

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return routing.locales.flatMap((locale) =>
    slugs.map(({ slug }) => ({ locale, slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = await getProject(slug, locale);
  if (!project) return {};
  return buildMetadata({
    locale,
    path: `/projetos/${slug}`,
    title: project.title,
    description: project.description.slice(0, 160),
    image: project.cover,
  });
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;

  const project = await getProject(slug, locale);
  if (!project) notFound();

  const t = await getTranslations({ locale, namespace: "projectDetail" });

  return (
    <article className="pt-[calc(var(--header-h)+1.25rem)]">
      <div className="container">
        {/* Breadcrumb */}
        <Link
          href="/projetos"
          className="link-underline inline-flex items-center gap-2 text-[0.7rem] uppercase tracking-widest text-ink-muted hover:text-ink"
        >
          ← {t("back")}
        </Link>

        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Gallery */}
          <Reveal className="lg:col-span-6">
            <Gallery
              images={project.images}
              title={project.title}
              mainClassName="aspect-[4/3] lg:aspect-auto lg:h-[calc(100vh_-_18rem)]"
            />
          </Reveal>

          {/* Details */}
          <div className="lg:col-span-6">
            <div className="lg:sticky lg:top-24">
              {project.category && (
                <span className="text-[0.7rem] uppercase tracking-widest text-stone-400">
                  {project.category.name}
                </span>
              )}
              <h1 className="mt-3 text-balance font-serif text-display-md font-light leading-tight text-ink">
                {project.title}
              </h1>
              <p className="mt-5 max-w-prose text-pretty text-sm leading-relaxed text-ink-muted md:text-base">
                {project.description}
              </p>

              {/* Spec list */}
              <dl className="mt-6 divide-y divide-stone-200 border-y border-stone-200">
                {project.location && (
                  <SpecRow label={t("location")} value={project.location} />
                )}
                {project.year && <SpecRow label={t("year")} value={String(project.year)} />}
              </dl>

              {/* CTA */}
              <div className="mt-6 bg-paper-warm p-6">
                <div className="flex items-start gap-4">
                  <Monogram className="mt-1 h-6 w-6 shrink-0 text-ink" strokeWidth={2.4} />
                  <div>
                    <h2 className="font-serif text-lg font-light text-ink">{t("ctaTitle")}</h2>
                  </div>
                </div>
                <Button asChild size="sm" className="mt-5 w-full">
                  <Link href="/contacto">{t("cta")}</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-10 md:h-14" />
    </article>
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-6 py-4">
      <dt className="text-[0.7rem] uppercase tracking-widest text-stone-400">{label}</dt>
      <dd className="nums text-right text-sm text-ink">{value}</dd>
    </div>
  );
}
