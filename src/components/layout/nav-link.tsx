"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  activeClassName?: string;
  onNavigate?: () => void;
}

/** A locale-aware link that knows whether it points at the current route. */
export function NavLink({
  href,
  children,
  className,
  activeClassName,
  onNavigate,
}: NavLinkProps) {
  const pathname = usePathname();
  const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={isActive ? "page" : undefined}
      data-active={isActive || undefined}
      className={cn(className, isActive && activeClassName)}
    >
      {children}
    </Link>
  );
}
