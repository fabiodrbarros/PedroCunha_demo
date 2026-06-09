import { Link } from "@/i18n/navigation";
import { Monogram } from "@/components/brand/Monogram";
import { SafeImage } from "@/components/ui/safe-image";
import { cn } from "@/lib/utils";

export type WorkCardData = {
  slug: string;
  title: string;
  cover?: string;
  category?: { name: string } | null;
  meta?: string; // e.g. location · year
  featured?: boolean;
};

export function WorkCard({
  item,
  type,
  index = 0,
  priority = false,
  className,
  aspectClassName = "aspect-[4/5]",
}: {
  item: WorkCardData;
  type: "catalog" | "project";
  index?: number;
  priority?: boolean;
  className?: string;
  /** image aspect ratio (object-cover crops to this) */
  aspectClassName?: string;
}) {
  const href =
    type === "catalog"
      ? { pathname: "/catalogo/[slug]" as const, params: { slug: item.slug } }
      : { pathname: "/projetos/[slug]" as const, params: { slug: item.slug } };

  return (
    <Link href={href} className={cn("group block", className)}>
      <article>
        <div className={cn("relative overflow-hidden bg-paper-warm", aspectClassName)}>
          <SafeImage
            src={item.cover}
            alt={item.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={priority}
            className="object-cover transition-transform duration-[1200ms] ease-brand group-hover:scale-[1.04]"
          />

          {/* hover veil + monogram corner mark derived from the logo */}
          <div className="pointer-events-none absolute inset-0 bg-ink/0 transition-colors duration-700 group-hover:bg-ink/[0.06]" />
          <div className="pointer-events-none absolute right-5 top-5 translate-y-1 opacity-0 transition-all duration-500 ease-brand group-hover:translate-y-0 group-hover:opacity-100">
            <Monogram tone="white" className="h-6 w-6 drop-shadow" />
          </div>

          {item.featured && (
            <span className="absolute left-5 top-5 text-[0.6rem] uppercase tracking-widest text-paper mix-blend-difference">
              ◦
            </span>
          )}
        </div>

        <div className="pt-3.5">
          {item.category && (
            <span className="text-[0.6rem] uppercase tracking-widest text-stone-400">
              {item.category.name}
            </span>
          )}
          <h3 className="mt-1 font-serif text-base font-light leading-snug text-ink transition-colors">
            {item.title}
          </h3>
          {item.meta && (
            <span className="nums mt-1.5 block text-[0.62rem] uppercase tracking-widest text-stone-400">
              {item.meta}
            </span>
          )}
        </div>
        <span className="mt-3 block h-px w-full origin-left scale-x-0 bg-ink transition-transform duration-700 ease-brand group-hover:scale-x-100" />
      </article>
    </Link>
  );
}
