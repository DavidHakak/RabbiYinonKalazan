import Image from "next/image";

import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";

import { Ornament } from "./ornament";

interface HeroImage {
  src: string;
  alt: string;
  /** Prioritize loading (use for above-the-fold home hero). */
  priority?: boolean;
}

interface HeroProps {
  title: React.ReactNode;
  subtitle?: string;
  eyebrow?: string;
  actions?: React.ReactNode;
  image?: HeroImage;
  /** `lg` = home hero, `sm` = internal page header. */
  size?: "sm" | "lg";
  className?: string;
}

/** Warm study-hall library that sits behind the rabbi on every portrait hero. */
const HERO_BACKDROP = "/images/sefarim-shelf.png";

/**
 * The signature banner used on the home page (with CTAs + portrait) and, in its
 * compact `sm` form, as the header of every internal page. When a portrait is
 * supplied, the sefarim library sits full-bleed behind it — the lamp on the
 * right of the source photo is mirrored in LTR so it always falls on the
 * portrait's outer edge.
 */
export function Hero({
  title,
  subtitle,
  eyebrow,
  actions,
  image,
  size = "lg",
  className,
}: HeroProps) {
  const hasImage = Boolean(image);

  return (
    <section
      className={cn(
        "relative overflow-hidden bg-parchment",
        "border-b border-gold-500/15",
        className,
      )}
    >
      {hasImage ? (
        <>
          <Image
            src={HERO_BACKDROP}
            alt=""
            aria-hidden
            fill
            priority={size === "lg"}
            sizes="100vw"
            className="flip-ltr object-cover object-center"
          />
          <div
            aria-hidden
            className="hero-veil pointer-events-none absolute inset-0"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-linear-to-t from-navy-950/20 to-transparent"
          />
        </>
      ) : null}

      <Container
        className={cn(
          "relative z-10 grid items-center gap-10",
          hasImage ? "md:grid-cols-2" : "md:grid-cols-1",
          size === "lg" ? "py-16 md:py-24" : "py-12 md:py-16",
        )}
      >
        <div
          className={cn(
            "flex flex-col gap-6",
            hasImage ? "order-1 md:order-2" : "items-center text-center",
          )}
        >
          {eyebrow ? (
            <span className="text-sm font-semibold uppercase tracking-widest text-gold-600">
              {eyebrow}
            </span>
          ) : null}

          <h1
            className={cn(
              "font-serif font-bold leading-tight text-navy-900",
              size === "lg"
                ? "text-4xl sm:text-5xl md:text-6xl"
                : "text-3xl sm:text-4xl md:text-5xl",
            )}
          >
            {title}
          </h1>

          <Ornament className={cn(!hasImage && "justify-center")} width={size === "lg" ? "md" : "sm"} />

          {subtitle ? (
            <p
              className={cn(
                "max-w-xl text-pretty text-muted-foreground",
                size === "lg" ? "text-lg md:text-xl" : "text-base md:text-lg",
              )}
            >
              {subtitle}
            </p>
          ) : null}

          {actions ? (
            <div className="mt-2 flex flex-wrap gap-3">{actions}</div>
          ) : null}
        </div>

        {image ? (
          <div className="relative order-2 md:order-1">
            <div className="relative mx-auto aspect-4/5 w-full max-w-sm overflow-hidden rounded-2xl shadow-2xl ring-1 ring-gold-500/20 md:max-w-md">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                priority={image.priority}
                sizes="(max-width: 768px) 90vw, 40vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-navy-950/25 to-transparent" />
            </div>
          </div>
        ) : null}
      </Container>
    </section>
  );
}
