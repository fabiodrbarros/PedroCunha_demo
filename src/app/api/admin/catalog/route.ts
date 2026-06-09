import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { guardApi, badRequest } from "@/lib/api";
import { listCatalogAdmin, createCatalogItem } from "@/lib/services";

// GET /api/admin/catalog — all items (incl. drafts)
export async function GET() {
  const denied = await guardApi();
  if (denied) return denied;
  const items = await listCatalogAdmin();
  return NextResponse.json({ data: items });
}

// POST /api/admin/catalog — create
export async function POST(req: NextRequest) {
  const denied = await guardApi();
  if (denied) return denied;
  try {
    const body = await req.json();
    const created = await createCatalogItem(body);
    return NextResponse.json({ data: created }, { status: 201 });
  } catch (e) {
    if (e instanceof ZodError) return badRequest("Validation failed", e.flatten());
    console.error(e);
    return badRequest("Could not create catalog item");
  }
}
