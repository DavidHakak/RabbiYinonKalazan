import { FacebookIcon, YouTubeIcon } from "@/components/brand/social-icons";

/**
 * Factual, non-translatable site data (contact channels, social profiles).
 * Human-facing labels live in `messages/*.json`; values that are the same in
 * every language (phone number, URLs) live here.
 *
 * Edit these once and the header, footer and contact page all update.
 */
export const siteConfig = {
  /** Canonical production URL — used for metadata / sitemap / OG tags. */
  url: "https://haravyinonkalazan.com",

  contact: {
    phone: "052-1234567",
    phoneHref: "tel:+972521234567",
    email: "info@yinonkalazan.com",
  },

  /** Donation channels shown on the support page. */
  donations: {
    paypal: "https://www.paypal.com/paypalme/RabbiYinonKalazan",
    venmo: "https://account.venmo.com/u/Yinon-Kalazan",
    /** Zelle has no deep link — the account is identified by this email. */
    zelleEmail: "yinon10@hotmail.com",
  },
} as const;

type SocialIcon = React.ComponentType<{ className?: string }>;

export interface SocialLink {
  key: string;
  href: string;
  icon: SocialIcon;
  label: string;
}

/** Social profiles shown in the footer. Set `href` to "" to hide one. */
export const socialLinks: SocialLink[] = [
  {
    key: "youtube",
    href: "https://www.youtube.com/user/yinonkalazan",
    icon: YouTubeIcon,
    label: "YouTube",
  },
  {
    key: "facebook",
    href: "https://www.facebook.com/RabbiYinonKalazan",
    icon: FacebookIcon,
    label: "Facebook",
  },
].filter((s) => s.href.length > 0);
