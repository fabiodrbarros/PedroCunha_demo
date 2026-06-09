import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getProjectByIdAdmin, listCategoriesAdmin } from "@/lib/services";
import { EntityForm } from "@/components/admin/EntityForm";
import { parseImages } from "@/lib/utils";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const t = await getTranslations("admin.form");
  const [item, categories] = await Promise.all([
    getProjectByIdAdmin(id),
    listCategoriesAdmin(),
  ]);
  if (!item) notFound();

  const cats = categories
    .filter((c) => c.scope === "project" || c.scope === "both")
    .map((c) => ({ id: c.id, name: c.namePt }));

  const initial = { ...item, images: parseImages(item.images) };

  return (
    <div>
      <Link
        href="/admin/projects"
        className="text-[0.7rem] uppercase tracking-widest text-ink-muted hover:text-ink"
      >
        ← {t("cancel")}
      </Link>
      <h1 className="mb-8 mt-4 font-serif text-3xl font-light text-ink">{t("editProject")}</h1>
      <EntityForm type="projects" categories={cats} initial={initial} />
    </div>
  );
}
