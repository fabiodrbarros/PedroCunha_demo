import type { ReactNode } from "react";

// Root layout is a pass-through. The <html>/<body> tags are rendered by the
// locale layout ([locale]/layout.tsx) and the admin layout (admin/layout.tsx),
// which lets localized and non-localized routes coexist.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
