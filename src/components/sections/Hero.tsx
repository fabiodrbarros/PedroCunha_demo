"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Monogram } from "@/components/brand/Monogram";

const ease = [0.22, 1, 0.36, 1] as const;
const rise = {
  hidden: { opacity: 0, y: 22 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease, delay: 0.2 + i * 0.12 },
  }),
};

export function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="relative overflow-hidden bg-paper pt-[var(--header-h)]">
      {/* architectural backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-y-0 left-1/2 hidden w-px bg-stone-200/60 lg:block" />
      </div>

      <div className="container grid min-h-[82vh] grid-cols-1 items-center gap-y-14 py-10 lg:grid-cols-12 lg:gap-x-10">
        {/* Composition — text dominant */}
        <div className="lg:col-span-7 lg:pr-8">
          <motion.span
            className="eyebrow"
            variants={rise}
            custom={0}
            initial="hidden"
            animate="visible"
          >
            {t("eyebrow")}
          </motion.span>

          <h1 className="mt-6 font-serif text-display-xl font-light leading-[1] text-ink">
            {[t("line1"), t("line2"), t("line3")].map((line, i) => (
              <motion.span
                key={line}
                className="block overflow-hidden"
                variants={rise}
                custom={i + 1}
                initial="hidden"
                animate="visible"
              >
                {line}
              </motion.span>
            ))}
          </h1>

          <motion.p
            className="mt-6 max-w-md text-pretty text-base leading-relaxed text-ink-muted"
            variants={rise}
            custom={4}
            initial="hidden"
            animate="visible"
          >
            {t("lead")}
          </motion.p>

          <motion.div
            className="mt-8 flex flex-wrap items-center gap-4"
            variants={rise}
            custom={5}
            initial="hidden"
            animate="visible"
          >
            <Button asChild size="sm">
              <Link href="/catalogo">{t("ctaPrimary")}</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/contacto">{t("ctaSecondary")}</Link>
            </Button>
          </motion.div>

          {/* three-word essence line — the middle word reads lighter */}
          <motion.div
            className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.7rem] uppercase tracking-[0.18em] text-ink"
            variants={rise}
            custom={6}
            initial="hidden"
            animate="visible"
          >
            <span>{t("word1")}</span>
            <span aria-hidden className="text-stone-300">-</span>
            <span className="text-stone-400">{t("word2")}</span>
            <span aria-hidden className="text-stone-300">-</span>
            <span>{t("word3")}</span>
          </motion.div>
        </div>

        {/* The P/C monogram, large and centred — the visual anchor of the hero */}
        <motion.div
          className="relative flex items-center justify-center lg:col-span-5"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease, delay: 0.5 }}
        >
          <Monogram className="h-56 w-56 opacity-[0.16] sm:h-72 sm:w-72 lg:h-80 lg:w-80" />
        </motion.div>
      </div>

      {/* scroll hint */}
      <motion.div
        className="pointer-events-none absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
      >
        <span className="text-[0.6rem] uppercase tracking-widest text-stone-400">
          {t("scroll")}
        </span>
        <motion.span
          className="h-10 w-px bg-stone-300"
          animate={{ scaleY: [0.3, 1, 0.3], originY: 0 }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
}
