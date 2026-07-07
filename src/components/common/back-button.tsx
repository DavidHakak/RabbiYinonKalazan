"use client";

import { ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";

/**
 * "Back to the listing" button for detail pages. Returns to the *previous* page
 * (so the visitor's filter + page — which live in the list URL — are preserved),
 * falling back to the listing index when there is no history (direct visit /
 * shared link).
 */
export function BackButton({
  fallbackHref,
  label,
}: {
  fallbackHref: string;
  label: string;
}) {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      className="text-gold-700 hover:text-gold-800"
      onClick={() => {
        if (typeof window !== "undefined" && window.history.length > 1) {
          router.back();
        } else {
          router.push(fallbackHref);
        }
      }}
    >
      <ChevronRight className="size-4 flip-rtl" />
      {label}
    </Button>
  );
}
