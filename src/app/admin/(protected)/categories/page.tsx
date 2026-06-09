import { getTranslations } from "next-intl/server";
import { listCategoriesAdmin } from "@/lib/services";
import { CategoriesManager, type CategoryRow } from "@/components/admin/CategoriesManager";

export default async function AdminCategoriesPage() {
  const t = await getTranslations("admin.categories");
  const categories = await listCategoriesAdmin();

  const rows: CategoryRow[] = categories.map((c) => ({
    id: c.id,
    namePt: c.namePt,
    scope: c.scope as CategoryRow["scope"],
    order: c.order,
  }));

  return (
    <div>
      <header className="mb-2">
        <h1 className="font-serif text-3xl font-light text-ink">{t("title")}</h1>
        <p className="mt-1 text-sm text-ink-muted">{t("lead")}</p>
      </header>
      <CategoriesManager initial={rows} />
    </div>
  );
}
