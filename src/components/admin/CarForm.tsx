import * as React from "react";
import { useNavigate } from "@tanstack/react-router";
import { Loader as Loader2, Save, CircleAlert as AlertCircle, Plus, Trash2 } from "lucide-react";

import { useCreateCar, useUpdateCar } from "@/hooks/useCars";
import { ImageUploader } from "./ImageUploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type {
  CarInput,
  CarRow,
  FuelType,
  Transmission,
  VehicleCondition,
  VehicleStatus,
  SpecRow,
} from "@/lib/vehicles";

/**
 * CarForm — the add/edit form for a single car. Handles all schema fields
 * with bilingual FR/AR pairing, validation (required + numeric constraints
 * + FR/AR pair completeness), and image upload.
 */

const fuelOptions: { value: FuelType; label: string }[] = [
  { value: "essence", label: "Essence" },
  { value: "diesel", label: "Diesel" },
  { value: "hybride", label: "Hybride" },
  { value: "electrique", label: "Électrique" },
];

const transmissionOptions: { value: Transmission; label: string }[] = [
  { value: "automatique", label: "Automatique" },
  { value: "manuelle", label: "Manuelle" },
];

const conditionOptions: { value: VehicleCondition; label: string }[] = [
  { value: "neuf", label: "Neuf" },
  { value: "occasion", label: "Occasion" },
];

const statusOptions: { value: VehicleStatus; label: string }[] = [
  { value: "disponible", label: "Disponible" },
  { value: "reserve", label: "Réservé" },
  { value: "vendu", label: "Vendu" },
];

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

interface FormState {
  slug: string;
  brand: string;
  model: string;
  year: string;
  priceEnabled: boolean;
  price_dzd: string;
  mileage_km: string;
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
}

function emptyForm(): FormState {
  return {
    slug: "",
    brand: "",
    model: "",
    year: String(new Date().getFullYear()),
    priceEnabled: true,
    price_dzd: "",
    mileage_km: "0",
    fuel: "essence",
    transmission: "automatique",
    condition: "occasion",
    body_style: "",
    color: "",
    engine_displacement: "",
    tagline_fr: "",
    tagline_ar: "",
    description_fr: "",
    description_ar: "",
    images: [],
    highlights_fr: [],
    highlights_ar: [],
    equipment_fr: [],
    equipment_ar: [],
    specs: [],
    status: "disponible",
    featured: false,
  };
}

function rowToForm(row: CarRow): FormState {
  return {
    slug: row.slug,
    brand: row.brand,
    model: row.model,
    year: String(row.year),
    priceEnabled: row.price_dzd != null,
    price_dzd: row.price_dzd == null ? "" : String(row.price_dzd),
    mileage_km: String(row.mileage_km),
    fuel: row.fuel,
    transmission: row.transmission,
    condition: row.condition,
    body_style: row.body_style,
    color: row.color,
    engine_displacement: row.engine_displacement,
    tagline_fr: row.tagline_fr,
    tagline_ar: row.tagline_ar,
    description_fr: row.description_fr,
    description_ar: row.description_ar,
    images: row.images ?? [],
    highlights_fr: row.highlights_fr ?? [],
    highlights_ar: row.highlights_ar ?? [],
    equipment_fr: row.equipment_fr ?? [],
    equipment_ar: row.equipment_ar ?? [],
    specs: row.specs ?? [],
    status: row.status,
    featured: row.featured,
  };
}

interface CarFormProps {
  car?: CarRow | null;
}

