import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * The official P/C monogram, extracted directly from /logo.png
 * (public/monogram.png). It is never redrawn — only scaled, and optionally
 * tinted white (for dark backgrounds) or faded via opacity utilities passed
 * through `className`. Size + opacity come from `className` (e.g. "h-6 w-6",
 * "opacity-60").
 */
export function Monogram({
  className,
  tone = "ink",
  title,
}: {
  className?: string;
  tone?: "ink" | "white";
  title?: string;
  /** accepted for backwards-compat; the real mark has fixed stroke weights */
  strokeWidth?: number;
}) {
  return (
    <span
      className={cn("relative inline-block", className)}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <Image
        src="/monogram.png"
        alt={title ?? ""}
        fill
        sizes="320px"
        className={cn(
          "object-contain",
          tone === "white" && "[filter:brightness(0)_invert(1)]"
        )}
      />
    </span>
  );
}
