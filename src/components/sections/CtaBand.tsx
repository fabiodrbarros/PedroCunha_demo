import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { Monogram } from "@/components/brand/Monogram";

export function CtaBand() {
  const t = useTranslations("home.cta");

  return (
    <section className="border-t border-stone-200 bg-paper py-16 md:py-24">
      <div className="container">
        <div className="grid items-center gap-10 lg:grid-cols-12">
          {/* Copy */}
          <div className="lg:col-span-8">
            <Reveal>
              <span className="eyebrow">{t("eyebrow")}</span>
            </Reveal>
            <Reveal delay={1}>
              <h2 className="mt-6 text-balance font-serif text-display-md font-light leading-tight text-ink">
                {t("title")}
              </h2>
            </Reveal>
            <Reveal delay={2}>
              <p className="mt-5 max-w-md text-pretty leading-relaxed text-ink-muted">
                {t("lead")}
              </p>
            </Reveal>
            <Reveal delay={3}>
              <div className="mt-9">
                <Button asChild>
                  <Link href="/contacto">{t("button")}</Link>
                </Button>
              </div>
            </Reveal>
          </div>

          {/* Monogram */}
          <Reveal delay={2} className="flex justify-center lg:col-span-4 lg:justify-end">
            <Monogram className="h-40 w-40 opacity-20 md:h-48 md:w-48" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