export function CarForm({ car }: CarFormProps) {
  const navigate = useNavigate();
  const createCar = useCreateCar();
  const updateCar = useUpdateCar();
  const isEdit = !!car;

  const [form, setForm] = React.useState<FormState>(() => (car ? rowToForm(car) : emptyForm()));
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [slugTouched, setSlugTouched] = React.useState(isEdit);

  // Auto-generate slug from brand/model/year until manually edited.
  React.useEffect(() => {
    if (slugTouched) return;
    const base = slugify(`${form.brand} ${form.model} ${form.year}`.trim());
    setForm((f) => ({ ...f, slug: base }));
  }, [form.brand, form.model, form.year, slugTouched]);

  const set = <K extends keyof FormState>(key: K, val: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.brand.trim()) e.brand = "Requis";
    if (!form.model.trim()) e.model = "Requis";
    const year = Number(form.year);
    if (!form.year.trim() || isNaN(year)) e.year = "Année invalide";
    else if (year < 1900 || year > new Date().getFullYear() + 1) e.year = "Année hors plage";
    if (form.priceEnabled) {
      const p = Number(form.price_dzd);
      if (!form.price_dzd.trim() || isNaN(p)) e.price_dzd = "Prix invalide";
      else if (p <= 0) e.price_dzd = "Le prix doit être positif";
    }
    const km = Number(form.mileage_km);
    if (form.mileage_km.trim() === "" || isNaN(km)) e.mileage_km = "Kilométrage invalide";
    else if (km < 0) e.mileage_km = "Ne peut pas être négatif";
    if (!form.body_style.trim()) e.body_style = "Requis";
    if (!form.color.trim()) e.color = "Requis";
    if (!form.engine_displacement.trim()) e.engine_displacement = "Requis";
    if (!form.tagline_fr.trim() && !form.tagline_ar.trim())
      e.tagline = "Au moins une langue requise";
    else if (!form.tagline_fr.trim()) e.tagline = "Le français est vide";
    else if (!form.tagline_ar.trim()) e.tagline = "L'arabe est vide";
    if (!form.description_fr.trim() && !form.description_ar.trim())
      e.description = "Au moins une langue requise";
    else if (!form.description_fr.trim()) e.description = "Le français est vide";
    else if (!form.description_ar.trim()) e.description = "L'arabe est vide";
    if (!form.slug.trim()) e.slug = "Requis";
    // Paired arrays must match in length
    if (form.highlights_fr.length !== form.highlights_ar.length)
      e.highlights = "Les listes FR et AR doivent avoir le même nombre d'éléments";
    if (form.equipment_fr.length !== form.equipment_ar.length)
      e.equipment = "Les listes FR et AR doivent avoir le même nombre d'éléments";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const buildInput = (): CarInput => ({
    slug: form.slug.trim(),
    brand: form.brand.trim(),
    model: form.model.trim(),
    year: Number(form.year),
    price_dzd: form.priceEnabled ? Number(form.price_dzd) : null,
    mileage_km: Number(form.mileage_km),
    fuel: form.fuel,
    transmission: form.transmission,
    condition: form.condition,
    body_style: form.body_style.trim(),
    color: form.color.trim(),
    engine_displacement: form.engine_displacement.trim(),
    tagline_fr: form.tagline_fr.trim(),
    tagline_ar: form.tagline_ar.trim(),
    description_fr: form.description_fr.trim(),
    description_ar: form.description_ar.trim(),
    images: form.images,
    highlights_fr: form.highlights_fr,
    highlights_ar: form.highlights_ar,
    equipment_fr: form.equipment_fr,
    equipment_ar: form.equipment_ar,
    specs: form.specs,
    status: form.status,
    featured: form.featured,
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const input = buildInput();
    if (isEdit && car) {
      await updateCar.mutateAsync({ id: car.id, input });
    } else {
      await createCar.mutateAsync(input);
    }
    navigate({ to: "/admin" });
  };

  const submitting = createCar.isPending || updateCar.isPending;

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-10" noValidate>
      {/* Core fields */}
      <Section title="Informations générales" eyebrow="Étape 1">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Marque" error={errors.brand} required>
            <Input value={form.brand} onChange={(e) => set("brand", e.target.value)} />
          </Field>
          <Field label="Modèle" error={errors.model} required>
            <Input value={form.model} onChange={(e) => set("model", e.target.value)} />
          </Field>
          <Field label="Année" error={errors.year} required>
            <Input
              type="number"
              value={form.year}
              onChange={(e) => set("year", e.target.value)}
              dir="ltr"
            />
          </Field>
          <Field label="Carburant" required>
            <Select
              value={form.fuel}
              onChange={(v) => set("fuel", v as FuelType)}
              options={fuelOptions}
            />
          </Field>
          <Field label="Boîte" required>
            <Select
              value={form.transmission}
              onChange={(v) => set("transmission", v as Transmission)}
              options={transmissionOptions}
            />
          </Field>
          <Field label="État" required>
            <Select
              value={form.condition}
              onChange={(v) => set("condition", v as VehicleCondition)}
              options={conditionOptions}
            />
          </Field>
          <Field label="Carrosserie" error={errors.body_style} required>
            <Input
              value={form.body_style}
              onChange={(e) => set("body_style", e.target.value)}
              placeholder="SUV, Berline…"
            />
          </Field>
          <Field label="Couleur" error={errors.color} required>
            <Input value={form.color} onChange={(e) => set("color", e.target.value)} />
          </Field>
          <Field label="Motorisation" error={errors.engine_displacement} required>
            <Input
              value={form.engine_displacement}
              onChange={(e) => set("engine_displacement", e.target.value)}
              placeholder="3.0 L V6"
            />
          </Field>
          <Field label="Kilométrage (km)" error={errors.mileage_km} required>
            <Input
              type="number"
              min="0"
              value={form.mileage_km}
              onChange={(e) => set("mileage_km", e.target.value)}
              dir="ltr"
            />
          </Field>
          <Field label="Statut" required>
            <Select
              value={form.status}
              onChange={(v) => set("status", v as VehicleStatus)}
              options={statusOptions}
            />
          </Field>
          <div className="flex items-end gap-3">
            <label className="flex cursor-pointer items-center gap-2 text-body-sm text-foreground/90">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => set("featured", e.target.checked)}
                className="size-4 accent-[var(--color-gold)]"
              />
              En vedette
            </label>
          </div>
        </div>

        {/* Price toggle */}
        <div className="mt-5 rounded-xl border border-hairline bg-surface/40 p-4">
          <label className="flex cursor-pointer items-center gap-2 text-body-sm text-foreground/90">
            <input
              type="checkbox"
              checked={form.priceEnabled}
              onChange={(e) => set("priceEnabled", e.target.checked)}
              className="size-4 accent-[var(--color-gold)]"
            />
            Prix affiché
          </label>
          {form.priceEnabled ? (
            <div className="mt-3">
              <Field label="Prix (DZD)" error={errors.price_dzd} required>
                <Input
                  type="number"
                  min="1"
                  step="1"
                  value={form.price_dzd}
                  onChange={(e) => set("price_dzd", e.target.value)}
                  placeholder="12 900 000"
                  dir="ltr"
                />
              </Field>
            </div>
          ) : (
            <p className="text-body-sm text-muted-foreground mt-3">
              Le prix s'affichera comme « Prix sur demande » sur le site public.
            </p>
          )}
        </div>

        {/* Slug */}
        <div className="mt-5">
          <Field label="Slug (URL)" error={errors.slug} required>
            <Input
              value={form.slug}
              onChange={(e) => {
                setSlugTouched(true);
                set("slug", e.target.value);
              }}
              placeholder="bmw-x5-xdrive40i-2024"
              dir="ltr"
            />
          </Field>
        </div>
      </Section>

      {/* Bilingual text */}
      <Section title="Textes bilingues" eyebrow="Étape 2">
        <div className="grid gap-5 lg:grid-cols-2">
          <Field label="Accroche (Français)" error={errors.tagline} required>
            <Input
              value={form.tagline_fr}
              onChange={(e) => set("tagline_fr", e.target.value)}
              placeholder="Pack AMG Line, intérieur cuir Nappa…"
            />
          </Field>
          <Field label="Accroche (العربية)" error={errors.tagline} required dir="rtl">
            <Input
              value={form.tagline_ar}
              onChange={(e) => set("tagline_ar", e.target.value)}
              placeholder="حزمة AMG، جلد Nappa…"
              dir="rtl"
              lang="ar"
            />
          </Field>
          <Field label="Description (Français)" error={errors.description} required>
            <Textarea
              rows={5}
              value={form.description_fr}
              onChange={(e) => set("description_fr", e.target.value)}
            />
          </Field>
          <Field label="Description (العربية)" error={errors.description} required dir="rtl">
            <Textarea
              rows={5}
              value={form.description_ar}
              onChange={(e) => set("description_ar", e.target.value)}
              dir="rtl"
              lang="ar"
            />
          </Field>
        </div>
      </Section>

      {/* Highlights */}
      <Section title="Points forts" eyebrow="Étape 3">
        <PairedListEditor
          frValues={form.highlights_fr}
          arValues={form.highlights_ar}
          onChangeFr={(v) => set("highlights_fr", v)}
          onChangeAr={(v) => set("highlights_ar", v)}
          frPlaceholder="Pack AMG"
          arPlaceholder="حزمة AMG"
          error={errors.highlights}
        />
      </Section>

      {/* Equipment */}
      <Section title="Équipement" eyebrow="Étape 4">
        <PairedListEditor
          frValues={form.equipment_fr}
          arValues={form.equipment_ar}
          onChangeFr={(v) => set("equipment_fr", v)}
          onChangeAr={(v) => set("equipment_ar", v)}
          frPlaceholder="Toit ouvrant panoramique"
          arPlaceholder="سقف بانورامي"
          error={errors.equipment}
        />
      </Section>

      {/* Specs */}
      <Section title="Spécifications" eyebrow="Étape 5">
        <SpecsEditor specs={form.specs} onChange={(s) => set("specs", s)} />
      </Section>

      {/* Images */}
      <Section title="Photos" eyebrow="Étape 6">
        <ImageUploader
          value={form.images}
          onChange={(urls) => set("images", urls)}
          carId={car?.id}
        />
      </Section>

      {/* Submit */}
      <div className="flex flex-wrap items-center gap-3 border-t border-hairline pt-6">
        <Button type="submit" variant="gold" size="lg" disabled={submitting}>
          {submitting ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Enregistrement…
            </>
          ) : (
            <>
              <Save aria-hidden />
              {isEdit ? "Enregistrer les modifications" : "Ajouter le véhicule"}
            </>
          )}
        </Button>
        <Button type="button" variant="ghost" size="lg" onClick={() => navigate({ to: "/admin" })}>
          Annuler
        </Button>
        {Object.keys(errors).length > 0 ? (
          <span className="inline-flex items-center gap-2 text-body-sm text-destructive">
            <AlertCircle className="size-4" aria-hidden />
            Vérifiez les champs en erreur.
          </span>
        ) : null}
      </div>
    </form>
  );
}

