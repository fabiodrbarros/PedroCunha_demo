import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { NAV_LINKS } from "./nav-config";
import { SITE } from "@/lib/site";

export function Footer() {
  const t = useTranslations();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-ink bg-ink text-white/45">
      <div className="container pb-10 pt-16 md:pb-12 md:pt-20">
        <div className="grid gap-14 md:grid-cols-12">
          {/* Brand */}
          <div className="md:col-span-5">
            {/* whitespace-trimmed logo so its left edge aligns with the page grid */}
            <Image
              src="/logo-mark.png"
              alt="Pedro Cunha Carpintaria"
              width={494}
              height={357}
              className="h-auto w-40 select-none opacity-45 [filter:brightness(0)_invert(1)]"
            />
            <p className="mt-7 max-w-xs text-pretty text-sm leading-relaxed text-white/45">
              {t("hero.lead")}
            </p>
            <div className="mt-9 text-white/45">
              <span className="text-[0.65rem] uppercase tracking-widest">
                {t("footer.credit")}
              </span>
            </div>
          </div>

          {/* Explore */}
          <nav className="md:col-span-3">
            <h3 className="text-[0.7rem] uppercase tracking-widest text-white/45">
              {t("footer.explore")}
            </h3>
            <ul className="mt-6 space-y-3">
              {NAV_LINKS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="link-underline text-sm text-white/45 transition-colors hover:text-paper"
                  >
                    {t(`nav.${item.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Studio / contact */}
          <div className="md:col-span-4">
            <h3 className="text-[0.7rem] uppercase tracking-widest text-white/45">
              {t("footer.studio")}
            </h3>
            <ul className="mt-6 space-y-3 text-sm text-white/45">
              <li>
                <a href={`tel:${SITE.phoneRaw}`} className="link-underline hover:text-paper">
                  {SITE.phone}
                </a>
                <span className="ml-2 text-[0.7rem] text-white/45">
                  {t("contact.info.phoneNote")}
                </span>
              </li>
              <li>
                <a href={`mailto:${SITE.email}`} className="link-underline hover:text-paper">
                  {SITE.email}
                </a>
              </li>
              <li className="text-white/45">
                {t("contact.info.addressValue")
                  .split(" · ")
                  .map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom rule */}
        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-7 text-[0.7rem] uppercase tracking-widest text-white/45 md:flex-row md:items-center md:justify-between">
          <span>
            © {year} {t("meta.siteName")}
          </span>
          <a
            href="https://www.livroreclamacoes.pt/inicio/"
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline transition-colors hover:text-paper"
          >
            {t("footer.complaints")}
          </a>
          <span>{SITE.address.locality}, Portugal</span>
        </div>
      </div>
    </footer>
  );
}
