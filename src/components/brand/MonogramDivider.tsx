import { Monogram } from "./Monogram";
import { cn } from "@/lib/utils";

/**
 * Section divider echoing the rule beneath the wordmark in the logo:
 * two hairlines flanking the P/C monogram.
 */
export function MonogramDivider({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-6 text-ink", className)} aria-hidden>
      <span className="h-px flex-1 bg-stone-200" />
      <Monogram className="h-6 w-6 opacity-70" />
      <span className="h-px flex-1 bg-stone-200" />
    </div>
  );
}
