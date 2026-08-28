/*
# Create cars table + car-images storage bucket

1. New Tables
- `cars` — the dealership's vehicle inventory. Direct match to the app's
  existing `Vehicle` shape (from src/lib/vehicles.ts), but with bilingual
  columns (fr/ar pairs) and a `status` enum replacing the old ad-hoc
  `reserved: true` boolean.
  Columns:
  - id (uuid, PK, default gen_random_uuid())
  - slug (text, unique, not null) — used for the vehicle detail page URL
  - brand (text, not null)
  - model (text, not null)
  - year (int, not null)
  - price_dzd (numeric, nullable) — null = "Prix sur demande"
  - mileage_km (int, not null, default 0)
  - fuel (text, not null) — essence | diesel | electrique | hybride
  - transmission (text, not null) — automatique | manuelle
  - condition (text, not null) — neuf | occasion
  - body_style (text, not null)
  - color (text, not null)
  - engine_displacement (text, not null)
  - tagline_fr (text, not null)
  - tagline_ar (text, not null)
  - description_fr (text, not null)
  - description_ar (text, not null)
  - images (text[], not null default '{}') — Supabase Storage URLs in order
  - highlights_fr (text[], not null default '{}')
  - highlights_ar (text[], not null default '{}')
  - equipment_fr (text[], not null default '{}')
  - equipment_ar (text[], not null default '{}')
  - specs (jsonb, not null default '[]') — array of
    { label_fr, label_ar, value } objects
  - status (text, not null, default 'disponible') —
    disponible | reserve | vendu
  - featured (boolean, not null, default false)
  - created_at (timestamptz, not null, default now())

2. Storage
- Create a public bucket `car-images` for vehicle photos.
- Public read access for the bucket (anyone can view car photos).
- Upload/update/delete restricted to authenticated users (the owner).

3. Security
- Enable RLS on `cars`.
- Public (anon) role: SELECT only — so the public site can list vehicles
  but cannot mutate them.
- Authenticated role (the single owner account): full SELECT, INSERT,
  UPDATE, DELETE — the owner manages the entire inventory.
- No user_id column: this is a single shared inventory table, not
  per-user data. The owner is the only authenticated account, created
  manually in the Supabase dashboard; ownership is implicit in being
  authenticated at all.

4. Important notes
- This migration is idempotent: safe to re-run.
- The `cars` table is the single source of truth for inventory; the old
  src/lib/mockData.ts is replaced by live Supabase reads in the app.
- Price handling: price_dzd is nullable. The app must render
  "Prix sur demande" when null (cards, detail page, WhatsApp message).
- Bilingual content: the owner enters FR and AR content manually; there
  is no automated translation.
*/

-- ─────────────────────────────────────────────
-- 1. cars table
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cars (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  brand text NOT NULL,
  model text NOT NULL,
  year int NOT NULL,
  price_dzd numeric NULL,
  mileage_km int NOT NULL DEFAULT 0,
  fuel text NOT NULL CHECK (fuel IN ('essence','diesel','electrique','hybride')),
  transmission text NOT NULL CHECK (transmission IN ('automatique','manuelle')),
  condition text NOT NULL CHECK (condition IN ('neuf','occasion')),
  body_style text NOT NULL,
  color text NOT NULL,
  engine_displacement text NOT NULL,
  tagline_fr text NOT NULL,
  tagline_ar text NOT NULL,
  description_fr text NOT NULL,
  description_ar text NOT NULL,
  images text[] NOT NULL DEFAULT '{}',
  highlights_fr text[] NOT NULL DEFAULT '{}',
  highlights_ar text[] NOT NULL DEFAULT '{}',
  equipment_fr text[] NOT NULL DEFAULT '{}',
  equipment_ar text[] NOT NULL DEFAULT '{}',
  specs jsonb NOT NULL DEFAULT '[]',
  status text NOT NULL DEFAULT 'disponible' CHECK (status IN ('disponible','reserve','vendu')),
  featured boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE cars ENABLE ROW LEVEL SECURITY;

-- Public read (anon + authenticated)
DROP POLICY IF EXISTS "public_select_cars" ON cars;
CREATE POLICY "public_select_cars"
  ON cars FOR SELECT
  TO anon, authenticated
  USING (true);

-- Owner full CRUD (authenticated only)
DROP POLICY IF EXISTS "owner_insert_cars" ON cars;
CREATE POLICY "owner_insert_cars"
  ON cars FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "owner_update_cars" ON cars;
CREATE POLICY "owner_update_cars"
  ON cars FOR UPDATE
  TO authenticated
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "owner_delete_cars" ON cars;
CREATE POLICY "owner_delete_cars"
  ON cars FOR DELETE
  TO authenticated
  USING (true);

-- Helpful index for the public listing (featured first, newest first)
CREATE INDEX IF NOT EXISTS cars_status_featured_created_at_idx
  ON cars (status, featured, created_at DESC);

-- ─────────────────────────────────────────────
-- 2. car-images storage bucket (public read)
-- ─────────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public)
VALUES ('car-images', 'car-images', true)
ON CONFLICT (id) DO NOTHING;

-- Public read of objects in car-images
DROP POLICY IF EXISTS "public_read_car_images" ON storage.objects;
CREATE POLICY "public_read_car_images"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'car-images');

-- Owner can upload/replace/delete images
DROP POLICY IF EXISTS "owner_insert_car_images" ON storage.objects;
CREATE POLICY "owner_insert_car_images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'car-images');

DROP POLICY IF EXISTS "owner_update_car_images" ON storage.objects;
CREATE POLICY "owner_update_car_images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'car-images') WITH CHECK (bucket_id = 'car-images');

DROP POLICY IF EXISTS "owner_delete_car_images" ON storage.objects;
CREATE POLICY "owner_delete_car_images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'car-images');