/* ─── Reusable form primitives ─── */

function Section({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4">
      <div>
        <p className="text-eyebrow">{eyebrow}</p>
        <h2 className="text-h2 mt-1">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Field({
  label,
  error,
  required,
  dir,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  dir?: "rtl" | "ltr";
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2" dir={dir}>
      <Label>
        {label}
        {required ? <span className="text-destructive"> *</span> : null}
      </Label>
      {children}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:text-sm"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value} className="bg-background text-foreground">
          {o.label}
        </option>
      ))}
    </select>
  );
}

/** Paired FR/AR repeatable list editor. Rows are visually paired. */
function PairedListEditor({
  frValues,
  arValues,
  onChangeFr,
  onChangeAr,
  frPlaceholder,
  arPlaceholder,
  error,
}: {
  frValues: string[];
  arValues: string[];
  onChangeFr: (v: string[]) => void;
  onChangeAr: (v: string[]) => void;
  frPlaceholder: string;
  arPlaceholder: string;
  error?: string;
}) {
  // Keep the two lists the same length, padding with empty strings.
  const maxLen = Math.max(frValues.length, arValues.length, 0);
  const rows = Array.from({ length: maxLen }, (_, i) => ({
    fr: frValues[i] ?? "",
    ar: arValues[i] ?? "",
  }));

  const update = (i: number, side: "fr" | "ar", val: string) => {
    if (side === "fr") {
      const next = [...frValues];
      while (next.length <= i) next.push("");
      next[i] = val;
      onChangeFr(next);
    } else {
      const next = [...arValues];
      while (next.length <= i) next.push("");
      next[i] = val;
      onChangeAr(next);
    }
  };

  const addRow = () => {
    onChangeFr([...frValues, ""]);
    onChangeAr([...arValues, ""]);
  };

  const removeRow = (i: number) => {
    onChangeFr(frValues.filter((_, idx) => idx !== i));
    onChangeAr(arValues.filter((_, idx) => idx !== i));
  };

  return (
    <div className="flex flex-col gap-3">
      {rows.map((row, i) => (
        <div key={i} className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Input
            value={row.fr}
            onChange={(e) => update(i, "fr", e.target.value)}
            placeholder={frPlaceholder}
            className="sm:flex-1"
          />
          <Input
            value={row.ar}
            onChange={(e) => update(i, "ar", e.target.value)}
            placeholder={arPlaceholder}
            dir="rtl"
            lang="ar"
            className="sm:flex-1"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => removeRow(i)}
            aria-label="Supprimer cette ligne"
            className="shrink-0"
          >
            <Trash2 className="size-4 text-destructive" />
          </Button>
        </div>
      ))}
      <div className="flex items-center gap-3">
        <Button type="button" variant="outline" size="sm" onClick={addRow}>
          <Plus aria-hidden />
          Ajouter une ligne
        </Button>
        {error ? <p className="text-xs text-destructive">{error}</p> : null}
      </div>
    </div>
  );
}

