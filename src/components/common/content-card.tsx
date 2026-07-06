import type { LucideIcon } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export interface CardBadge {
  label: string;
  tone?: "gold" | "navy" | "muted";
}

export interface CardMeta {
  icon?: LucideIcon;
  label: string;
}

export interface CardAction {
  label: string;
  href: string;
  icon?: LucideIcon;
  variant?: React.ComponentProps<typeof Button>["variant"];
  /** External link (opens in new tab) vs internal locale-aware link. */
  external?: boolean;
}

export interface ContentCardProps {
  title: string;
  href?: string;
  excerpt?: string;
  imageUrl?: string | null;
  placeholderIcon?: LucideIcon;
  badges?: CardBadge[];
  metas?: CardMeta[];
  action?: CardAction;
  secondaryAction?: CardAction;
  className?: string;
}

const badgeTone: Record<NonNullable<CardBadge["tone"]>, string> = {
  gold: "bg-gold-100 text-gold-800 ring-gold-500/20",
  navy: "bg-navy-100 text-navy-800 ring-navy-500/20",
  muted: "bg-muted text-muted-foreground ring-border",
};

function ActionButton({ action }: { action: CardAction }) {
  const Icon = action.icon;
  const content = (
    <>
      {Icon ? <Icon className="size-4" /> : null}
      {action.label}
    </>
  );
  return (
    <Button asChild variant={action.variant ?? "navy"} size="sm">
      {action.external ? (
        <a href={action.href} target="_blank" rel="noopener noreferrer">
          {content}
        </a>
      ) : (
        <Link href={action.href}>{content}</Link>
      )}
    </Button>
  );
}

/**
 * The one card used across every listing (lectures, divrei torah, events).
 * Vertical layout: media/placeholder → badges → title → excerpt → meta → actions.
 */
export function ContentCard({
  title,
  href,
  excerpt,
  imageUrl,
  placeholderIcon: Placeholder,
  badges,
  metas,
  action,
  secondaryAction,
  className,
}: ContentCardProps) {
  return (
    <article
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl border border-gold-500/15 bg-card shadow-sm transition-all hover:border-gold-500/40 hover:shadow-lg",
        className,
      )}
    >
      {/* Media */}
      <div className="relative aspect-video overflow-hidden bg-navy-900">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-navy-800 to-navy-950">
            {Placeholder ? (
              <Placeholder className="size-12 text-gold-500/40" strokeWidth={1.25} />
            ) : null}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        {badges && badges.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {badges.map((b, i) => (
              <span
                key={i}
                className={cn(
                  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
                  badgeTone[b.tone ?? "gold"],
                )}
              >
                {b.label}
              </span>
            ))}
          </div>
        ) : null}

        <h3 className="font-serif text-lg font-bold leading-snug text-navy-900">
          {href ? (
            <Link href={href} className="transition-colors hover:text-gold-700">
              {title}
            </Link>
          ) : (
            title
          )}
        </h3>

        {excerpt ? (
          <p className="line-clamp-3 text-sm text-pretty text-muted-foreground">
            {excerpt}
          </p>
        ) : null}

        {metas && metas.length > 0 ? (
          <ul className="mt-auto flex flex-wrap gap-x-4 gap-y-1 pt-1 text-xs text-muted-foreground">
            {metas.map((m, i) => {
              const Icon = m.icon;
              return (
                <li key={i} className="flex items-center gap-1.5">
                  {Icon ? <Icon className="size-3.5 text-gold-600" /> : null}
                  {m.label}
                </li>
              );
            })}
          </ul>
        ) : null}

        {action || secondaryAction ? (
          <div className="flex flex-wrap items-center gap-2 pt-3">
            {action ? <ActionButton action={action} /> : null}
            {secondaryAction ? (
              <Button asChild variant="ghost" size="sm" className="text-gold-700 hover:text-gold-800">
                {secondaryAction.external ? (
                  <a href={secondaryAction.href} target="_blank" rel="noopener noreferrer">
                    {secondaryAction.label}
                  </a>
                ) : (
                  <Link href={secondaryAction.href}>{secondaryAction.label}</Link>
                )}
              </Button>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  );
}
