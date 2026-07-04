import * as React from "react";
import { MessageCircle } from "lucide-react";

import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * WhatsAppButton — the primary contact CTA for the Oran showroom.
 *
 * Builds a `wa.me` deep link with a prefilled message. All phone digits are
 * normalized (spaces / +/dashes stripped) so a config like "+213 555 12 34 56"
 * works out of the box.
 *
 * Uses the `whatsapp` button variant from the design system — do NOT restyle here.
 */
export interface WhatsAppButtonProps extends Omit<ButtonProps, "variant" | "asChild"> {
  phone: string;
  message?: string;
  /** Label override. Defaults to a bilingual-friendly French label. */
  label?: string;
  /** Hide the leading WhatsApp icon (e.g. compact toolbar usage). */
  hideIcon?: boolean;
}

function buildWhatsAppUrl(phone: string, message?: string): string {
  const digits = phone.replace(/[^\d]/g, "");
  const base = `https://wa.me/${digits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export const WhatsAppButton = React.forwardRef<HTMLAnchorElement, WhatsAppButtonProps>(
  ({ phone, message, label = "WhatsApp", hideIcon, size = "lg", className, ...props }, ref) => {
    const href = buildWhatsAppUrl(phone, message);
    return (
      <Button asChild variant="whatsapp" size={size} className={cn(className)}>
        <a
          ref={ref}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Contacter le showroom sur WhatsApp — ${label}`}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {!hideIcon ? <MessageCircle strokeWidth={2} aria-hidden="true" /> : null}
          <span>{label}</span>
        </a>
      </Button>
    );
  },
);
WhatsAppButton.displayName = "WhatsAppButton";
