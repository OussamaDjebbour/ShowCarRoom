/**
 * Shared vehicle types.
 *
 * The database `cars` table stores bilingual content in fr/ar column pairs.
 * The public-facing components were originally written against the
 * single-language mock shape (tagline, description, highlights, equipment,
 * specs). To avoid rewriting those components, we keep that public
 * `Vehicle` interface and add a `CarRow` type that mirrors the DB schema,
 * plus a `rowToVehicle()` mapper that picks the active locale's strings.
 */

export type FuelType = "essence" | "diesel" | "hybride" | "electrique";
export type Transmission = "manuelle" | "automatique";
export type VehicleCondition = "neuf" | "occasion";
export type VehicleStatus = "disponible" | "reserve" | "vendu";
export type Locale = "fr" | "ar";

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
  /** Hero + gallery image URLs. */
  images: string[];
  /** Chips shown on the card (e.g. "Toit ouvrant", "Cuir"). */
  highlights?: string[];
  /** Show a "Réservé" / "Vendu" ribbon and disable the primary CTA. */
  reserved?: boolean;
  /** Long-form description shown on the detail page. */
  description?: string;
  /** Free-form spec pairs — power, torque, 0-100, etc. */
  specs?: Array<{ label: string; value: string }>;
  /** Optional equipment list. */
  equipment?: string[];
  /** Engine displacement, e.g. "3.0 L V6". */
  engineDisplacement?: string;
  /** Body style, e.g. "SUV", "Berline". */
  bodyStyle?: string;
  /** Exterior colour label. */
  color?: string;
  /** Whether the car is featured on the home grid. */
  featured?: boolean;
  /** Lifecycle status. */
  status?: VehicleStatus;
}

/** A spec row as stored in the jsonb `specs` column. */
export interface SpecRow {
  label_fr: string;
  label_ar: string;
  value: string;
}

/**
 * `CarRow` mirrors the database `cars` table 1:1 (snake_case columns).
 * Used by the admin form and the data hooks.
 */
export interface CarRow {
  id: string;
  slug: string;
  brand: string;
  model: string;
  year: number;
  price_dzd: number | null;
  mileage_km: number;
  fuel: FuelType;
  transmission: Transmission;
  condition: VehicleCondition;
  body_style: string;
  color: string;
  engine_displacement: string;
  tagline_fr: string;
  tagline_ar: string;
  description_fr: string;
  description_ar: string;
  images: string[];
  highlights_fr: string[];
  highlights_ar: string[];
  equipment_fr: string[];
  equipment_ar: string[];
  specs: SpecRow[];
  status: VehicleStatus;
  featured: boolean;
  created_at: string;
}

/** Payload for inserting/updating a car. Omits id/created_at (DB-managed). */
export type CarInput = Omit<CarRow, "id" | "created_at">;

/**
 * Map a DB row to the public `Vehicle` shape for the active locale.
 * The public components keep using `tagline`/`description`/etc. and stay
 * single-language from their perspective.
 */
export function rowToVehicle(row: CarRow, locale: Locale): Vehicle {
  const isAr = locale === "ar";
  return {
    id: row.id,
    slug: row.slug,
    brand: row.brand,
    model: row.model,
    year: row.year,
    priceDzd: row.price_dzd == null ? null : Number(row.price_dzd),
    mileageKm: row.mileage_km,
    fuel: row.fuel,
    transmission: row.transmission,
    condition: row.condition,
    tagline: isAr ? row.tagline_ar : row.tagline_fr,
    description: isAr ? row.description_ar : row.description_fr,
    images: row.images ?? [],
    highlights: (isAr ? row.highlights_ar : row.highlights_fr) ?? [],
    equipment: (isAr ? row.equipment_ar : row.equipment_fr) ?? [],
    specs: (row.specs ?? []).map((s) => ({
      label: isAr ? s.label_ar : s.label_fr,
      value: s.value,
    })),
    engineDisplacement: row.engine_displacement,
    bodyStyle: row.body_style,
    color: row.color,
    featured: row.featured,
    status: row.status,
    // Back-compat: the old UI used `reserved: true` to show a ribbon.
    reserved: row.status === "reserve" || row.status === "vendu",
  };
}

/** Format a DZD amount the way Oran buyers read prices. */
export function formatPriceDzd(price: number | null, locale: "fr" | "ar" = "fr"): string {
  if (price == null) {
    return locale === "ar" ? "السعر عند الطلب" : "Prix sur demande";
  }
  const bcp47 = locale === "ar" ? "ar-DZ" : "fr-DZ";
  return (
    new Intl.NumberFormat(bcp47, {
      style: "decimal",
      maximumFractionDigits: 0,
    }).format(price) + (locale === "ar" ? " دج" : " DA")
  );
}

export function formatMileage(km: number, locale: "fr" | "ar" = "fr"): string {
  const bcp47 = locale === "ar" ? "ar-DZ" : "fr-DZ";
  const value = new Intl.NumberFormat(bcp47).format(km);
  return locale === "ar" ? `${value} كم` : `${value} km`;
}
