import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/pc-guest-admin/login");

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <AdminSidebar username={session.sub} />
      <main className="flex-1 bg-stone-50 px-6 py-10 lg:px-12 lg:py-14">
        <div className="mx-auto max-w-5xl">{children}</div>
      </main>
    </div>
  );
}
