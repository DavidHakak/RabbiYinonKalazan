import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

import { BrandMark } from "./brand-mark";

interface LogoProps {
  name: string;
  tagline?: string;
  href?: string;
  /** Color context — controls text color. Mark is always gold. */
  tone?: "light" | "dark";
  className?: string;
}

/** Clickable brand lockup: emblem + wordmark (+ optional tagline). */
export function Logo({
  name,
  tagline,
  href = "/",
  tone = "dark",
  className,
}: LogoProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-3 transition-opacity hover:opacity-90",
        className,
      )}
    >
      <BrandMark className="h-10 w-10 shrink-0 text-gold-500" />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-serif text-lg font-bold tracking-tight",
            tone === "light" ? "text-cream-100" : "text-navy-900",
          )}
        >
          {name}
        </span>
        {tagline ? (
          <span
            className={cn(
              "mt-1 text-[0.7rem] font-medium",
              tone === "light" ? "text-cream-300/80" : "text-muted-foreground",
            )}
          >
            {tagline}
          </span>
        ) : null}
      </span>
    </Link>
  );
}
