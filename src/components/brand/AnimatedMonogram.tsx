"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * The official P/C monogram (public/monogram.png, extracted from /logo.png),
 * revealed with a soft fade + scale on mount. Never redrawn.
 */
export function AnimatedMonogram({
  className,
  tone = "ink",
}: {
  className?: string;
  tone?: "ink" | "white";
  strokeWidth?: number;
}) {
  return (
    <motion.span
      className={cn("relative inline-block", className)}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
      aria-hidden
    >
      <Image
        src="/monogram.png"
        alt=""
        fill
        sizes="120px"
        className={cn(
          "object-contain",
          tone === "white" && "[filter:brightness(0)_invert(1)]"
        )}
      />
    </motion.span>
  );
}
