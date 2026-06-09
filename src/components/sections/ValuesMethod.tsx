import { useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "./SectionHeader";
import { MonogramDivider } from "@/components/brand/MonogramDivider";

const STEPS = ["consult", "design", "production", "install"] as const;

export function ValuesMethod() {
  const tp = useTranslations("home.process");

  return (
    <section className="section bg-paper pt-0">
      <div className="container">
        {/* Divider with the monogram */}
        <MonogramDivider className="mb-16 md:mb-20" />

        {/* Method */}
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <SectionHeader eyebrow={tp("eyebrow")} title={tp("title")} lead={tp("lead")} />
          </div>

          <div className="lg:col-span-8">
            <ol className="grid grid-cols-1 sm:grid-cols-2">
              {STEPS.map((step, i) => (
                <Reveal
                  key={step}
                  delay={i}
                  as="li"
                  className="group relative border-t border-stone-300 py-9 sm:odd:pr-10 sm:even:border-l sm:even:pl-10"
                >
                  <div className="flex items-baseline gap-5">
                    <span className="nums font-serif text-3xl font-light text-stone-300 transition-colors duration-500 group-hover:text-ink">
                      {tp(`steps.${step}.n`)}
                    </span>
                    <div>
                      <h3 className="font-serif text-xl font-light text-ink">
                        {tp(`steps.${step}.title`)}
                      </h3>
                      <p className="mt-3 max-w-xs text-pretty text-sm leading-relaxed text-ink-muted">
                        {tp(`steps.${step}.text`)}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
