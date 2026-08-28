import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Phone, Copy, Check, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WhatsAppButton } from "./WhatsAppButton";
import { VehicleGallery } from "./VehicleGallery";
import { VehicleSpecs } from "./VehicleSpecs";
import { TrustBadge } from "./TrustBadge";
import { formatPriceDzd, type Vehicle } from "@/lib/vehicles";
import { siteConfig } from "@/lib/siteConfig";
import { cn } from "@/lib/utils";
import { ShieldCheck, Wrench, Banknote, MapPin } from "lucide-react";

/**
 * VehicleDetailPage — full-screen overlay presenting a single vehicle.
 *
 * Stage 6 uses a state-toggle (no routing): parent controls `open` +
 * `onClose`. When Stage 7+ introduces the `/vehicules/$slug` route, the
 * same composition is reused inside a route file.
 *
 * Composition:
 *   [back] [brand · model / year]                [close]
 *   [VehicleGallery]           [price + condition + tagline + CTAs]
 *   [VehicleSpecs (full width)]
 *   [Trust strip]
 *
 * Desktop CTA fallback: on wider screens the "Appeler" button reveals the
 * phone number inline with a copy-to-clipboard action (mobile just dials).
 */
export interface VehicleDetailPageProps {
  vehicle: Vehicle | null;
  open: boolean;
  onClose: () => void;
  locale?: "fr" | "ar";
}

