"use client";

import { useEffect, useRef, useState } from "react";
import { Monogram } from "@/components/brand/Monogram";
import { cn } from "@/lib/utils";

export type SlideItem = { title: string; text: string };

const INTERVAL = 5000;

export function EditorialSlider({
  eyebrow,
  title,
  items,
}: {
  eyebrow: string;
  title: string;
  items: SlideItem[];
}) {
  const [active, setActive] = useState(0);
  const n = items.length;
  const paused = useRef(false);

  useEffect(() => {
    const id = window.setInterval(() => {
      if (!paused.current) setActive((a) => (a + 1) % n);
    }, INTERVAL);
    return () => window.clearInterval(id);
  }, [n]);

  // two-tone title: everything but the last word in ink, last word lighter
  const words = title.split(" ");
  const lead = words.slice(0, -1).join(" ");
  const tail = words[words.length - 1];

  const current = items[active];

  return (
    <section
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
      className="relative flex min-h-screen items-center overflow-hidden border-y border-stone-200"
    >
      <div className="container py-20">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          {/* Left — eyebrow + big two-tone sans title + monogram (≈3/5 width) */}
          <div className="lg:col-span-7 lg:pr-12">
            <span className="eyebrow">{eyebrow}</span>
            <h2 className="mt-7 font-sans text-[clamp(1.9rem,3.6vw,3rem)] font-light uppercase leading-[1.06] tracking-[-0.01em]">
              <span className="text-ink">{lead} </span>
              <span className="text-stone-400">{tail}</span>
            </h2>
            <Monogram className="mt-12 h-14 w-14 opacity-70" />
          </div>

          {/* Right — counter + cycling content + explore, with a tall divider */}
          <div className="lg:col-span-4 lg:col-start-9 lg:border-l lg:border-stone-200 lg:pl-12">
            <span className="nums text-xs tracking-[0.25em] text-stone-400">
              0{active + 1}
              <span className="text-stone-300"> / 0{n}</span>
            </span>

            <div key={active} className="mt-7 animate-fade-up">
              <h3 className="font-serif text-2xl font-light text-ink">{current.title}</h3>
              <p className="mt-4 max-w-sm text-pretty leading-relaxed text-ink-muted">
                {current.text}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom-centre progress ring */}
      <div className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="relative h-12 w-12">
          <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
            <circle cx="18" cy="18" r="16" fill="none" strokeWidth="1" className="stroke-stone-200" />
            <circle
              key={active}
              cx="18"
              cy="18"
              r="16"
              fill="none"
              strokeWidth="1"
              pathLength={100}
              strokeDasharray="100"
              className="stroke-ink"
              style={{ animation: `ring ${INTERVAL}ms linear forwards` }}
            />
          </svg>
          <span className="nums absolute inset-0 flex items-center justify-center text-[0.62rem] text-ink">
            0{active + 1}
          </span>
        </div>
      </div>

      {/* clickable indicators */}
      <div className="absolute bottom-9 right-0 hidden lg:block">
        <div className="container flex justify-end gap-2.5">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`${i + 1}`}
              className={cn(
                "h-px transition-all duration-300",
                i === active ? "w-8 bg-ink" : "w-4 bg-stone-300 hover:bg-stone-400"
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
