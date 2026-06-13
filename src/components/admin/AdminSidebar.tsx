"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Monogram } from "@/components/brand/Monogram";
import { logout } from "@/app/pc-guest-admin/actions";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/pc-guest-admin/dashboard", key: "dashboard" },
  { href: "/pc-guest-admin/catalog", key: "catalog" },
  { href: "/pc-guest-admin/projects", key: "projects" },
  { href: "/pc-guest-admin/categories", key: "categories" },
];

export function AdminSidebar({ username }: { username: string }) {
  const t = useTranslations("admin.nav");
  const pathname = usePathname();

  return (
    <aside className="flex shrink-0 flex-col border-b border-stone-200 bg-white lg:h-screen lg:w-64 lg:border-b-0 lg:border-r">
      <div className="flex items-center gap-3 border-b border-stone-200 px-6 py-6">
        <Monogram className="h-8 w-8 text-ink" strokeWidth={2.2} />
        <div className="leading-tight">
          <p className="font-serif text-sm text-ink">Pedro Cunha</p>
          <p className="text-[0.62rem] uppercase tracking-widest text-stone-400">Área reservada</p>
        </div>
      </div>

      <nav className="flex flex-row gap-1 overflow-x-auto px-3 py-3 lg:flex-1 lg:flex-col lg:px-4 lg:py-6">
        {LINKS.map((link) => {
          const active = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "whitespace-nowrap px-3 py-2.5 text-sm transition-colors",
                active ? "bg-ink text-paper-warm" : "text-ink-muted hover:bg-stone-100 hover:text-ink"
              )}
            >
              {t(link.key)}
            </Link>
          );
        })}
      </nav>

      <div className="hidden border-t border-stone-200 px-4 py-5 lg:block">
        <p className="px-3 text-[0.62rem] uppercase tracking-widest text-stone-400">{username}</p>
        <div className="mt-3 flex flex-col gap-1">
          <Link
            href="/"
            target="_blank"
            className="px-3 py-2 text-sm text-ink-muted transition-colors hover:text-ink"
          >
            ↗ {t("site")}
          </Link>
          <form action={logout}>
            <button
              type="submit"
              className="w-full px-3 py-2 text-left text-sm text-ink-muted transition-colors hover:text-ink"
            >
              {t("logout")}
            </button>
          </form>
        </div>
      </div>

      {/* mobile logout */}
      <form action={logout} className="border-t border-stone-200 px-4 py-3 lg:hidden">
        <button type="submit" className="text-sm text-ink-muted hover:text-ink">
          {t("logout")}
        </button>
      </form>
    </aside>
  );
}
