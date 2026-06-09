import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getCatalogByIdAdmin, listCategoriesAdmin } from "@/lib/services";
import { EntityForm } from "@/components/admin/EntityForm";
import { parseImages } from "@/lib/utils";

export default async function EditCatalogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const t = await getTranslations("admin.form");
  const [item, categories] = await Promise.all([
    getCatalogByIdAdmin(id),
    listCategoriesAdmin(),
  ]);
  if (!item) notFound();

  const cats = categories
    .filter((c) => c.scope === "catalog" || c.scope === "both")
    .map((c) => ({ id: c.id, name: c.namePt }));

  const initial = { ...item, images: parseImages(item.images) };

  return (
    <div>
      <Link
        href="/admin/catalog"
        className="text-[0.7rem] uppercase tracking-widest text-ink-muted hover:text-ink"
      >
        ← {t("cancel")}
      </Link>
      <h1 className="mb-8 mt-4 font-serif text-3xl font-light text-ink">{t("editCatalog")}</h1>
      <EntityForm type="catalog" categories={cats} initial={initial} />
    </div>
  );
}
