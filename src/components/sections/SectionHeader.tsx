import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function SectionHeader({
  eyebrow,
  title,
  lead,
  align = "left",
  className,
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: string;
  align?: "left" | "center";
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className
      )}
    >
      {eyebrow && (
        <Reveal>
          <span className="eyebrow">{eyebrow}</span>
        </Reveal>
      )}
      <Reveal delay={1}>
        <h2 className="max-w-3xl text-balance font-serif text-display-md font-light text-ink">
          {title}
        </h2>
      </Reveal>
      {lead && (
        <Reveal delay={2}>
          <p
            className={cn(
              "max-w-xl text-pretty text-base leading-relaxed text-ink-muted",
              align === "center" && "mx-auto"
            )}
          >
            {lead}
          </p>
        </Reveal>
      )}
      {children}
    </div>
  );
}
