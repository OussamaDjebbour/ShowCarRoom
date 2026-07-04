import * as React from "react";
import { Phone, MapPin, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { WhatsAppButton } from "./WhatsAppButton";
import { TrustBadge } from "./TrustBadge";
import { cn } from "@/lib/utils";

/**
 * ContactCTA — the closing conversion block reused on the home page and
 * the vehicle detail page. Anchors the visitor to WhatsApp / call /
 * showroom visit while keeping the visual language identical to the rest
 * of the design system.
 */
export interface ContactCTAProps extends React.HTMLAttributes<HTMLElement> {
  /** Line 1 — bold, e.g. "Prêt à essayer votre prochaine voiture ?" */
  headline: string;
  /** Line 2 — supporting sentence. */
  subheadline?: string;
  whatsappPhone: string;
  callPhone: string;
  address: string;
  /** Opening hours, e.g. "Sam — Jeu · 9h — 19h". */
  hours?: string;
  /** Prefilled WhatsApp text. */
  whatsappMessage?: string;
  locale?: "fr" | "ar";
}

export const ContactCTA = React.forwardRef<HTMLElement, ContactCTAProps>(
  (
    {
      headline,
      subheadline,
      whatsappPhone,
      callPhone,
      address,
      hours,
      whatsappMessage,
      locale = "fr",
      className,
      ...props
    },
    ref,
  ) => {
    const callHref = `tel:${callPhone.replace(/[^\d+]/g, "")}`;

    // In RTL, WhatsApp should lead the CTA row visually — flex-row-reverse.
    const isRtl = locale === "ar";

    return (
      <section
        ref={ref}
        className={cn(
          "surface-card relative overflow-hidden p-8 sm:p-12 lg:p-16",
          className,
        )}
        {...props}
      >
        {/* Ambient gold wash */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gold/15 blur-3xl"
        />

        <div className="relative grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div>
            <p className="text-eyebrow">Contactez le showroom</p>
            <h2 className="text-display-lg mt-4 text-balance">{headline}</h2>
            {subheadline ? (
              <p className="text-body-lg mt-4 max-w-xl text-muted-foreground">
                {subheadline}
              </p>
            ) : null}

            <div
              className={cn(
                "mt-8 flex flex-wrap gap-3",
                isRtl && "flex-row-reverse",
              )}
            >
              <WhatsAppButton
                phone={whatsappPhone}
                message={whatsappMessage}
                label="Écrire sur WhatsApp"
                size="lg"
              />
              <Button asChild variant="outline" size="lg">
                <a href={callHref}>
                  <Phone />
                  Appeler
                </a>
              </Button>
            </div>
          </div>

          <ul className="flex flex-col gap-4 border-t border-hairline pt-8 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0 rtl:lg:border-l-0 rtl:lg:border-r rtl:lg:pl-0 rtl:lg:pr-10">
            <ContactRow icon={MapPin} label="Adresse" value={address} />
            <ContactRow icon={Phone} label="Téléphone" value={callPhone} />
            {hours ? <ContactRow icon={Clock} label="Horaires" value={hours} /> : null}

            <li className="mt-2 flex flex-wrap gap-2">
              <TrustBadge label="Concessionnaire agréé" variant="line" size="sm" />
              <TrustBadge label="Showroom à Oran" variant="line" size="sm" />
            </li>
          </ul>
        </div>
      </section>
    );
  },
);
ContactCTA.displayName = "ContactCTA";

function ContactRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number; "aria-hidden"?: boolean }>;
  label: string;
  value: string;
}) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 grid size-9 place-items-center rounded-full border border-hairline bg-surface text-gold">
        <Icon className="size-4" strokeWidth={1.75} aria-hidden />
      </span>
      <div className="min-w-0">
        <p className="text-caption text-muted-foreground">{label}</p>
        <p className="text-body mt-0.5 text-foreground">{value}</p>
      </div>
    </li>
  );
}
