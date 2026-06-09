"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export function ImageUploader({
  value,
  onChange,
}: {
  value: string[];
  onChange: (urls: string[]) => void;
}) {
  const t = useTranslations("admin.form");
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);
    const form = new FormData();
    Array.from(files).forEach((f) => form.append("files", f));
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: form });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Upload failed");
      onChange([...value, ...(json.urls as string[])]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function remove(url: string) {
    onChange(value.filter((u) => u !== url));
  }
  function makeCover(url: string) {
    onChange([url, ...value.filter((u) => u !== url)]);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="text-[0.65rem] uppercase tracking-widest text-stone-400">
          {t("imagesHint")}
        </span>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="text-xs uppercase tracking-widest text-ink hover:underline disabled:opacity-50"
        >
          {uploading ? t("uploading") : `+ ${t("upload")}`}
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/avif"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {error && <p className="mt-2 text-xs text-red-700">{error}</p>}

      {value.length > 0 ? (
        <ul className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {value.map((url, i) => (
            <li key={url} className="group relative aspect-square overflow-hidden border border-stone-200 bg-stone-100">
              <Image src={url} alt="" fill sizes="160px" className="object-cover" />
              {i === 0 && (
                <span className="absolute left-1 top-1 bg-ink px-1.5 py-0.5 text-[0.55rem] uppercase tracking-widest text-paper-warm">
                  Cover
                </span>
              )}
              <div className="absolute inset-0 flex items-end justify-between gap-1 bg-ink/0 p-1.5 opacity-0 transition-all group-hover:bg-ink/40 group-hover:opacity-100">
                {i !== 0 && (
                  <button
                    type="button"
                    onClick={() => makeCover(url)}
                    className="bg-white/90 px-1.5 py-0.5 text-[0.55rem] uppercase tracking-widest text-ink"
                  >
                    Cover
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => remove(url)}
                  className="ml-auto bg-white/90 px-1.5 py-0.5 text-[0.55rem] uppercase tracking-widest text-red-700"
                >
                  {t("remove")}
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={cn(
            "mt-4 flex aspect-[3/1] w-full items-center justify-center border border-dashed border-stone-300 text-sm text-stone-400 transition-colors hover:border-ink hover:text-ink"
          )}
        >
          {t("upload")}
        </button>
      )}
    </div>
  );
}
