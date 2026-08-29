import * as React from "react";
import { motion } from "framer-motion";

import { VehicleCard } from "./VehicleCard";
import { VehicleCardSkeleton } from "./VehicleCardSkeleton";
import type { Vehicle } from "@/lib/vehicles";
import { useLanguage } from "@/lib/i18n";
import { siteConfig } from "@/lib/siteConfig";
import { cn } from "@/lib/utils";

/**
 * FeaturedVehicles — responsive grid of the dealership's current highlights.
 *
 * Grid rules (tuned for 3–8 cards):
 *   - <sm  : 1 col
 *   - sm   : 2 cols
 *   - lg+  : 3 cols
 * Cards keep their intrinsic height and identical composition, so mixing
 * "Neuf", "Occasion" and "Réservé" states never breaks the row rhythm.
 */
export interface FeaturedVehiclesProps {
  vehicles: Vehicle[];
  loading?: boolean;
  onView?: (vehicle: Vehicle) => void;
  /** Skeleton count while loading — defaults to 3. */
  skeletonCount?: number;
}

export function FeaturedVehicles({
  vehicles,
  loading = false,
  onView,
  skeletonCount = 3,
}: FeaturedVehiclesProps) {
  const { t, locale } = useLanguage();

  const eyebrow = locale === "ar" ? "المعروض حالياً" : "Sélection du moment";
  const heading = locale === "ar" ? "سيارات جاهزة للتجربة" : "Véhicules prêts à essayer";
  const sub =
    locale === "ar"
      ? "قطع مختارة بعناية من مخزوننا الحالي. تواصل معنا على واتساب لحجز التجربة."
      : "Une sélection issue de notre stock actuel. Contactez-nous sur WhatsApp pour organiser un essai.";

  const count = vehicles.length;
  if (!loading && count < 3) {
    // Defensive log for the pitch config — the spec requires 3–8.
    console.warn(
      `[FeaturedVehicles] Expected 3–8 vehicles, received ${count}. Check the live Supabase inventory.`,
    );
  }

  return (
    <section
      id="inventaire"
      aria-labelledby="featured-heading"
      className="relative mx-auto max-w-7xl scroll-mt-24 px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-32"
    >
      <header className="mb-12 flex flex-col gap-4 lg:mb-16 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-eyebrow">{eyebrow}</p>
          <h2 id="featured-heading" className="text-display-lg mt-3">
            {heading}
          </h2>
          <p className="text-body text-muted-foreground mt-4">{sub}</p>
        </div>
        {!loading ? (
          <p className="text-caption text-muted-foreground">
            <span dir="ltr" className="tabular-nums">
              {count}
            </span>{" "}
            {locale === "ar" ? "سيارة متوفرة" : "véhicules en stock"}
          </p>
        ) : null}
      </header>

      {loading ? (
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09 } } }}
          className={cn("grid gap-6 sm:gap-7", "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3")}
        >
          {Array.from({ length: skeletonCount }).map((_, i) => (
            <VehicleCardSkeleton key={i} />
          ))}
        </motion.div>
      ) : vehicles.length === 0 ? (
        <div className="surface-card flex flex-col items-center gap-3 p-10 text-center">
          <p className="text-body text-foreground">
            {locale === "ar"
              ? "لا توجد سيارات معروضة حالياً."
              : "Aucun véhicule n'est disponible actuellement."}
          </p>
          <p className="text-body-sm text-muted-foreground">
            {locale === "ar"
              ? "تواصلوا معنا لمعرفة آخر العروض."
              : "Contactez-nous pour connaître nos dernières offres."}
          </p>
        </div>
      ) : (
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09 } } }}
          className={cn("grid gap-6 sm:gap-7", "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3")}
        >
          {vehicles.map((vehicle) => (
            <motion.div
              key={vehicle.id}
              variants={{
                hidden: { opacity: 0, y: 24 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
                },
              }}
            >
              <VehicleCard
                vehicle={vehicle}
                whatsappPhone={siteConfig.dealership.whatsapp}
                locale={locale}
                onView={onView}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  );
}
