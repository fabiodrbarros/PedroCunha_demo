import "server-only";
import { NextResponse } from "next/server";
import { getSession } from "./session";

/** Guard for admin API routes. Returns null if authorized, else a 401 response. */
export async function guardApi(): Promise<NextResponse | null> {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export function badRequest(message: string, details?: unknown) {
  return NextResponse.json({ error: message, details }, { status: 400 });
}

export function notFoundJson(message = "Not found") {
  return NextResponse.json({ error: message }, { status: 404 });
}
