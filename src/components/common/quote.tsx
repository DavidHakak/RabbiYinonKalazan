import { Quote as QuoteIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/** A centered pull-quote band with a gold quotation flourish. */
export function Quote({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <figure
      className={cn(
        "mx-auto flex max-w-3xl flex-col items-center gap-4 text-center",
        className,
      )}
    >
      <QuoteIcon className="size-8 text-gold-500/70" aria-hidden="true" />
      <blockquote className="text-balance font-serif text-xl font-medium leading-relaxed text-navy-900 md:text-2xl">
        {children}
      </blockquote>
    </figure>
  );
}
