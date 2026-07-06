"use client";

import { Mail } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { siteConfig } from "@/config/site";

/** A branded circular monogram used in place of trademarked payment logos. */
function Monogram({ letter, color }: { letter: string; color: string }) {
  return (
    <span
      aria-hidden="true"
      className="flex size-14 items-center justify-center rounded-full font-serif text-2xl font-bold text-white shadow-sm ring-4 ring-white/50"
      style={{ backgroundColor: color }}
    >
      {letter}
    </span>
  );
}

/** Shared card shell so every payment method looks identical. */
function MethodCard({
  letter,
  color,
  name,
  children,
}: {
  letter: string;
  color: string;
  name: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="items-center gap-5 px-6 text-center transition-shadow hover:shadow-md">
      <Monogram letter={letter} color={color} />
      <span className="font-serif text-xl font-semibold text-navy-900" dir="ltr">
        {name}
      </span>
      {children}
    </Card>
  );
}

export function DonationMethods() {
  const t = useTranslations("support");
  const { paypal, venmo, zelleEmail } = siteConfig.donations;

  return (
    <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-3">
      {/* PayPal — external deep link */}
      <MethodCard letter="P" color="#0070ba" name="PayPal">
        <Button asChild variant="gold" className="w-full">
          <a href={paypal} target="_blank" rel="noopener noreferrer">
            {t("give.donate")}
          </a>
        </Button>
      </MethodCard>

      {/* Venmo — external deep link */}
      <MethodCard letter="V" color="#3d95ce" name="Venmo">
        <Button asChild variant="gold" className="w-full">
          <a href={venmo} target="_blank" rel="noopener noreferrer">
            {t("give.donate")}
          </a>
        </Button>
      </MethodCard>

      {/* Zelle — no deep link, so reveal the linked email in a dialog */}
      <MethodCard letter="Z" color="#6d1ed4" name="Zelle">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="navy" className="w-full">
              {t("give.donate")}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle dir="ltr">{t("zelle.title")}</DialogTitle>
              <DialogDescription>{t("zelle.description")}</DialogDescription>
            </DialogHeader>
            <a
              href={`mailto:${zelleEmail}`}
              dir="ltr"
              className="flex items-center justify-center gap-2 rounded-md border bg-secondary/40 px-4 py-3 font-medium text-navy-900 transition-colors hover:bg-secondary"
            >
              <Mail className="size-4 shrink-0 text-gold-600" aria-hidden="true" />
              {zelleEmail}
            </a>
          </DialogContent>
        </Dialog>
      </MethodCard>
    </div>
  );
}
