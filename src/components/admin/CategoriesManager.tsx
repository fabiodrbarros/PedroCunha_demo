"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { BoxInput, Label } from "@/components/ui/field";
import { Button } from "@/components/ui/button";

export type CategoryRow = {
  id: string;
  namePt: string;
  scope: "catalog" | "project" | "both";
  order: number;
};

const SCOPES: CategoryRow["scope"][] = ["both", "catalog", "project"];

export function CategoriesManager({ initial }: { initial: CategoryRow[] }) {
  const t = useTranslations("admin.categories");
  const tf = useTranslations("admin.form");
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [busy, setBusy] = useState(false);

  const empty = { namePt: "", scope: "both" as CategoryRow["scope"] };
  const [draft, setDraft] = useState(empty);

  function scopeLabel(s: CategoryRow["scope"]) {
    if (s === "both") return `${t("catalog")} + ${t("projects")}`;
    return s === "catalog" ? t("catalog") : t("projects");
  }

  async function add() {
    if (!draft.namePt.trim()) return;
    setBusy(true);
    await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    setBusy(false);
    setDraft(empty);
    startTransition(() => router.refresh());
  }

  async function update(row: CategoryRow) {
    setBusy(true);
    await fetch(`/api/admin/categories/${row.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(row),
    });
    setBusy(false);
    startTransition(() => router.refresh());
  }

  async function remove(id: string) {
    if (!confirm(`${tf("remove")}?`)) return;
    setBusy(true);
    await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    setBusy(false);
    startTransition(() => router.refresh());
  }

  return (
    <div className="mt-8 flex flex-col gap-8">
      {/* Add form */}
      <section className="border border-stone-200 bg-white p-5">
        <h2 className="mb-4 text-[0.65rem] uppercase tracking-widest text-stone-400">{t("add")}</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <Label>{t("name")}</Label>
            <BoxInput value={draft.namePt} onChange={(e) => setDraft({ ...draft, namePt: e.target.value })} />
          </div>
          <div>
            <Label>{t("type")}</Label>
            <select
              value={draft.scope}
              onChange={(e) => setDraft({ ...draft, scope: e.target.value as CategoryRow["scope"] })}
              className="h-11 w-full border border-stone-300 bg-white px-3 text-sm text-ink focus:border-ink focus:outline-none"
            >
              {SCOPES.map((s) => (
                <option key={s} value={s}>
                  {scopeLabel(s)}
                </option>
              ))}
            </select>
          </div>
        </div>
        <p className="mt-3 text-[0.65rem] uppercase tracking-widest text-stone-400">
          {tf("ptOnlyNote")}
        </p>
        <Button type="button" onClick={add} disabled={busy} className="mt-4">
          + {t("add")}
        </Button>
      </section>

      {/* Existing */}
      <section className="border border-stone-200 bg-white">
        <ul className="divide-y divide-stone-100">
          {initial.map((row) => (
            <CategoryRowItem key={row.id} row={row} onSave={update} onDelete={remove} busy={busy} scopeLabel={scopeLabel} />
          ))}
          {initial.length === 0 && (
            <li className="px-5 py-10 text-center text-sm text-ink-muted">—</li>
          )}
        </ul>
      </section>
    </div>
  );
}

function CategoryRowItem({
  row,
  onSave,
  onDelete,
  busy,
  scopeLabel,
}: {
  row: CategoryRow;
  onSave: (r: CategoryRow) => void;
  onDelete: (id: string) => void;
  busy: boolean;
  scopeLabel: (s: CategoryRow["scope"]) => string;
}) {
  const tf = useTranslations("admin.form");
  const [edit, setEdit] = useState(row);
  const dirty = edit.namePt !== row.namePt || edit.scope !== row.scope;

  return (
    <li className="grid grid-cols-1 items-end gap-3 px-5 py-4 sm:grid-cols-12">
      <input
        className="border-0 border-b border-transparent bg-transparent py-1 font-serif text-base text-ink focus:border-stone-300 focus:outline-none sm:col-span-7"
        value={edit.namePt}
        onChange={(e) => setEdit({ ...edit, namePt: e.target.value })}
      />
      <select
        value={edit.scope}
        onChange={(e) => setEdit({ ...edit, scope: e.target.value as CategoryRow["scope"] })}
        className="border border-stone-200 bg-white px-2 py-1.5 text-xs text-ink focus:outline-none sm:col-span-3"
      >
        {SCOPES.map((s) => (
          <option key={s} value={s}>
            {scopeLabel(s)}
          </option>
        ))}
      </select>
      <div className="flex items-center justify-end gap-3 text-xs sm:col-span-2">
        {dirty && (
          <button
            onClick={() => onSave(edit)}
            disabled={busy}
            className="uppercase tracking-widest text-ink hover:underline"
          >
            {tf("save")}
          </button>
        )}
        <button
          onClick={() => onDelete(row.id)}
          disabled={busy}
          className="uppercase tracking-widest text-red-700/80 hover:text-red-700"
        >
          {tf("remove")}
        </button>
      </div>
    </li>
  );
}
