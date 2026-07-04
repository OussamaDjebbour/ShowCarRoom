import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Showroom button system.
 *
 * Variants:
 *  - default    → neutral dark surface (secondary actions)
 *  - gold       → primary CTA ("Voir le véhicule", "Prendre RDV")
 *  - outline    → hairline border on dark, for tertiary actions
 *  - ghost      → text-only, for nav / inline actions
 *  - whatsapp   → branded green WhatsApp CTA
 *  - link       → underlined text link
 *
 * Sizes follow the 4/8/16/24/32/48 spacing scale.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium cursor-pointer transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-secondary text-secondary-foreground border border-hairline hover:bg-accent",
        gold:
          "bg-gold text-gold-foreground shadow-[var(--shadow-gold)] hover:brightness-110 hover:-translate-y-[1px] active:translate-y-0",
        outline:
          "border border-gold/40 text-foreground bg-transparent hover:bg-gold/10 hover:border-gold",
        ghost:
          "bg-transparent text-foreground/80 hover:text-foreground hover:bg-accent/60",
        whatsapp:
          "bg-whatsapp text-whatsapp-foreground shadow-md hover:brightness-110 hover:-translate-y-[1px] active:translate-y-0",
        destructive:
          "bg-destructive text-destructive-foreground hover:brightness-110",
        link: "text-gold underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-8 px-4 text-xs tracking-wide [&_svg]:size-3.5",
        default: "h-11 px-6 text-sm tracking-wide [&_svg]:size-4",
        lg: "h-12 px-8 text-sm uppercase tracking-[0.14em] [&_svg]:size-4",
        xl: "h-14 px-10 text-sm uppercase tracking-[0.16em] [&_svg]:size-5",
        icon: "h-11 w-11 [&_svg]:size-5",
        "icon-sm": "h-9 w-9 [&_svg]:size-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
