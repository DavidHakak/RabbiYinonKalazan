import { cn } from "@/lib/utils";

import { Container } from "./container";

type SectionTone = "default" | "muted" | "parchment" | "navy";

const toneClasses: Record<SectionTone, string> = {
  default: "bg-background text-foreground",
  muted: "bg-secondary/50 text-foreground",
  parchment: "bg-parchment text-foreground",
  navy: "bg-navy-900 text-cream-100",
};

interface SectionProps extends React.ComponentProps<"section"> {
  tone?: SectionTone;
  /** Wrap children in a Container (default true). Set false for full-bleed. */
  contained?: boolean;
  /** Vertical rhythm. */
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "py-10 md:py-14",
  md: "py-14 md:py-20",
  lg: "py-20 md:py-28",
};

/** A full-width horizontal band with consistent vertical rhythm and tone. */
export function Section({
  tone = "default",
  contained = true,
  size = "md",
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn(toneClasses[tone], sizeClasses[size], className)}
      {...props}
    >
      {contained ? <Container>{children}</Container> : children}
    </section>
  );
}
