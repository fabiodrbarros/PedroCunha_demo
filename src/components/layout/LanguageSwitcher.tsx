"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useLocale } from "next-intl";
import { locales, type Locale } from "@/i18n/routing";
import { translatePath } from "@/i18n/segments";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale() as Locale;
  const rawPathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-ink transition-opacity hover:opacity-60"
        aria-haspopup="true"
        aria-expanded={open}
      >
        {locale}
        <span aria-hidden className="text-[0.6rem] text-ink-muted">
          {open ? "—" : "+"}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-3 flex flex-col gap-1 border border-stone-200 bg-paper/95 px-4 py-3 backdrop-blur-md">
          {locales.map((l) => (
            <Link
              key={l}
              href={translatePath(rawPathname, l)}
              onClick={() => setOpen(false)}
              className={cn(
                "text-xs uppercase tracking-widest transition-colors hover:text-ink",
                l === locale ? "text-ink" : "text-stone-400"
              )}
            >
              {l}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
