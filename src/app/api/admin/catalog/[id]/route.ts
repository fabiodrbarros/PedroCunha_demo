import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { guardApi, badRequest, notFoundJson } from "@/lib/api";
import {
  getCatalogByIdAdmin,
  updateCatalogItem,
  deleteCatalogItem,
  setCatalogPublished,
} from "@/lib/services";

type Params = { params: Promise<{ id: string }> };

// GET single (admin)
export async function GET(_req: NextRequest, { params }: Params) {
  const denied = await guardApi();
  if (denied) return denied;
  const { id } = await params;
  const item = await getCatalogByIdAdmin(id);
  if (!item) return notFoundJson();
  return NextResponse.json({ data: item });
}

// PUT /api/admin/catalog/:id — full update, or { published } toggle
export async function PUT(req: NextRequest, { params }: Params) {
  const denied = await guardApi();
  if (denied) return denied;
  const { id } = await params;
  try {
    const body = await req.json();
    if (Object.keys(body).length === 1 && typeof body.published === "boolean") {
      const updated = await setCatalogPublished(id, body.published);
      return NextResponse.json({ data: updated });
    }
    const updated = await updateCatalogItem(id, body);
    return NextResponse.json({ data: updated });
  } catch (e) {
    if (e instanceof ZodError) return badRequest("Validation failed", e.flatten());
    console.error(e);
    return badRequest("Could not update catalog item");
  }
}

// DELETE /api/admin/catalog/:id
export async function DELETE(_req: NextRequest, { params }: Params) {
  const denied = await guardApi();
  if (denied) return denied;
  const { id } = await params;
  try {
    await deleteCatalogItem(id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return badRequest("Could not delete catalog item");
  }
}
