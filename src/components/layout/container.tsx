import { cn } from "@/lib/utils";

/** Centered, max-width page gutter. Use everywhere content needs horizontal bounds. */
export function Container({
  className,
  children,
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8", className)}>
      {children}
    </div>
  );
}
