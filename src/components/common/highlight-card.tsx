import type { LucideIcon } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

import { IconBadge } from "./icon-badge";

interface HighlightCardProps {
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

/** A linked feature card (home highlights grid): centered icon, title, blurb. */
export function HighlightCard({
  href,
  icon,
  title,
  description,
  className,
}: HighlightCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex flex-col items-center gap-4 rounded-2xl border border-gold-500/15 bg-card p-6 text-center shadow-sm transition-all hover:-translate-y-1 hover:border-gold-500/40 hover:shadow-lg",
        className,
      )}
    >
      <IconBadge icon={icon} size="md" className="transition-colors group-hover:bg-gold-500 group-hover:text-navy-900" />
      <h3 className="font-serif text-lg font-bold text-navy-900">{title}</h3>
      <span className="h-px w-10 bg-gold-500/60" aria-hidden="true" />
      <p className="text-sm text-pretty text-muted-foreground">{description}</p>
    </Link>
  );
}
