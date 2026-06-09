"use server";

import { redirect } from "next/navigation";
import { loginSchema } from "@/lib/validations";
import { verifyCredentials } from "@/lib/auth";
import { createSession, destroySession } from "@/lib/session";

export type LoginState = { error?: boolean };

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { error: true };

  const ok = await verifyCredentials(parsed.data.username, parsed.data.password);
  if (!ok) return { error: true };

  await createSession(parsed.data.username);
  redirect("/admin/dashboard");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}
