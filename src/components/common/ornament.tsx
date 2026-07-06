import { cn } from "@/lib/utils";

/**
 * Ornamental divider — a gold line with a small center diamond, echoing the
 * flourish used across the mockups. Purely decorative.
 */
export function Ornament({
  className,
  width = "md",
}: {
  className?: string;
  width?: "sm" | "md" | "lg";
}) {
  const widths = { sm: "w-16", md: "w-28", lg: "w-40" };
  return (
    <span
      aria-hidden="true"
      className={cn("inline-flex items-center gap-2 text-gold-500", className)}
    >
      <span className={cn("h-px bg-current", widths[width])} />
      <span className="size-1.5 rotate-45 bg-current" />
      <span className={cn("h-px bg-current", widths[width])} />
    </span>
  );
}
