import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { routing } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";
import { getCatalogItem, getCatalogSlugs } from "@/lib/queries";
import { Gallery } from "@/components/work/Gallery";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { Monogram } from "@/components/brand/Monogram";

// Keep detail content fresh after admin edits; still pre-renders known slugs.
export const revalidate = 0;

export async function generateStaticParams() {
  const slugs = await getCatalogSlugs();
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
  const item = await getCatalogItem(slug, locale);
  if (!item) return {};
  return buildMetadata({
    locale,
    path: `/catalogo/${slug}`,
    title: item.title,
    description: item.description.slice(0, 160),
    image: item.cover,
  });
}

export default async function CatalogDetailPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;

  const item = await getCatalogItem(slug, locale);
  if (!item) notFound();

  const t = await getTranslations({ locale, namespace: "catalogDetail" });

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: item.title,
    description: item.description,
    image: item.images,
    category: item.category?.name,
    brand: { "@type": "Brand", name: SITE.name },
  };

  return (
    <article className="pt-[calc(var(--header-h)+1.25rem)]">
      <div className="container">
        {/* Breadcrumb */}
        <Link
          href="/catalogo"
          className="link-underline inline-flex items-center gap-2 text-[0.7rem] uppercase tracking-widest text-ink-muted hover:text-ink"
        >
          ← {t("back")}
        </Link>

        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Gallery */}
          <Reveal className="lg:col-span-6">
            <Gallery
              images={item.images}
              title={item.title}
              mainClassName="aspect-[4/3] lg:aspect-auto lg:h-[calc(100vh_-_18rem)]"
            />
          </Reveal>

          {/* Details */}
          <div className="lg:col-span-6">
            <div className="lg:sticky lg:top-24">
              {item.category && (
                <span className="text-[0.7rem] uppercase tracking-widest text-stone-400">
                  {item.category.name}
                </span>
              )}
              <h1 className="mt-3 text-balance font-serif text-display-md font-light leading-tight text-ink">
                {item.title}
              </h1>
              <p className="mt-5 max-w-prose text-pretty text-sm leading-relaxed text-ink-muted md:text-base">
                {item.description}
              </p>

              {/* Spec list */}
              <dl className="mt-6 divide-y divide-stone-200 border-y border-stone-200">
                {item.materials && <SpecRow label={t("materials")} value={item.materials} />}
                {item.dimensions && (
                  <SpecRow label={t("dimensions")} value={item.dimensions} />
                )}
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

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
    </article>
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-6 py-4">
      <dt className="text-[0.7rem] uppercase tracking-widest text-stone-400">{label}</dt>
      <dd className="text-right text-sm text-ink">{value}</dd>
    </div>
  );
}
