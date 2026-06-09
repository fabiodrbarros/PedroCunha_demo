import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { guardApi, badRequest, notFoundJson } from "@/lib/api";
import {
  getProjectByIdAdmin,
  updateProject,
  deleteProject,
  setProjectPublished,
} from "@/lib/services";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const denied = await guardApi();
  if (denied) return denied;
  const { id } = await params;
  const item = await getProjectByIdAdmin(id);
  if (!item) return notFoundJson();
  return NextResponse.json({ data: item });
}

export async function PUT(req: NextRequest, { params }: Params) {
  const denied = await guardApi();
  if (denied) return denied;
  const { id } = await params;
  try {
    const body = await req.json();
    if (Object.keys(body).length === 1 && typeof body.published === "boolean") {
      const updated = await setProjectPublished(id, body.published);
      return NextResponse.json({ data: updated });
    }
    const updated = await updateProject(id, body);
    return NextResponse.json({ data: updated });
  } catch (e) {
    if (e instanceof ZodError) return badRequest("Validation failed", e.flatten());
    console.error(e);
    return badRequest("Could not update project");
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const denied = await guardApi();
  if (denied) return denied;
  const { id } = await params;
  try {
    await deleteProject(id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return badRequest("Could not delete project");
  }
}
