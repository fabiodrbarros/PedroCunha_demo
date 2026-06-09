"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { MonogramFallback } from "@/components/brand/MonogramFallback";

/**
 * next/image wrapper that degrades to the brand monogram when the source
 * is missing or fails to load — so a dead photo URL never shows a broken
 * image, it shows the P/C mark on warm paper instead.
 */
export function SafeImage({
  fallbackClassName,
  src,
  ...props
}: Omit<ImageProps, "src"> & { src?: string; fallbackClassName?: string }) {
  const [errored, setErrored] = useState(false);

  if (!src || errored) {
    return <MonogramFallback className={fallbackClassName} />;
  }

  return <Image src={src} {...props} onError={() => setErrored(true)} />;
}
