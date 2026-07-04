/**
 * Shared vehicle type used across VehicleCard, FeaturedVehicles, VehicleDetailPage.
 * Kept minimal on purpose — a full config lives in Stage 4.
 */
export type FuelType = "essence" | "diesel" | "hybride" | "electrique";
export type Transmission = "manuelle" | "automatique";
export type VehicleCondition = "neuf" | "occasion";

export interface Vehicle {
  id: string;
  slug: string;
  brand: string;
  model: string;
  year: number;
  /** Price in Algerian Dinars (DZD). null = "Prix sur demande". */
  priceDzd: number | null;
  mileageKm: number;
  fuel: FuelType;
  transmission: Transmission;
  condition: VehicleCondition;
  /** Short marketing line — one sentence. */
  tagline?: string;
  /** Hero + gallery image URLs (imported assets or remote URLs). */
  images: string[];
  /** Optional chips shown on the card (e.g. "Toit ouvrant", "Cuir"). */
  highlights?: string[];
  /** Show a "Réservé" ribbon and disable the primary CTA. */
  reserved?: boolean;
  /** Long-form description shown on the detail page. */
  description?: string;
  /** Free-form spec pairs — power, torque, 0-100, etc. Used by VehicleSpecs. */
  specs?: Array<{ label: string; value: string }>;
  /** Optional equipment list. */
  equipment?: string[];
  /** Engine displacement in liters, for spec grid. */
  engineDisplacement?: string;
  /** Body style, e.g. "SUV", "Berline". */
  bodyStyle?: string;
  /** Exterior colour label. */
  color?: string;
}



/** Format a DZD amount the way Oran buyers read prices. */
export function formatPriceDzd(price: number | null, locale: "fr" | "ar" = "fr"): string {
  if (price == null) {
    return locale === "ar" ? "السعر عند الطلب" : "Prix sur demande";
  }
  const bcp47 = locale === "ar" ? "ar-DZ" : "fr-DZ";
  return new Intl.NumberFormat(bcp47, {
    style: "decimal",
    maximumFractionDigits: 0,
  }).format(price) + (locale === "ar" ? " دج" : " DA");
}

export function formatMileage(km: number, locale: "fr" | "ar" = "fr"): string {
  const bcp47 = locale === "ar" ? "ar-DZ" : "fr-DZ";
  const value = new Intl.NumberFormat(bcp47).format(km);
  return locale === "ar" ? `${value} كم` : `${value} km`;
}
