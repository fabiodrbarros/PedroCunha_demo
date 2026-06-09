import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { guardApi, badRequest } from "@/lib/api";
import { listProjectsAdmin, createProject } from "@/lib/services";

// GET /api/admin/projects — all (incl. drafts)
export async function GET() {
  const denied = await guardApi();
  if (denied) return denied;
  const items = await listProjectsAdmin();
  return NextResponse.json({ data: items });
}

// POST /api/admin/projects — create
export async function POST(req: NextRequest) {
  const denied = await guardApi();
  if (denied) return denied;
  try {
    const body = await req.json();
    const created = await createProject(body);
    return NextResponse.json({ data: created }, { status: 201 });
  } catch (e) {
    if (e instanceof ZodError) return badRequest("Validation failed", e.flatten());
    console.error(e);
    return badRequest("Could not create project");
  }
}
