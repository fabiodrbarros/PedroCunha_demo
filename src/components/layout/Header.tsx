"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Monogram } from "@/components/brand/Monogram";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { NAV_LINKS } from "./nav-config";
import { cn } from "@/lib/utils";

export function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-brand",
        scrolled
          ? "border-b border-stone-200/70 bg-paper/70 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <div className="container flex h-[var(--header-h)] items-center justify-between">
        {/* Logo — on the home page it only appears after scrolling
            (the hero already shows the large logo); always shown elsewhere. */}
        <Link
          href="/"
          aria-label="Pedro Cunha Carpintaria"
          className={cn(
            "relative z-50 -my-2 shrink-0 transition-all duration-500 ease-brand",
            scrolled || !isHome || open
              ? "translate-y-0 opacity-100"
              : "pointer-events-none -translate-y-1 opacity-0"
          )}
        >
          <Monogram className="h-8 w-8 transition-opacity duration-300 hover:opacity-70" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-9 lg:flex">
          {NAV_LINKS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "link-underline text-[0.82rem] uppercase tracking-widest transition-colors duration-300",
                  active ? "text-ink" : "text-ink-muted hover:text-ink"
                )}
              >
                {t(item.key)}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-7 lg:flex">
          <span className="h-4 w-px bg-stone-300" />
          <LanguageSwitcher />
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="relative z-50 flex items-center gap-2 lg:hidden"
          aria-label={open ? t("close") : t("menu")}
        >
          <span className="text-[0.7rem] uppercase tracking-widest text-ink">
            {open ? t("close") : t("menu")}
          </span>
          <span className="flex h-4 w-5 flex-col justify-center gap-[5px]">
            <span
              className={cn(
                "h-px w-full bg-ink transition-transform duration-300",
                open && "translate-y-[3px] rotate-45"
              )}
            />
            <span
              className={cn(
                "h-px w-full bg-ink transition-transform duration-300",
                open && "-translate-y-[3px] -rotate-45"
              )}
            />
          </span>
        </button>
      </div>
    </header>

      {/* Mobile menu overlay — kept OUTSIDE <header> so the scrolled
          backdrop-blur doesn't trap its fixed positioning. Solid bg. */}
      {open && (
        <div className="fixed inset-0 z-40 flex flex-col bg-paper lg:hidden">
          <div className="container flex flex-1 flex-col justify-center">
            <nav className="flex flex-col gap-2">
              {NAV_LINKS.map((item, i) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  style={{ animationDelay: `${60 + i * 55}ms` }}
                  className="animate-fade-up text-3xl uppercase tracking-widest text-ink opacity-0"
                >
                  {t(item.key)}
                </Link>
              ))}
            </nav>
          </div>
          <div className="container flex items-center justify-between border-t border-stone-200 py-6">
            <span className="text-[0.7rem] uppercase tracking-widest text-ink-muted">
              {t("language")}
            </span>
            <LanguageSwitcher />
          </div>
        </div>
      )}
    </>
  );
}
