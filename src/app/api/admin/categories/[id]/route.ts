import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { guardApi, badRequest } from "@/lib/api";
import { updateCategory, deleteCategory } from "@/lib/services";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: Params) {
  const denied = await guardApi();
  if (denied) return denied;
  const { id } = await params;
  try {
    const body = await req.json();
    const updated = await updateCategory(id, body);
    return NextResponse.json({ data: updated });
  } catch (e) {
    if (e instanceof ZodError) return badRequest("Validation failed", e.flatten());
    console.error(e);
    return badRequest("Could not update category");
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const denied = await guardApi();
  if (denied) return denied;
  const { id } = await params;
  try {
    await deleteCategory(id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return badRequest("Could not delete category (it may be in use)");
  }
}
