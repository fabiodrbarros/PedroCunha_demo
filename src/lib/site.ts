/** Static brand / contact configuration shared across the site. */
export const SITE = {
  name: "Pedro Cunha Carpintaria",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  email: "geral@pedrocunhacarpintaria.pt",
  phone: "+351 963 580 348",
  phoneRaw: "+351963580348",
  address: {
    locality: "Ponte de Lima",
    region: "Viana do Castelo",
    country: "PT",
  },
  instagram: {
    handle: "@pedrocunhacarpintaria",
    url: "https://www.instagram.com/pedrocunhacarpintaria/",
  },
  socials: [
    { label: "Instagram", href: "https://www.instagram.com/pedrocunhacarpintaria/" },
  ],
} as const;
