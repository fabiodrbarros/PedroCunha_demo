import "server-only";

/**
 * Lightweight PT → EN/FR translation for admin content, so the client only
 * ever writes in Portuguese. Uses the public Google translate endpoint
 * (no API key). Best-effort: on any failure it falls back to the source text.
 */
const ENDPOINT = "https://translate.googleapis.com/translate_a/single";

async function translateOne(text: string, target: "en" | "fr"): Promise<string> {
  const trimmed = text.trim();
  if (!trimmed) return text;
  try {
    const url = `${ENDPOINT}?client=gtx&sl=pt&tl=${target}&dt=t&q=${encodeURIComponent(trimmed)}`;
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
      // never cache translations
      cache: "no-store",
    });
    if (!res.ok) return text;
    const data = (await res.json()) as [Array<[string]>, ...unknown[]];
    const out = data[0]?.map((seg) => seg[0]).join("");
    return out || text;
  } catch {
    return text;
  }
}

/** Translate a single Portuguese string into EN and FR. */
export async function translatePt(text: string): Promise<{ en: string; fr: string }> {
  const [en, fr] = await Promise.all([translateOne(text, "en"), translateOne(text, "fr")]);
  return { en, fr };
}

/** Translate an optional field; empty/undefined stays empty. */
export async function translatePtOptional(
  text: string | null | undefined
): Promise<{ en: string | null; fr: string | null }> {
  if (!text || !text.trim()) return { en: null, fr: null };
  const { en, fr } = await translatePt(text);
  return { en, fr };
}
