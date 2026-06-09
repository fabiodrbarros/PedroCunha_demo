"use client";

import { useEffect, useRef, useState, createElement } from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tag = "div" | "span" | "li" | "section" | "article";

/**
 * Fade-and-rise reveal built on CSS transitions + IntersectionObserver.
 * CSS keeps the committed end-state correct even if the tab is backgrounded
 * (where rAF-based animation libraries can stall), so content is never stuck
 * hidden. A short timeout guarantees above-the-fold content reveals promptly.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: Tag;
}) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.18 }
    );
    io.observe(el);

    // Safety net: reveal anything already within the viewport on mount.
    const t = window.setTimeout(() => {
      if (el.getBoundingClientRect().top < window.innerHeight) setShown(true);
    }, 180);

    return () => {
      io.disconnect();
      window.clearTimeout(t);
    };
  }, []);

  return createElement(
    as,
    {
      ref,
      style: { transitionDelay: `${delay * 80}ms` },
      className: cn(
        "transition-[opacity,transform] duration-[800ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]",
        shown ? "opacity-100 translate-y-0" : "translate-y-4 opacity-0",
        className
      ),
    },
    children
  );
}

/** A hairline that draws itself in when scrolled into view (decorative). */
export function DrawLine({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    const t = window.setTimeout(() => {
      if (el.getBoundingClientRect().top < window.innerHeight) setShown(true);
    }, 180);
    return () => {
      io.disconnect();
      window.clearTimeout(t);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "h-px w-full origin-left bg-stone-300 transition-transform duration-[1100ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]",
        shown ? "scale-x-100" : "scale-x-0",
        className
      )}
    />
  );
}
