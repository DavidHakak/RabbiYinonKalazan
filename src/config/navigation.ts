import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  CalendarDays,
  GraduationCap,
  HeartHandshake,
  Home,
  Mail,
  User,
} from "lucide-react";

/**
 * The navigation model — a single source of truth that drives the header,
 * the footer link list and the home-page highlight cards.
 *
 * `labelKey` / `descriptionKey` point into the `nav` / `home.cards` message
 * namespaces so every entry is fully translatable.
 */
export interface NavItem {
  /** Stable id, also the `nav.*` message key. */
  key: string;
  /** Locale-agnostic path (no locale prefix — added by the i18n <Link>). */
  href: string;
  icon: LucideIcon;
}

export const mainNav: NavItem[] = [
  { key: "home", href: "/", icon: Home },
  { key: "about", href: "/about", icon: User },
  { key: "lectures", href: "/lectures", icon: GraduationCap },
  { key: "dvarTorah", href: "/dvar-torah", icon: BookOpen },
  { key: "events", href: "/events", icon: CalendarDays },
  { key: "support", href: "/support", icon: HeartHandshake },
  { key: "contact", href: "/contact", icon: Mail },
];

/** Quick lookup by key. */
export const navByKey = Object.fromEntries(
  mainNav.map((item) => [item.key, item]),
) as Record<string, NavItem>;

/** Subset shown under "Important links" in the footer. */
export const footerNavKeys = ["lectures", "dvarTorah", "events", "support", "contact"];

/** The highlight cards on the home page (maps to `home.cards.*`). */
export const homeHighlightKeys = [
  "lectures",
  "dvarTorah",
  "events",
  "about",
  "support",
  "contact",
];
