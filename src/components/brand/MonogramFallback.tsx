import { Monogram } from "./Monogram";
import { cn } from "@/lib/utils";

/**
 * Brand-aware placeholder used whenever a piece or project has no cover
 * image. Never a generic grey box — always the P/C monogram on warm paper.
 */
export function MonogramFallback({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center bg-paper-warm grid-lines",
        className
      )}
      aria-hidden
    >
      <Monogram className="h-1/4 w-1/4 max-h-20 max-w-20 opacity-25" />
    </div>
  );
}
