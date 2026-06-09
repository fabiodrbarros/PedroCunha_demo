import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";
import { SafeImage } from "@/components/ui/safe-image";
import { Reveal } from "@/components/ui/reveal";
import { Monogram } from "@/components/brand/Monogram";
import { EditorialSlider } from "@/components/sections/EditorialSlider";
import { CtaBand } from "@/components/sections/CtaBand";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return buildMetadata({ locale, path: "/sobre", title: t("title"), description: t("intro") });
}

const PRINCIPLES = ["bespoke", "rigor", "materials", "excellence"] as const;

const ABOUT_IMG = "/about-atelier.png";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  const tv = await getTranslations({ locale, namespace: "values" });
  const tp = await getTranslations({ locale, namespace: "home.process" });
  const th = await getTranslations({ locale, namespace: "hero" });

  const principleItems = PRINCIPLES.map((key) => ({
    title: tv(`items.${key}.title`),
    text: tv(`items.${key}.text`),
  }));

  // Split the approach statement into two tones (first half in ink, the rest lighter)
  const approachWords = t("approach.text").split(" ");
  const approachMid = Math.ceil(approachWords.length / 2);
  const approachLead = approachWords.slice(0, approachMid).join(" ");
  const approachTail = approachWords.slice(approachMid).join(" ");

  return (
    <>
      <h1 className="sr-only">{t("title")}</h1>

      {/* 1 — Principles slider (reference layout) */}
      <EditorialSlider eyebrow={t("eyebrow")} title={tp("title")} items={principleItems} />

      {/* 2 — Image + signature statement */}
      <section className="section">
        <div className="container">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-5">
              <span className="eyebrow">{t("approach.title")}</span>
              <p className="mt-7 font-sans text-[clamp(1.9rem,3.6vw,3rem)] font-light uppercase leading-[1.08] tracking-[-0.01em]">
                <span className="text-ink">{approachLead} </span>
                <span className="text-stone-400">{approachTail}</span>
              </p>
            </Reveal>

            <Reveal delay={1} className="lg:col-span-7">
              <div className="relative aspect-[16/10] overflow-hidden bg-paper-warm">
                <SafeImage
                  src={ABOUT_IMG}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 3 — Presence: Portugal & France */}
      <section className="section border-t border-stone-200 bg-paper">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <Reveal>
                <span className="eyebrow">{t("presence.eyebrow")}</span>
              </Reveal>
              <Reveal delay={1}>
                <p className="mt-7 max-w-xs text-pretty leading-relaxed text-ink-muted">
                  {t("presence.lead")}
                </p>
              </Reveal>
              {/* Brand tie-in */}
              <Reveal delay={2}>
                <div className="mt-9 flex items-center gap-3">
                  <Monogram className="h-7 w-7 opacity-70" />
                  <span className="text-[0.7rem] uppercase tracking-widest text-ink-muted">
                    {th("eyebrow")}
                  </span>
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-7 lg:col-start-6">
              <div className="border-t border-stone-300">
                {[
                  { name: t("presence.portugal"), label: th("line1").replace(/\.$/, ""), muted: false },
                  { name: t("presence.france"), label: th("line2").replace(/\.$/, ""), muted: false },
                  { name: t("presence.more"), label: th("line3").replace(/\.$/, ""), muted: true },
                ].map((c, i) => (
                  <Reveal
                    key={c.name}
                    delay={i}
                    as="div"
                    className="group flex items-baseline justify-between gap-8 border-b border-stone-300 py-9"
                  >
                    <div className="flex items-baseline gap-5 sm:gap-7">
                      <span className="nums text-xs tracking-[0.25em] text-stone-400">
                        {c.muted ? "+" : `0${i + 1}`}
                      </span>
                      <h3
                        className={`font-serif font-light leading-none ${
                          c.muted
                            ? "text-[clamp(1.5rem,3vw,2.25rem)] text-stone-400"
                            : "text-[clamp(2.5rem,6vw,4.5rem)] text-ink"
                        }`}
                      >
                        {c.name}
                      </h3>
                    </div>
                    <span className="flex items-center gap-3 text-[0.72rem] uppercase tracking-[0.2em] text-ink-muted">
                      <span className="hidden h-px w-6 bg-stone-300 transition-all duration-500 group-hover:w-10 group-hover:bg-ink sm:block" />
                      {c.label}
                    </span>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
