import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Monogram } from "@/components/brand/Monogram";

export default function NotFound() {
  const t = useTranslations("notFound");
  return (
    <section className="flex min-h-[80vh] items-center pt-[var(--header-h)]">
      <div className="container flex flex-col items-center text-center">
        <Monogram className="h-16 w-16 text-ink" strokeWidth={1.6} />
        <p className="nums mt-10 font-serif text-7xl font-light text-stone-300">404</p>
        <h1 className="mt-6 font-serif text-display-md font-light text-ink">{t("title")}</h1>
        <p className="mt-4 max-w-md text-ink-muted">{t("lead")}</p>
        <Button asChild className="mt-10">
          <Link href="/">{t("cta")}</Link>
        </Button>
      </div>
    </section>
  );
}
