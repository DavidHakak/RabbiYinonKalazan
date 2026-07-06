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

/**
 * Official brand marks (single-colour glyphs, 24×24 viewBox) sourced from
 * Simple Icons. Rendered white inside a brand-coloured badge.
 */
const BRAND_LOGOS = {
  paypal:
    "M15.607 4.653H8.941L6.645 19.251H1.82L4.862 0h7.995c3.754 0 6.375 2.294 6.473 5.513-.648-.478-2.105-.86-3.722-.86m6.57 5.546c0 3.41-3.01 6.853-6.958 6.853h-2.493L11.595 24H6.74l1.845-11.538h3.592c4.208 0 7.346-3.634 7.153-6.949a5.24 5.24 0 0 1 2.848 4.686M9.653 5.546h6.408c.907 0 1.942.222 2.363.541-.195 2.741-2.655 5.483-6.441 5.483H8.714Z",
  venmo:
    "M21.772 13.119c-.267 0-.381-.251-.38-.655 0-.533.121-1.575.712-1.575.267 0 .357.243.357.598 0 .533-.13 1.632-.689 1.632Zm.502-3.377c-1.677 0-2.405 1.285-2.405 2.658 0 1.042.421 1.874 1.693 1.874 1.717 0 2.438-1.406 2.438-2.763 0-1.025-.462-1.769-1.726-1.769Zm-3.833 0c-.558 0-.964.17-1.393.477-.154-.275-.462-.477-.932-.477-.542 0-.947.219-1.247.437l-.04-.364H13.54l-.688 4.354h1.506l.479-3.053c.129-.065.323-.154.518-.154.145 0 .267.049.267.267 0 .056-.016.145-.024.218l-.429 2.722h1.498l.478-3.053c.138-.073.324-.154.51-.154.146 0 .268.049.268.267 0 .056-.017.145-.025.218l-.429 2.722h1.499l.461-2.908c.025-.153.049-.388.049-.549 0-.582-.267-.97-1.037-.97Zm-6.871 0c-.575 0-.98.219-1.287.421l-.017-.348H8.962l-.689 4.354H9.78l.478-3.053c.13-.065.324-.154.518-.154.147 0 .268.049.268.242 0 .081-.024.227-.032.299l-.422 2.666h1.499l.462-2.908c.024-.153.049-.388.049-.549 0-.582-.268-.97-1.03-.97Zm-5.631 1.834c.041-.485.413-.824.697-.824.162 0 .299.097.299.291 0 .404-.713.533-.996.533Zm.843-1.834c-1.604 0-2.382 1.39-2.382 2.698 0 1.01.478 1.817 1.814 1.817.527 0 1.07-.113 1.418-.282l.186-1.26c-.494.25-.874.347-1.271.347-.365 0-.64-.194-.64-.687.826-.008 2.252-.347 2.252-1.453 0-.687-.494-1.18-1.377-1.18Zm-4.239.267c.089.186.146.412.146.743 0 .606-.429 1.494-.777 2.06l-.373-2.989L0 9.969l.705 4.2h1.757c.77-1.01 1.718-2.448 1.718-3.554 0-.347-.073-.622-.235-.889l-1.402.283Z",
  zelle:
    "M13.559 24h-2.841a.483.483 0 0 1-.483-.483v-2.765H5.638a.667.667 0 0 1-.666-.666v-2.234a.67.67 0 0 1 .142-.412l8.139-10.382h-7.25a.667.667 0 0 1-.667-.667V3.914c0-.367.299-.666.666-.666h4.23V.483c0-.266.217-.483.483-.483h2.841c.266 0 .483.217.483.483v2.765h4.323c.367 0 .666.299.666.666v2.137a.67.67 0 0 1-.141.41l-8.19 10.481h7.665c.367 0 .666.299.666.666v2.477a.667.667 0 0 1-.666.667h-4.32v2.765a.483.483 0 0 1-.483.483Z",
} as const;

/** A brand logo rendered white inside a brand-coloured circular badge. */
function BrandBadge({
  brand,
  color,
}: {
  brand: keyof typeof BRAND_LOGOS;
  color: string;
}) {
  return (
    <span
      aria-hidden="true"
      className="flex size-14 items-center justify-center rounded-full shadow-sm ring-4 ring-white/50"
      style={{ backgroundColor: color }}
    >
      <svg viewBox="0 0 24 24" className="size-7 fill-white">
        <path d={BRAND_LOGOS[brand]} />
      </svg>
    </span>
  );
}

/** Shared card shell so every payment method looks identical. */
function MethodCard({
  brand,
  color,
  name,
  children,
}: {
  brand: keyof typeof BRAND_LOGOS;
  color: string;
  name: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="items-center gap-5 px-6 text-center transition-shadow hover:shadow-md">
      <BrandBadge brand={brand} color={color} />
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
      <MethodCard brand="paypal" color="#003087" name="PayPal">
        <Button asChild variant="gold" className="w-full">
          <a href={paypal} target="_blank" rel="noopener noreferrer">
            {t("give.paypal")}
          </a>
        </Button>
      </MethodCard>

      {/* Venmo — external deep link */}
      <MethodCard brand="venmo" color="#008cff" name="Venmo">
        <Button asChild variant="gold" className="w-full">
          <a href={venmo} target="_blank" rel="noopener noreferrer">
            {t("give.venmo")}
          </a>
        </Button>
      </MethodCard>

      {/* Zelle — no deep link, so reveal the linked email in a dialog */}
      <MethodCard brand="zelle" color="#6d1ed4" name="Zelle">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="navy" className="w-full">
              {t("give.zelle")}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{t("zelle.title")}</DialogTitle>
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
            <p className="text-center text-xs text-muted-foreground">
              {t("zelle.hint")}
            </p>
          </DialogContent>
        </Dialog>
      </MethodCard>
    </div>
  );
}
