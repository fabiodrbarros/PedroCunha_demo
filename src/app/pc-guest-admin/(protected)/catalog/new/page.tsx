import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { listCategoriesAdmin } from "@/lib/services";
import { EntityForm } from "@/components/admin/EntityForm";

export default async function NewCatalogPage() {
  const t = await getTranslations("admin.form");
  const categories = await listCategoriesAdmin();
  const cats = categories
    .filter((c) => c.scope === "catalog" || c.scope === "both")
    .map((c) => ({ id: c.id, name: c.namePt }));

  return (
    <div>
      <Link
        href="/pc-guest-admin/catalog"
        className="text-[0.7rem] uppercase tracking-widest text-ink-muted hover:text-ink"
      >
        ← {t("cancel")}
      </Link>
      <h1 className="mb-8 mt-4 font-serif text-3xl font-light text-ink">{t("newCatalog")}</h1>
      <EntityForm type="catalog" categories={cats} />
    </div>
  );
}