export function VehicleDetailPage({
  vehicle,
  open,
  onClose,
  locale = "fr",
}: VehicleDetailPageProps) {
  const dialogRef = React.useRef<HTMLDivElement>(null);

  // Lock body scroll while open, restore on close/unmount.
  React.useEffect(() => {
    if (typeof document === "undefined") return;
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  // Close on Escape.
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Focus management: move focus into the dialog on open, trap Tab within it,
  // and restore focus to the previously-focused element (the trigger) on close.
  React.useEffect(() => {
    if (!open || !vehicle) return;
    const node = dialogRef.current;
    if (!node) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const focusable = () =>
      Array.from(
        node.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => el.offsetParent !== null);

    (focusable()[0] ?? node).focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const items = focusable();
      if (items.length === 0) {
        e.preventDefault();
        node.focus();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    node.addEventListener("keydown", onKeyDown);
    return () => {
      node.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [open, vehicle]);

  return (
    <AnimatePresence>
      {open && vehicle ? (
        <motion.div
          key={vehicle.id}
          ref={dialogRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-label={`${vehicle.brand} ${vehicle.model} ${vehicle.year}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[70] overflow-y-auto bg-background/95 backdrop-blur-2xl focus:outline-none"
        >
          <DetailContent vehicle={vehicle} onClose={onClose} locale={locale} />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function DetailContent({
  vehicle,
  onClose,
  locale,
}: {
  vehicle: Vehicle;
  onClose: () => void;
  locale: "fr" | "ar";
}) {
  const isAr = locale === "ar";
  const label = (fr: string, ar: string) => (isAr ? ar : fr);

  const waMessage = isAr
    ? `مرحبا، أنا مهتم بـ ${vehicle.brand} ${vehicle.model} (${vehicle.year}) المعروضة على موقعكم.`
    : `Bonjour, je suis intéressé par la ${vehicle.brand} ${vehicle.model} (${vehicle.year}) publiée sur votre site.`;

  return (
    <motion.div
      initial={{ y: 24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 16, opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto flex min-h-full max-w-7xl flex-col px-4 pb-24 pt-6 sm:px-6 sm:pt-10 lg:px-8"
    >
      {/* Top bar */}
      <div className="mb-8 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onClose}
          className="text-body-sm inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-hairline bg-surface/60 px-4 py-2 font-medium text-foreground/85 backdrop-blur transition-colors hover:border-gold/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden />
          {label("Retour à l'inventaire", "العودة إلى المعرض")}
        </button>
        <button
          type="button"
          onClick={onClose}
          aria-label={label("Fermer", "إغلاق")}
          className="grid size-11 cursor-pointer place-items-center rounded-full border border-hairline bg-surface/60 text-foreground/85 backdrop-blur transition-colors hover:border-destructive/50 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X className="size-4" aria-hidden />
        </button>
      </div>

      {/* Header */}
      <header className="mb-10 flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={vehicle.condition === "neuf" ? "solid" : "gold"} size="sm">
            {vehicle.condition === "neuf" ? label("Neuf", "جديدة") : label("Occasion", "مستعملة")}
          </Badge>
          {vehicle.reserved ? (
            <Badge variant="destructive" size="sm">
              {label("Réservé", "محجوزة")}
            </Badge>
          ) : null}
          <span className="text-eyebrow">{vehicle.brand}</span>
        </div>
        <h1 className="text-display-lg sm:text-display-xl">
          {vehicle.model}{" "}
          <span className="text-foreground/60 tabular-nums" dir="ltr">
            {vehicle.year}
          </span>
        </h1>
        {vehicle.tagline ? (
          <p className="text-body-lg text-muted-foreground max-w-2xl">{vehicle.tagline}</p>
        ) : null}
      </header>

      {/* Gallery + Summary card */}
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-10">
        <VehicleGallery images={vehicle.images} alt={`${vehicle.brand} ${vehicle.model}`} />

        <PriceCard vehicle={vehicle} waMessage={waMessage} locale={locale} />
      </div>

      {/* Description */}
      {vehicle.description ? (
        <section className="mt-14 max-w-3xl">
          <p className="text-eyebrow">{label("À propos", "عن السيارة")}</p>
          <p className="text-body mt-4 text-foreground/90 leading-relaxed">{vehicle.description}</p>
        </section>
      ) : null}

      {/* Specs */}
      <section className="mt-14">
        <VehicleSpecs vehicle={vehicle} locale={locale} />
      </section>

      {/* Trust strip */}
      <section className="mt-16 border-t border-hairline pt-10">
        <ul className="flex flex-wrap gap-2 sm:gap-3">
          <li>
            <TrustBadge icon={ShieldCheck} label={label("Concessionnaire agréé", "وكيل معتمد")} />
          </li>
          <li>
            <TrustBadge
              icon={Wrench}
              label={label("Contrôle atelier 120 points", "فحص فني 120 نقطة")}
            />
          </li>
          <li>
            <TrustBadge icon={Banknote} label={label("Financement disponible", "تمويل متاح")} />
          </li>
          <li>
            <TrustBadge
              icon={MapPin}
              label={label("Essai au showroom d'Oran", "تجربة في معرض وهران")}
            />
          </li>
        </ul>
      </section>
    </motion.div>
  );
}

function PriceCard({
  vehicle,
  waMessage,
  locale,
}: {
  vehicle: Vehicle;
  waMessage: string;
  locale: "fr" | "ar";
}) {
  const isAr = locale === "ar";
  const label = (fr: string, ar: string) => (isAr ? ar : fr);
  const [phoneVisible, setPhoneVisible] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const phone = siteConfig.dealership.phone;
  const telHref = `tel:${phone.replace(/[^\d+]/g, "")}`;

  const onCall = () => {
    // Mobile: trigger native dialer via link (rendered as <a> below).
    // Desktop: reveal the number inline as a fallback.
    if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
      window.location.href = telHref;
      return;
    }
    setPhoneVisible(true);
  };

  const copyPhone = async () => {
    try {
      await navigator.clipboard.writeText(phone);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  };

  return (
    <aside className={cn("surface-card sticky top-24 flex h-fit flex-col gap-6 p-6 sm:p-8")}>
      <div>
        <p className="text-caption text-muted-foreground">
          {label("Prix affiché", "السعر المعروض")}
        </p>
        <p className="text-odometer mt-2 text-4xl text-gold" dir="ltr">
          {formatPriceDzd(vehicle.priceDzd, locale)}
        </p>
        {vehicle.priceDzd != null ? (
          <p className="text-caption text-muted-foreground mt-2">
            {label(
              "Négociation possible · dossier de financement sur demande",
              "قابل للتفاوض · ملف تمويل عند الطلب",
            )}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-3 border-t border-hairline pt-6">
        <WhatsAppButton
          phone={siteConfig.dealership.whatsapp}
          message={waMessage}
          label={label("Discuter sur WhatsApp", "الدردشة عبر واتساب")}
          size="lg"
          className="w-full"
        />

        {phoneVisible ? (
          <div className="rounded-xl border border-hairline bg-surface/60 p-4">
            <p className="text-caption text-muted-foreground">
              {label("Appelez-nous", "اتصل بنا")}
            </p>
            <div className="mt-2 flex items-center justify-between gap-3">
              <a
                href={telHref}
                dir="ltr"
                className="text-h3 tabular-nums text-foreground transition-colors hover:text-gold"
              >
                {phone}
              </a>
              <button
                type="button"
                onClick={copyPhone}
                aria-label={label("Copier le numéro", "نسخ الرقم")}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-hairline bg-background/40 px-3 py-2 text-xs font-medium text-foreground/85 transition-colors hover:border-gold/50 hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {copied ? (
                  <>
                    <Check className="size-3.5 text-success" aria-hidden />
                    {label("Copié", "تم النسخ")}
                  </>
                ) : (
                  <>
                    <Copy className="size-3.5" aria-hidden />
                    {label("Copier", "نسخ")}
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <Button type="button" variant="outline" size="lg" className="w-full" onClick={onCall}>
            <Phone aria-hidden />
            {label("Appeler le showroom", "اتصل بالمعرض")}
          </Button>
        )}
      </div>

      <ul className="grid gap-2 border-t border-hairline pt-6 text-body-sm text-muted-foreground">
        <li className="flex items-center gap-2">
          <MapPin className="size-3.5 text-gold" aria-hidden strokeWidth={1.75} />
          <span>{siteConfig.dealership.address}</span>
        </li>
        <li className="flex items-center gap-2">
          <ShieldCheck className="size-3.5 text-gold" aria-hidden strokeWidth={1.75} />
          <span>{siteConfig.dealership.hours}</span>
        </li>
      </ul>
    </aside>
  );
}
