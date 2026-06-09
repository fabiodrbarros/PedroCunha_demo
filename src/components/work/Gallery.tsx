"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { MonogramFallback } from "@/components/brand/MonogramFallback";
import { SafeImage } from "@/components/ui/safe-image";
import { cn } from "@/lib/utils";

export function Gallery({
  images,
  title,
  mainClassName = "aspect-[4/3]",
}: {
  images: string[];
  title: string;
  /** sizing utilities for the main image (e.g. a max-height cap) */
  mainClassName?: string;
}) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  if (images.length === 0) {
    return (
      <div className={cn("relative w-full overflow-hidden", mainClassName)}>
        <MonogramFallback />
      </div>
    );
  }

  return (
    <div>
      {/* Main image */}
      <button
        type="button"
        onClick={() => setLightbox(true)}
        className={cn(
          "group relative block w-full cursor-zoom-in overflow-hidden bg-paper-warm",
          mainClassName
        )}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <SafeImage
              src={images[active]}
              alt={`${title} — ${active + 1}`}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 66vw"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>
      </button>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="mt-4 grid grid-cols-5 gap-3 sm:grid-cols-6">
          {images.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "relative aspect-square overflow-hidden bg-paper-warm transition-opacity duration-300",
                active === i ? "opacity-100" : "opacity-50 hover:opacity-90"
              )}
            >
              <Image src={src} alt="" fill sizes="120px" className="object-cover" />
              <span
                className={cn(
                  "absolute inset-x-0 bottom-0 h-px origin-left bg-ink transition-transform duration-300",
                  active === i ? "scale-x-100" : "scale-x-0"
                )}
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(false)}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/95 p-6 backdrop-blur-sm"
          >
            <button
              type="button"
              onClick={() => setLightbox(false)}
              className="absolute right-6 top-6 text-[0.7rem] uppercase tracking-widest text-paper-warm/70 hover:text-paper-warm"
            >
              ✕ Close
            </button>
            <motion.div
              initial={{ scale: 0.96 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.96 }}
              transition={{ ease: [0.22, 1, 0.36, 1] }}
              className="relative h-[80vh] w-full max-w-5xl"
            >
              <Image
                src={images[active]}
                alt={title}
                fill
                sizes="90vw"
                className="object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
