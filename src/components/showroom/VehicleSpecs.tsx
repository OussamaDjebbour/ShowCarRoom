import * as React from "react";
import { motion } from "framer-motion";
import { Fuel, Gauge, Cog, Calendar, Palette, Car } from "lucide-react";

import type { Vehicle } from "@/lib/vehicles";
import { formatMileage } from "@/lib/vehicles";
import { cn } from "@/lib/utils";

/**
 * VehicleSpecs — the specification grid on the detail page.
 *
 * Two blocks:
 *   1. Core spec grid (year, km, fuel, box, body, colour) — always rendered.
 *   2. Performance/optional specs list from vehicle.specs — rendered if provided.
 *
 * All values respect fr-DZ / ar-DZ digit direction via inline dir="ltr".
 */
const fuelLabelFr: Record<Vehicle["fuel"], string> = {
  essence: "Essence",
  diesel: "Diesel",
  hybride: "Hybride",
  electrique: "Électrique",
};
const fuelLabelAr: Record<Vehicle["fuel"], string> = {
  essence: "بنزين",
  diesel: "ديزل",
  hybride: "هجين",
  electrique: "كهربائي",
};
const boxLabelFr: Record<Vehicle["transmission"], string> = {
  manuelle: "Manuelle",
  automatique: "Automatique",
};
const boxLabelAr: Record<Vehicle["transmission"], string> = {
  manuelle: "يدوي",
  automatique: "أوتوماتيكي",
};

export function VehicleSpecs({
  vehicle,
  locale = "fr",
  className,
}: {
  vehicle: Vehicle;
  locale?: "fr" | "ar";
  className?: string;
}) {
  const isAr = locale === "ar";
  const label = (fr: string, ar: string) => (isAr ? ar : fr);

  const core: Array<{ icon: React.ComponentType<{ className?: string; strokeWidth?: number; "aria-hidden"?: boolean }>; label: string; value: string; ltr?: boolean }> = [
    { icon: Calendar, label: label("Année", "السنة"), value: String(vehicle.year), ltr: true },
    { icon: Gauge, label: label("Kilométrage", "المسافة"), value: formatMileage(vehicle.mileageKm, locale) },
    { icon: Fuel, label: label("Carburant", "الوقود"), value: isAr ? fuelLabelAr[vehicle.fuel] : fuelLabelFr[vehicle.fuel] },
    { icon: Cog, label: label("Boîte", "ناقل الحركة"), value: isAr ? boxLabelAr[vehicle.transmission] : boxLabelFr[vehicle.transmission] },
    ...(vehicle.bodyStyle
      ? [{ icon: Car, label: label("Carrosserie", "الهيكل"), value: vehicle.bodyStyle }]
      : []),
    ...(vehicle.color
      ? [{ icon: Palette, label: label("Couleur", "اللون"), value: vehicle.color }]
      : []),
  ];

  return (
    <div className={cn("space-y-8", className)}>
      <section aria-label={label("Caractéristiques principales", "الخصائص الرئيسية")}>
        <p className="text-eyebrow">{label("Aperçu", "نظرة عامة")}</p>
        <dl className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {core.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-xl border border-hairline bg-surface/50 p-4"
            >
              <div className="text-muted-foreground flex items-center gap-1.5">
                <item.icon className="size-3.5 text-gold" strokeWidth={1.75} aria-hidden />
                <dt className="font-mono text-[10px] font-medium uppercase tracking-[0.12em]">
                  {item.label}
                </dt>
              </div>
              <dd
                className="text-data mt-2 text-sm text-foreground"
                {...(item.ltr ? { dir: "ltr" } : {})}
              >
                {item.value}
              </dd>
            </motion.div>
          ))}
        </dl>
      </section>

      {vehicle.specs && vehicle.specs.length > 0 ? (
        <section aria-label={label("Performance & motorisation", "الأداء والمحرك")}>
          <p className="text-eyebrow">
            {label("Performance & motorisation", "الأداء والمحرك")}
          </p>
          <dl className="mt-4 divide-y divide-hairline overflow-hidden rounded-xl border border-hairline">
            {vehicle.engineDisplacement ? (
              <SpecRow
                label={label("Motorisation", "المحرك")}
                value={vehicle.engineDisplacement}
              />
            ) : null}
            {vehicle.specs.map((s) => (
              <SpecRow key={s.label} label={s.label} value={s.value} />
            ))}
          </dl>
        </section>
      ) : null}

      {vehicle.equipment && vehicle.equipment.length > 0 ? (
        <section aria-label={label("Équipement", "التجهيزات")}>
          <p className="text-eyebrow">{label("Équipement", "التجهيزات")}</p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {vehicle.equipment.map((eq) => (
              <li
                key={eq}
                className="text-body-sm flex items-start gap-2 text-foreground/90"
              >
                <span
                  aria-hidden
                  className="mt-1.5 inline-block size-1.5 shrink-0 rounded-full bg-gold"
                />
                <span>{eq}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 bg-surface/40 px-4 py-3">
      <dt className="text-body-sm text-muted-foreground">{label}</dt>
      <dd className="text-data text-sm text-foreground">{value}</dd>
    </div>
  );
}
