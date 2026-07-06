import type { MetadataRoute } from "next";

/**
 * Web App Manifest — lets visitors install the site as a standalone mobile app
 * (Add to Home Screen). Names/description use the Hebrew default locale.
 * Icons are generated from the brand logo (see `public/icons/*`).
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "הרב ינון קלזאן — פילוסופיה יהודית ומחשבת ישראל",
    short_name: "הרב קלזאן",
    description:
      "הרצאות, שיעורים ודברי תורה של הרב ינון קלזאן — קרוב אליכם, תמיד בהישג יד.",
    id: "/",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    dir: "rtl",
    lang: "he",
    background_color: "#faf6ee",
    theme_color: "#0a1730",
    categories: ["education", "lifestyle", "books"],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
