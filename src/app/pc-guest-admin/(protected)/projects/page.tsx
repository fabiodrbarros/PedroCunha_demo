import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { listProjectsAdmin } from "@/lib/services";
import { AdminTable, type AdminRow } from "@/components/admin/AdminTable";

export default async function AdminProjectsPage() {
  const t = await getTranslations("admin");
  const items = await listProjectsAdmin();

  const rows: AdminRow[] = items.map((i) => ({
    id: i.id,
    title: i.titlePt,
    categoryName: i.category?.namePt ?? null,
    published: i.published,
    featured: i.featured,
    updatedAt: i.updatedAt.toISOString(),
  }));

  return (
    <div>
      <header className="mb-8 flex items-center justify-between">
        <h1 className="font-serif text-3xl font-light text-ink">{t("nav.projects")}</h1>
        <Link
          href="/pc-guest-admin/projects/new"
          className="inline-flex h-11 items-center bg-ink px-6 text-sm text-paper-warm transition-colors hover:bg-ink-soft"
        >
          + {t("dashboard.quickProject")}
        </Link>
      </header>
      <AdminTable rows={rows} type="projects" />
    </div>
  );
}
