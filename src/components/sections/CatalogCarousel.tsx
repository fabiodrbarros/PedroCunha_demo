"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { WorkCard, type WorkCardData } from "@/components/work/WorkCard";

export function CatalogCarousel({ items }: { items: WorkCardData[] }) {
  const t = useTranslations("home.catalog");
  const trackRef = useRef<HTMLDivElement>(null);
  const paused = useRef(false);

  // Auto-advance every 2.5s, looping back to the start at the end.
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const id = window.setInterval(() => {
      if (paused.current) return;
      const card = el.firstElementChild as HTMLElement | null;
      const step = card ? card.clientWidth + 24 : el.clientWidth * 0.8;
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (el.scrollLeft >= maxScroll - 8) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: step, behavior: "smooth" });
      }
    }, 2500);

    return () => window.clearInterval(id);
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="section bg-paper">
      <div className="container">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <span className="eyebrow">{t("eyebrow")}</span>

          <Link
            href="/catalogo"
            className="link-underline whitespace-nowrap text-sm uppercase tracking-widest text-ink"
          >
            {t("cta")}
          </Link>
        </div>
      </div>

      {/* Carousel track */}
      <div className="container">
        <div
          ref={trackRef}
          onMouseEnter={() => (paused.current = true)}
          onMouseLeave={() => (paused.current = false)}
          className="mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map((item, i) => (
            <div
              key={item.slug}
              className="w-[78%] shrink-0 snap-start sm:w-[46%] lg:w-[30%] xl:w-[23%]"
            >
              <WorkCard item={item} type="catalog" index={i} priority={i < 3} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
