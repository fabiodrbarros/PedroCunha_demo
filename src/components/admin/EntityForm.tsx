"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { BoxInput, BoxTextarea, Label } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "./ImageUploader";

type EntityType = "catalog" | "projects";

export type EntityInitial = Record<string, unknown> & {
  id?: string;
  images?: string[];
};

export function EntityForm({
  type,
  categories,
  initial,
}: {
  type: EntityType;
  categories: { id: string; name: string }[];
  initial?: EntityInitial;
}) {
  const t = useTranslations("admin.form");
  const router = useRouter();
  const isEdit = Boolean(initial?.id);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState(() => ({
    titlePt: (initial?.titlePt as string) ?? "",
    descriptionPt: (initial?.descriptionPt as string) ?? "",
    materialsPt: (initial?.materialsPt as string) ?? "",
    dimensions: (initial?.dimensions as string) ?? "",
    location: (initial?.location as string) ?? "",
    year: initial?.year ? String(initial.year) : "",
    categoryId: (initial?.categoryId as string) ?? "",
    featured: Boolean(initial?.featured),
    published: initial?.published === undefined ? true : Boolean(initial.published),
    order: initial?.order ? Number(initial.order) : 0,
  }));
  const [images, setImages] = useState<string[]>(initial?.images ?? []);

  const set = (k: keyof typeof form, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const base = {
      titlePt: form.titlePt,
      descriptionPt: form.descriptionPt,
      images,
      categoryId: form.categoryId || null,
      featured: form.featured,
      published: form.published,
      order: Number(form.order) || 0,
    };
    const payload =
      type === "catalog"
        ? {
            ...base,
            materialsPt: form.materialsPt || undefined,
            dimensions: form.dimensions || undefined,
          }
        : {
            ...base,
            location: form.location || undefined,
            year: form.year ? Number(form.year) : null,
          };

    const url = isEdit ? `/api/admin/${type}/${initial!.id}` : `/api/admin/${type}`;

    try {
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? "Save failed");
      }
      router.push(`/pc-guest-admin/${type}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      {/* Content (Portuguese only — EN/FR auto-translated) */}
      <section className="flex flex-col gap-5 border border-stone-200 bg-white p-5">
        <p className="text-[0.7rem] uppercase tracking-widest text-stone-400">
          {t("ptOnlyNote")}
        </p>
        <div>
          <Label>{t("title")}</Label>
          <BoxInput
            value={form.titlePt}
            onChange={(e) => set("titlePt", e.target.value)}
            required
          />
        </div>
        <div>
          <Label>{t("description")}</Label>
          <BoxTextarea
            rows={5}
            value={form.descriptionPt}
            onChange={(e) => set("descriptionPt", e.target.value)}
            required
          />
        </div>
        {type === "catalog" && (
          <div>
            <Label>{t("materials")}</Label>
            <BoxInput
              value={form.materialsPt}
              onChange={(e) => set("materialsPt", e.target.value)}
            />
          </div>
        )}
      </section>

      {/* Meta */}
      <section className="grid grid-cols-1 gap-5 border border-stone-200 bg-white p-5 sm:grid-cols-2">
        <div>
          <Label>{t("category")}</Label>
          <select
            value={form.categoryId}
            onChange={(e) => set("categoryId", e.target.value)}
            className="h-11 w-full border border-stone-300 bg-white px-3 text-sm text-ink focus:border-ink focus:outline-none"
          >
            <option value="">—</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {type === "catalog" ? (
          <div>
            <Label>{t("dimensions")}</Label>
            <BoxInput value={form.dimensions} onChange={(e) => set("dimensions", e.target.value)} />
          </div>
        ) : (
          <>
            <div>
              <Label>{t("location")}</Label>
              <BoxInput value={form.location} onChange={(e) => set("location", e.target.value)} />
            </div>
            <div>
              <Label>{t("year")}</Label>
              <BoxInput
                type="number"
                value={form.year}
                onChange={(e) => set("year", e.target.value)}
                min={1900}
                max={2100}
              />
            </div>
          </>
        )}
      </section>

      {/* Images */}
      <section className="border border-stone-200 bg-white p-5">
        <Label>{t("images")}</Label>
        <div className="mt-2">
          <ImageUploader value={images} onChange={setImages} />
        </div>
      </section>

      {/* Flags */}
      <section className="flex flex-wrap items-center gap-8 border border-stone-200 bg-white p-5">
        <label className="flex items-center gap-2.5 text-sm text-ink">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => set("published", e.target.checked)}
            className="h-4 w-4 accent-ink"
          />
          {t("published")}
        </label>
        <label className="flex items-center gap-2.5 text-sm text-ink">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => set("featured", e.target.checked)}
            className="h-4 w-4 accent-ink"
          />
          {t("featured")}
        </label>
        <label className="ml-auto flex items-center gap-2.5 text-sm text-ink-muted">
          <span className="text-[0.65rem] uppercase tracking-widest">Order</span>
          <BoxInput
            type="number"
            value={String(form.order)}
            onChange={(e) => set("order", e.target.value)}
            className="h-9 w-20"
          />
        </label>
      </section>

      {error && <p className="text-sm text-red-700">{error}</p>}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? t("saving") : t("save")}
        </Button>
        <button
          type="button"
          onClick={() => router.push(`/pc-guest-admin/${type}`)}
          className="text-sm text-ink-muted hover:text-ink"
        >
          {t("cancel")}
        </button>
      </div>
    </form>
  );
}
