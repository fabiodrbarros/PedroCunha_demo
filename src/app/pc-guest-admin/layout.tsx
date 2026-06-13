import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { fontVariables } from "@/app/fonts";
import "../globals.css";

export const metadata: Metadata = {
  title: "Admin · Pedro Cunha Carpintaria",
  robots: { index: false, follow: false },
};

// Admin runs outside the localized tree; it always uses the default locale (pt).
export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const messages = await getMessages();
  return (
    <html lang="pt" className={fontVariables} suppressHydrationWarning>
      <body className="min-h-screen bg-stone-50 font-sans text-ink antialiased">
        <NextIntlClientProvider locale="pt" messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
