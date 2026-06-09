import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";
import { PageIntro } from "@/components/sections/PageIntro";
import { ContactForm } from "@/components/forms/ContactForm";
import { Button } from "@/components/ui/button";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return buildMetadata({ locale, path: "/contacto", title: t("title"), description: t("lead") });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${SITE.address.locality}, Portugal`
  )}`;

  return (
    <>
      <PageIntro
        eyebrow={t("eyebrow")}
        markClassName="right-8 bottom-4 h-28 w-28"
        bordered={false}
      >
        {/* Quick actions, below the "Contactos" label */}
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild variant="outline" size="sm">
            <a href={`tel:${SITE.phoneRaw}`}>{t("info.call")}</a>
          </Button>
          <Button asChild variant="outline" size="sm">
            <a href={`mailto:${SITE.email}`}>{t("info.sendEmail")}</a>
          </Button>
          <Button asChild variant="outline" size="sm">
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
              {t("info.viewMap")}
            </a>
          </Button>
        </div>
      </PageIntro>

      <section className="pb-16 pt-2">
        <div className="container">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
          {/* Form */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>

          {/* Info */}
          <aside className="lg:col-span-5 lg:border-l lg:border-stone-200 lg:pl-16">
            <dl className="space-y-5">
              <InfoRow label={t("info.phone")}>
                <a href={`tel:${SITE.phoneRaw}`} className="link-underline">
                  {SITE.phone}
                </a>
                <span className="ml-2 text-xs text-stone-400">{t("info.phoneNote")}</span>
              </InfoRow>
              <InfoRow label={t("info.email")}>
                <a href={`mailto:${SITE.email}`} className="link-underline">
                  {SITE.email}
                </a>
              </InfoRow>
              <InfoRow label={t("info.hours")}>{t("info.hoursValue")}</InfoRow>
            </dl>

            <p className="mt-8 text-sm text-ink-muted">{t("info.addressValue")}</p>

            {/* Map (compact) */}
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 block h-28 w-full overflow-hidden border border-stone-200"
            >
              <iframe
                title={t("info.viewMap")}
                src="https://www.openstreetmap.org/export/embed.html?bbox=-8.600%2C41.758%2C-8.567%2C41.778&layer=mapnik&marker=41.7676%2C-8.5836"
                className="pointer-events-none h-full w-full grayscale"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </a>
          </aside>
        </div>
      </div>
    </section>
    </>
  );
}

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-[0.65rem] uppercase tracking-widest text-stone-400">{label}</dt>
      <dd className="mt-2 text-base text-ink">{children}</dd>
    </div>
  );
}
