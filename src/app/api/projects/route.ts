import { NextRequest, NextResponse } from "next/server";
import { getProjects } from "@/lib/queries";
import { routing, type Locale } from "@/i18n/routing";

// GET /api/projects?locale=pt&category=residential&search=...
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const localeParam = searchParams.get("locale");
  const locale: Locale = routing.locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : routing.defaultLocale;

  const items = await getProjects(locale, {
    categorySlug: searchParams.get("category") ?? undefined,
    search: searchParams.get("search") ?? undefined,
  });

  return NextResponse.json({ data: items, count: items.length });
}
