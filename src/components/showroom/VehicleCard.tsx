import * as React from "react";
import { ArrowUpRight, Fuel, Gauge, Cog, Calendar } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WhatsAppButton } from "./WhatsAppButton";
import { type Vehicle, formatPriceDzd, formatMileage } from "@/lib/vehicles";
import { cn } from "@/lib/utils";

/**
 * VehicleCard — the featured-inventory card used on the home page grid
 * and any listing surface.
 *
 * Composition:
 *   [image (16:10) + status badges overlay]
 *   [brand · model / year · price]
 *   [spec row: km · fuel · transmission]
 *   [footer: "Voir le véhicule" ghost + WhatsApp CTA]
 *
 * Reuses only design-system primitives (surface-card utility, Button, Badge).
 */
export interface VehicleCardProps extends React.HTMLAttributes<HTMLElement> {
  vehicle: Vehicle;
  /** Phone used by the WhatsApp CTA — normally injected from the site config. */
  whatsappPhone: string;
  locale?: "fr" | "ar";
  /** Called when the user clicks the primary "Voir le véhicule" action. */
  onView?: (vehicle: Vehicle) => void;
}

const fuelLabel: Record<Vehicle["fuel"], string> = {
  essence: "Essence",
  diesel: "Diesel",
  hybride: "Hybride",
  electrique: "Électrique",
};

const transmissionLabel: Record<Vehicle["transmission"], string> = {
  manuelle: "Manuelle",
  automatique: "Automatique",
};

export const VehicleCard = React.forwardRef<HTMLElement, VehicleCardProps>(
  ({ vehicle, whatsappPhone, locale = "fr", onView, className, ...props }, ref) => {
    const {
      brand,
      model,
      year,
      priceDzd,
      mileageKm,
      fuel,
      transmission,
      condition,
      images,
      highlights,
      reserved,
      tagline,
    } = vehicle;

    const heroImage = images[0];
    const waMessage =
      locale === "ar"
        ? `مرحبا، أنا مهتم بـ ${brand} ${model} (${year}) المعروضة على موقعكم.`
        : `Bonjour, je suis intéressé par la ${brand} ${model} (${year}) publiée sur votre site.`;

    return (
      <article
        ref={ref}
        className={cn("surface-card surface-card-hover group flex flex-col", className)}
        {...props}
      >
        {/* Media */}
        <div className="relative aspect-[16/10] overflow-hidden">
          {heroImage ? (
            <img
              src={heroImage}
              alt={`${brand} ${model} ${year}`}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
            />
          ) : (
            <div className="h-full w-full bg-muted" aria-hidden="true" />
          )}

          {/* Top-left status stack */}
          <div className="absolute left-4 top-4 flex flex-col items-start gap-2">
            <Badge variant={condition === "neuf" ? "solid" : "gold"} size="sm">
              {condition === "neuf" ? "Neuf" : "Occasion"}
            </Badge>
            {reserved ? (
              <Badge variant="destructive" size="sm">
                Réservé
              </Badge>
            ) : null}
          </div>

          {/* Bottom gradient scrim for legibility */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-background/85 to-transparent"
          />
        </div>

        {/* Header */}
        <header className="flex items-start justify-between gap-4 px-6 pt-6">
          <div className="min-w-0">
            <p className="text-eyebrow">{brand}</p>
            <h3 className="text-h2 mt-1 truncate">{model}</h3>
            {tagline ? (
              <p className="text-body-sm text-muted-foreground mt-2 line-clamp-2">{tagline}</p>
            ) : null}
          </div>
          <div className="text-right shrink-0">
            <p className="text-caption text-muted-foreground">Prix</p>
            <p className="text-odometer mt-1 text-lg text-gold">
              {formatPriceDzd(priceDzd, locale)}
            </p>
          </div>
        </header>

        {/* Spec row */}
        <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-4 border-t border-hairline px-6 pt-4">
          <SpecItem icon={Calendar} label="Année" value={String(year)} />
          <SpecItem icon={Gauge} label="Kilométrage" value={formatMileage(mileageKm, locale)} />
          <SpecItem icon={Fuel} label="Carburant" value={fuelLabel[fuel]} />
          <SpecItem icon={Cog} label="Boîte" value={transmissionLabel[transmission]} />
        </dl>

        {/* Highlights */}
        {highlights && highlights.length > 0 ? (
          <ul className="mt-4 flex flex-wrap gap-2 px-6">
            {highlights.slice(0, 3).map((h) => (
              <li key={h}>
                <Badge variant="outline" size="sm">
                  {h}
                </Badge>
              </li>
            ))}
          </ul>
        ) : null}

        {/* Footer actions */}
        <footer className="mt-6 flex items-center gap-3 border-t border-hairline p-6">
          <Button
            variant="outline"
            size="default"
            className="flex-1"
            onClick={() => onView?.(vehicle)}
          >
            Voir le véhicule
            <ArrowUpRight />
          </Button>
          <WhatsAppButton
            phone={whatsappPhone}
            message={waMessage}
            label="WhatsApp"
            size="default"
          />
        </footer>
      </article>
    );
  },
);
VehicleCard.displayName = "VehicleCard";

function SpecItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number; "aria-hidden"?: boolean }>;
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <Icon className="size-3.5" strokeWidth={1.75} aria-hidden />
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] font-medium truncate">
          {label}
        </span>
      </div>
      <p className="text-data mt-1 truncate text-sm text-foreground">{value}</p>
    </div>
  );
}
