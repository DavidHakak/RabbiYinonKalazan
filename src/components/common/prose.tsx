import { cn } from "@/lib/utils";

/**
 * Readable long-form text. Accepts either a single string (split on blank
 * lines into paragraphs), an array of paragraphs, or arbitrary children.
 */
export function Prose({
  content,
  children,
  className,
}: {
  content?: string | string[];
  children?: React.ReactNode;
  className?: string;
}) {
  const paragraphs = Array.isArray(content)
    ? content
    : typeof content === "string"
      ? content.split(/\n{2,}/).filter(Boolean)
      : null;

  return (
    <div
      className={cn(
        "space-y-4 text-pretty leading-relaxed text-foreground/80 [&_p]:text-base md:[&_p]:text-lg",
        className,
      )}
    >
      {paragraphs
        ? paragraphs.map((p, i) => <p key={i}>{p}</p>)
        : children}
    </div>
  );
}
