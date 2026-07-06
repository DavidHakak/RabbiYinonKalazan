import { cn } from "@/lib/utils";

import { Ornament } from "./ornament";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: "start" | "center";
  ornament?: boolean;
  className?: string;
  as?: "h1" | "h2" | "h3";
}

/** Consistent section title block: heading + optional ornament + subtitle. */
export function SectionHeading({
  title,
  subtitle,
  align = "center",
  ornament = true,
  className,
  as: Heading = "h2",
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "items-start text-start",
        className,
      )}
    >
      <Heading className="text-3xl font-bold text-navy-900 md:text-4xl">
        {title}
      </Heading>
      {ornament ? <Ornament /> : null}
      {subtitle ? (
        <p className="max-w-2xl text-pretty text-base text-muted-foreground md:text-lg">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
