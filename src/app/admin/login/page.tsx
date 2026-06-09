import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { LoginForm } from "./LoginForm";
import { Monogram } from "@/components/brand/Monogram";

export default async function LoginPage() {
  const session = await getSession();
  if (session) redirect("/admin/dashboard");

  return (
    <main className="flex min-h-screen items-center justify-center bg-paper-warm px-6">
      <div className="w-full max-w-sm">
        <div className="mb-10 flex flex-col items-center text-center">
          <Monogram className="h-12 w-12 text-ink" strokeWidth={2} />
          <h1 className="mt-6 font-serif text-2xl font-light text-ink">Pedro Cunha Carpintaria</h1>
        </div>
        <div className="border border-stone-200 bg-white p-8 shadow-sm">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