/** Specs editor: each row has label_fr, label_ar, and a shared value. */
function SpecsEditor({ specs, onChange }: { specs: SpecRow[]; onChange: (s: SpecRow[]) => void }) {
  const update = (i: number, field: keyof SpecRow, val: string) => {
    const next = [...specs];
    next[i] = { ...next[i], [field]: val };
    onChange(next);
  };
  const add = () => onChange([...specs, { label_fr: "", label_ar: "", value: "" }]);
  const remove = (i: number) => onChange(specs.filter((_, idx) => idx !== i));

  return (
    <div className="flex flex-col gap-3">
      {specs.map((spec, i) => (
        <div key={i} className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Input
            value={spec.label_fr}
            onChange={(e) => update(i, "label_fr", e.target.value)}
            placeholder="Puissance"
            className="sm:flex-1"
          />
          <Input
            value={spec.label_ar}
            onChange={(e) => update(i, "label_ar", e.target.value)}
            placeholder="قوة"
            dir="rtl"
            lang="ar"
            className="sm:flex-1"
          />
          <Input
            value={spec.value}
            onChange={(e) => update(i, "value", e.target.value)}
            placeholder="258 ch"
            dir="ltr"
            className="sm:flex-1"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => remove(i)}
            aria-label="Supprimer cette ligne"
            className="shrink-0"
          >
            <Trash2 className="size-4 text-destructive" />
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={add}>
        <Plus aria-hidden />
        Ajouter une spécification
      </Button>
    </div>
  );
}
