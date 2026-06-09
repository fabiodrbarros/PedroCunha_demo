import Link from "next/link";
import "./globals.css";

// Global fallback 404 (outside the locale tree). Renders its own shell.
export default function GlobalNotFound() {
  return (
    <html lang="pt">
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <main className="flex min-h-screen items-center justify-center">
          <div className="container flex flex-col items-center text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/monogram.png" alt="" className="h-16 w-16 object-contain" aria-hidden />
            <p className="mt-10 font-serif text-7xl font-light text-stone-300">404</p>
            <h1 className="mt-6 font-serif text-3xl font-light text-ink">Página não encontrada</h1>
            <Link
              href="/pt"
              className="mt-10 inline-flex h-11 items-center bg-ink px-7 text-sm text-paper-warm transition-colors hover:bg-ink-soft"
            >
              Voltar ao início
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
