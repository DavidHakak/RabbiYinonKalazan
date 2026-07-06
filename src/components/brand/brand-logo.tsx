import Image from "next/image";

import { cn } from "@/lib/utils";

interface BrandLogoProps {
  /** Rendered box size in pixels (square). Defaults to 40. */
  size?: number;
  priority?: boolean;
  className?: string;
}

/**
 * The Rabbi's circular brand emblem (YK monogram · flame · open book) as a
 * raster image. Replaces the placeholder SVG mark now that the real logo
 * exists. The PNG already carries its own light circular field with
 * transparent corners, so it drops onto any surface as a self-contained badge.
 */
export function BrandLogo({ size = 40, priority = false, className }: BrandLogoProps) {
  return (
    <Image
      src="/images/logo.png"
      alt="הרב ינון קלזאן"
      width={size}
      height={size}
      priority={priority}
      sizes={`${size}px`}
      className={cn("shrink-0 rounded-full object-contain", className)}
    />
  );
}
