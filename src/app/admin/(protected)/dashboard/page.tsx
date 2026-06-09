import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { Monogram } from "@/components/brand/Monogram";

export default async function DashboardPage() {
  const t = await getTranslations("admin.dashboard");

  const [catalogTotal, catalogPub, projectTotal, projectPub] = await Promise.all([
    prisma.catalogItem.count(),
    prisma.catalogItem.count({ where: { published: true } }),
    prisma.project.count(),
    prisma.project.count({ where: { published: true } }),
  ]);

  const stats = [
    { label: t("catalogCount"), value: catalogTotal, sub: `${catalogPub} ${t("published")}` },
    { label: t("projectCount"), value: projectTotal, sub: `${projectPub} ${t("published")}` },
    { label: t("drafts"), value: catalogTotal - catalogPub + (projectTotal - projectPub) },
  ];

  return (
    <div>
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-light text-ink">{t("title")}</h1>
          <p className="mt-1 text-sm text-ink-muted">{t("welcome")}</p>
        </div>
        <Monogram className="hidden h-10 w-10 opacity-70 sm:block" />
      </header>

      <div className="mt-10 grid grid-cols-1 gap-px overflow-hidden border border-stone-200 bg-stone-200 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="bg-white p-7">
            <p className="text-[0.65rem] uppercase tracking-widest text-stone-400">{s.label}</p>
            <p className="nums mt-4 font-serif text-5xl font-light text-ink">{s.value}</p>
            {s.sub && <p className="mt-2 text-xs text-ink-muted">{s.sub}</p>}
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/admin/catalog/new"
          className="inline-flex h-11 items-center bg-ink px-6 text-sm text-paper-warm transition-colors hover:bg-ink-soft"
        >
          + {t("quickCatalog")}
        </Link>
        <Link
          href="/admin/projects/new"
          className="inline-flex h-11 items-center border border-ink/25 px-6 text-sm text-ink transition-colors hover:border-ink"
        >
          + {t("quickProject")}
        </Link>
      </div>
    </div>
  );
}
