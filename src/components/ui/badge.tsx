import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Showroom badges. Used for vehicle status ("Neuf", "Disponible"),
 * category tags, and inline metadata chips.
 *
 * For dealership credentials (Concessionnaire agréé, Garantie 2 ans,
 * Financement, etc.), use <TrustBadge /> — it pairs an icon with a label.
 */
const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background",
  {
    variants: {
      variant: {
        default: "border-hairline bg-secondary/70 text-foreground/90 backdrop-blur",
        gold: "border-gold/50 bg-gold/15 text-gold-soft",
        solid: "border-transparent bg-gold text-gold-foreground",
        success: "border-success/40 bg-success/15 text-success",
        outline: "border-hairline bg-transparent text-foreground/80",
        muted: "border-transparent bg-muted text-muted-foreground",
        destructive: "border-destructive/40 bg-destructive/15 text-destructive",
      },
      size: {
        sm: "px-2 py-0.5 text-[10px] tracking-[0.1em]",
        default: "px-3 py-1 text-[11px]",
        lg: "px-4 py-1.5 text-xs",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant, size }), className)} {...props} />;
}

export { Badge, badgeVariants };
