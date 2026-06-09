// Static (non-dynamic) navigation routes. Typed narrowly so they can be
// passed directly to next-intl's <Link href> without route params.
export type StaticPath =
  | "/"
  | "/catalogo"
  | "/projetos"
  | "/sobre"
  | "/contacto";

export const NAV_LINKS: { href: StaticPath; key: string }[] = [
  { href: "/catalogo", key: "catalog" },
  { href: "/projetos", key: "projects" },
  { href: "/sobre", key: "about" },
  { href: "/contacto", key: "contact" },
];
