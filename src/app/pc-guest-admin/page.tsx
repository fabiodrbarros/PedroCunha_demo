import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

export default async function AdminIndex() {
  const session = await getSession();
  redirect(session ? "/pc-guest-admin/dashboard" : "/pc-guest-admin/login");
}
