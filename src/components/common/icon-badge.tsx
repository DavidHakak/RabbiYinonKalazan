import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const sizeMap = {
  sm: { wrap: "size-10", icon: "size-5" },
  md: { wrap: "size-14", icon: "size-6" },
  lg: { wrap: "size-16", icon: "size-7" },
};

/** A gold-tinted circular badge wrapping a Lucide icon. */
export function IconBadge({
  icon: Icon,
  size = "md",
  className,
}: {
  icon: LucideIcon;
  size?: keyof typeof sizeMap;
  className?: string;
}) {
  const s = sizeMap[size];
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-gold-100 text-gold-700 ring-1 ring-gold-500/20",
        s.wrap,
        className,
      )}
    >
      <Icon className={s.icon} strokeWidth={1.75} />
    </span>
  );
}
