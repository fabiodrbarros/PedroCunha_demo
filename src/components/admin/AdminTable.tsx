"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export type AdminRow = {
  id: string;
  title: string;
  categoryName?: string | null;
  published: boolean;
  featured: boolean;
  updatedAt: string;
};

export function AdminTable({
  rows,
  type,
}: {
  rows: AdminRow[];
  type: "catalog" | "projects";
}) {
  const t = useTranslations("admin.table");
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);

  const endpoint = (id: string) => `/api/admin/${type}/${id}`;

  async function togglePublish(row: AdminRow) {
    setBusyId(row.id);
    await fetch(endpoint(row.id), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !row.published }),
    });
    setBusyId(null);
    startTransition(() => router.refresh());
  }

  async function remove(row: AdminRow) {
    if (!confirm(t("confirmDelete"))) return;
    setBusyId(row.id);
    await fetch(endpoint(row.id), { method: "DELETE" });
    setBusyId(null);
    startTransition(() => router.refresh());
  }

  if (rows.length === 0) {
    return (
      <div className="border border-stone-200 bg-white px-6 py-16 text-center text-sm text-ink-muted">
        {t("empty")}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-stone-200 bg-white">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-stone-200 text-[0.62rem] uppercase tracking-widest text-stone-400">
            <th className="px-5 py-4 font-medium">{t("title")}</th>
            <th className="px-5 py-4 font-medium">{t("category")}</th>
            <th className="px-5 py-4 font-medium">{t("status")}</th>
            <th className="px-5 py-4 text-right font-medium">{t("actions")}</th>
          </tr>
        </thead>
        <tbody className={cn("divide-y divide-stone-100", pending && "opacity-60")}>
          {rows.map((row) => (
            <tr key={row.id} className="group">
              <td className="px-5 py-4">
                <Link
                  href={`/pc-guest-admin/${type}/${row.id}`}
                  className="font-serif text-base font-light text-ink hover:underline"
                >
                  {row.title}
                </Link>
                {row.featured && (
                  <span className="ml-2 text-[0.6rem] uppercase tracking-widest text-accent">
                    ◦ {t("featured")}
                  </span>
                )}
              </td>
              <td className="px-5 py-4 text-ink-muted">{row.categoryName ?? "—"}</td>
              <td className="px-5 py-4">
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 text-xs",
                    row.published ? "text-ink" : "text-stone-400"
                  )}
                >
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      row.published ? "bg-ink" : "bg-stone-300"
                    )}
                  />
                  {row.published ? t("published") : t("draft")}
                </span>
              </td>
              <td className="px-5 py-4">
                <div className="flex items-center justify-end gap-4 text-xs">
                  <button
                    onClick={() => togglePublish(row)}
                    disabled={busyId === row.id}
                    className="uppercase tracking-widest text-ink-muted hover:text-ink disabled:opacity-40"
                  >
                    {row.published ? t("unpublish") : t("publish")}
                  </button>
                  <Link
                    href={`/pc-guest-admin/${type}/${row.id}`}
                    className="uppercase tracking-widest text-ink-muted hover:text-ink"
                  >
                    {t("edit")}
                  </Link>
                  <button
                    onClick={() => remove(row)}
                    disabled={busyId === row.id}
                    className="uppercase tracking-widest text-red-700/80 hover:text-red-700 disabled:opacity-40"
                  >
                    {t("delete")}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
