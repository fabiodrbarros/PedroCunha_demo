import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * The official Pedro Cunha Carpintaria logo, always rendered from /logo.png.
 * Never redrawn or substituted — only scaled proportionally.
 */
export function Logo({
  className,
  priority = false,
  width = 200,
}: {
  className?: string;
  priority?: boolean;
  width?: number;
}) {
  // logo.png intrinsic ratio is 1536 × 1024 (3:2)
  const height = Math.round((width * 1024) / 1536);
  return (
    <Image
      src="/logo.png"
      alt="Pedro Cunha Carpintaria"
      width={width}
      height={height}
      priority={priority}
      className={cn("h-auto w-auto select-none", className)}
    />
  );
}
