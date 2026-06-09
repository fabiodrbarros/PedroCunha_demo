import type { ReactNode } from "react";
import { Reveal } from "@/components/ui/reveal";
import { Monogram } from "@/components/brand/Monogram";
import { cn } from "@/lib/utils";

export function PageIntro({
  eyebrow,
  title,
  lead,
  markClassName = "right-4 top-28 h-44 w-44",
  bordered = true,
  sectionClassName,
  children,
}: {
  eyebrow?: string;
  title?: string;
  lead?: string;
  /** position/size utilities for the decorative monogram */
  markClassName?: string;
  /** draw the hairline divider at the bottom of the header */
  bordered?: boolean;
  /** extra utilities for the header section (e.g. min-height) */
  sectionClassName?: string;
  /** extra content rendered below the heading (e.g. action buttons) */
  children?: ReactNode;
}) {
  // When there's no big title, the small eyebrow carries the page heading (h1).
  const EyebrowTag = title ? "span" : "h1";

  return (
    <section
      className={cn(
        "relative overflow-hidden pt-[calc(var(--header-h)+1.5rem)]",
        bordered && "border-b border-stone-200",
        sectionClassName
      )}
    >
      <Monogram className={cn("pointer-events-none absolute opacity-[0.07]", markClassName)} />
      <div className="container relative pb-10 pt-8 md:pb-14 md:pt-10">
        {eyebrow && (
          <Reveal>
            <EyebrowTag className="eyebrow">{eyebrow}</EyebrowTag>
          </Reveal>
        )}
        {title && (
          <Reveal delay={1}>
            <h1 className="mt-5 max-w-3xl text-balance font-serif text-display-lg font-light leading-[1.02] text-ink">
              {title}
            </h1>
          </Reveal>
        )}
        {lead && (
          <Reveal delay={2}>
            <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-ink-muted">
              {lead}
            </p>
          </Reveal>
        )}
        {children}
      </div>
    </section>
  );
}
