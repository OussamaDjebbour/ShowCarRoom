import * as React from "react";
import { type LucideIcon } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * TrustBadge — dealership credibility marker.
 *
 * Usage examples for the Oran showroom:
 *   <TrustBadge icon={ShieldCheck} label="Concessionnaire agréé" />
 *   <TrustBadge icon={Wrench}      label="Garantie 2 ans" />
 *   <TrustBadge icon={Banknote}    label="Financement disponible" />
 *   <TrustBadge icon={MapPin}      label="Showroom à Oran" />
 *
 * Variants:
 *   - line      (default) hairline border on dark surface — for footer strips / header meta
 *   - solid     champagne-gold filled — for hero credibility row
 *   - subtle    filled with muted surface — for card metadata
 */
const trustBadgeVariants = cva(
  "inline-flex items-center gap-2 rounded-full font-medium transition-colors",
  {
    variants: {
      variant: {
        line: "border border-hairline bg-surface/60 text-foreground/90 backdrop-blur",
        solid: "border border-gold/50 bg-gold/15 text-gold-soft",
        subtle: "bg-muted text-muted-foreground",
      },
      size: {
        sm: "h-7 px-3 text-[11px] [&_svg]:size-3.5",
        default: "h-9 px-4 text-xs [&_svg]:size-4",
        lg: "h-11 px-5 text-sm [&_svg]:size-[18px]",
      },
    },
    defaultVariants: {
      variant: "line",
      size: "default",
    },
  },
);

export interface TrustBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof trustBadgeVariants> {
  icon?: LucideIcon;
  label: string;
}

export const TrustBadge = React.forwardRef<HTMLDivElement, TrustBadgeProps>(
  ({ className, variant, size, icon: Icon, label, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(trustBadgeVariants({ variant, size }), className)} {...props}>
        {Icon ? <Icon className="text-gold" aria-hidden="true" strokeWidth={1.75} /> : null}
        <span className="tracking-wide">{label}</span>
      </div>
    );
  },
);
TrustBadge.displayName = "TrustBadge";
