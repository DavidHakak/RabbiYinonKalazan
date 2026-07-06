import { cn } from "@/lib/utils";

/**
 * The brand emblem — a stylized flame rising from a fluted pillar, echoing the
 * "light of Torah / wisdom" motif. Pure SVG, inherits `currentColor` so it can
 * be tinted gold on light surfaces or on the navy header/footer.
 */
export function BrandMark({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 48 48"
      role="img"
      aria-hidden="true"
      className={cn("h-9 w-9", className)}
      fill="none"
      {...props}
    >
      {/* Flame */}
      <path
        d="M24 4c2.6 4.2 6 6.6 6 10.4a6 6 0 0 1-12 0c0-2.1 1-3.7 2.4-5.6C21.7 7.3 23 6 24 4Z"
        fill="currentColor"
      />
      <path
        d="M24 9.5c1.4 2.3 2.9 3.6 2.9 5.6a2.9 2.9 0 0 1-5.8 0c0-1.6 1.3-3.2 2.9-5.6Z"
        className="fill-background/70"
      />
      {/* Capital */}
      <rect x="17.5" y="22" width="13" height="2.6" rx="1.3" fill="currentColor" />
      {/* Fluted column */}
      <path
        d="M19 25h10v11h-10z"
        fill="currentColor"
        fillOpacity="0.9"
      />
      <path
        d="M22 25v11M24 25v11M26 25v11"
        stroke="currentColor"
        strokeOpacity="0.35"
        strokeWidth="0.9"
        className="stroke-background"
      />
      {/* Base */}
      <rect x="15" y="36.5" width="18" height="2.8" rx="1.4" fill="currentColor" />
      <rect x="13.5" y="40" width="21" height="3" rx="1.5" fill="currentColor" />
    </svg>
  );
}
