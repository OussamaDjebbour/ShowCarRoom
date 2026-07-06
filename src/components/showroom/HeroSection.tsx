import * as React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, MapPin, Sparkles, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Gauge } from "./Gauge";
import { TrustBadge } from "./TrustBadge";
import { WhatsAppButton } from "./WhatsAppButton";
import { useLanguage } from "@/lib/i18n";
import { siteConfig } from "@/lib/siteConfig";
import { featuredVehicles } from "@/lib/mockData";
import { cn } from "@/lib/utils";

/**
 * HeroSection — the "Cluster" thesis. Left: nameplate headline + build-sheet
 * eyebrow + CTAs. Right: the signature tachometer, which runs the ignition
 * needle-sweep on load and settles on the live curated stock count.
 *
 * RTL: order flows via `dir` on <html>; no fixed left/right.
 */
export function HeroSection() {
  const { t, locale } = useLanguage();

  const stock = featuredVehicles.length;
  const stockMax = Math.max(8, Math.ceil(stock / 5) * 5);

  const waMessage =
    locale === "ar"
      ? "السلام عليكم، أرغب في الاطلاع على السيارات المتاحة."
      : "Bonjour, j'aimerais découvrir vos véhicules disponibles.";

  const eyebrow =
    locale === "ar" ? "معرض السيارات الفاخرة · وهران" : "Concessionnaire premium · Oran";
  const headline =
    locale === "ar"
      ? "قيادة استثنائية تنتظرك في وهران."
      : "L'automobile d'exception, choisie à Oran.";
  const sub =
    locale === "ar"
      ? "سيارات مختارة بعناية، فحص فني كامل، وضمان الشفافية في كل معاملة."
      : "Des véhicules sélectionnés à la main, contrôlés en atelier, et une transparence totale sur chaque dossier.";
  const stockLabel = locale === "ar" ? "متوفرة · وهران" : "en stock · Oran";
  const selfTest =
    locale === "ar" ? "فحص ذاتي · مخزون مباشر" : "auto-test · stock en direct";

  return (
    <section className="relative isolate overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-24 lg:pt-44 lg:pb-28">
      {/* Ambient backlight — cool needle glow near the cluster, warm redline low */}
      <div
        aria-hidden="true"
        className="absolute end-[-8%] top-8 -z-10 h-[460px] w-[460px] rounded-full bg-needle/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-32 start-[-10%] -z-10 h-[420px] w-[420px] rounded-full bg-gold/10 blur-3xl"
      />

      <motion.div
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
        }}
        className="relative mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-10 lg:px-8"
      >
        {/* Text column */}
        <div className="flex flex-col gap-6">
          <motion.p variants={fadeUp} className="text-eyebrow">
            {eyebrow}
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className="text-display-lg sm:text-display-xl lg:text-display-2xl text-balance text-foreground"
          >
            {headline}
          </motion.h1>

          <motion.p variants={fadeUp} className="text-body-lg text-muted-foreground max-w-xl">
            {sub}
          </motion.p>

          <motion.div variants={fadeUp} className="mt-4 flex flex-wrap items-center gap-3">
            <Button asChild size="lg" variant="gold">
              <a href="#inventaire">
                {t.cta.viewInventory}
                <ArrowRight aria-hidden="true" className="rtl:rotate-180" />
              </a>
            </Button>
            <WhatsAppButton
              phone={siteConfig.dealership.whatsapp}
              message={waMessage}
              label={t.cta.whatsapp}
              size="lg"
            />
            <a
              href={`tel:${siteConfig.dealership.phone.replace(/\s/g, "")}`}
              className="text-body-sm text-muted-foreground hover:text-foreground ms-2 inline-flex items-center gap-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full"
            >
              <span className="hidden sm:inline">
                {locale === "ar" ? "أو اتصل بنا" : "ou appelez-nous"}
              </span>
              <span dir="ltr" className="text-data font-medium text-foreground/90">
                {siteConfig.dealership.phone}
              </span>
            </a>
          </motion.div>
        </div>

        {/* Cluster column */}
        <motion.div variants={fadeUp} className="relative flex flex-col items-center gap-3">
          <div className="grain rounded-full">
            <Gauge
              variant="hero"
              value={stock}
              max={stockMax}
              readout={String(stock)}
              label={stockLabel}
              className="w-[min(76vw,26rem)]"
            />
          </div>
          <span className="text-caption text-muted-foreground/70">{selfTest}</span>
        </motion.div>
      </motion.div>

      {/* Credibility strip */}
      <div className="relative mx-auto mt-14 max-w-7xl px-4 sm:px-6 lg:mt-16 lg:px-8">
        <CredibilityStrip />
      </div>
    </section>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

function CredibilityStrip() {
  const { locale } = useLanguage();

  const items = React.useMemo(
    () =>
      locale === "ar"
        ? [
            { icon: ShieldCheck, label: "وكيل معتمد" },
            { icon: Sparkles, label: "ضمان سنتان" },
            { icon: MapPin, label: "معرضنا في وهران" },
            { icon: ShieldCheck, label: "تمويل متاح" },
          ]
        : [
            { icon: ShieldCheck, label: "Concessionnaire agréé" },
            { icon: Sparkles, label: "Garantie 2 ans" },
            { icon: MapPin, label: "Showroom à Oran" },
            { icon: ShieldCheck, label: "Financement disponible" },
          ],
    [locale],
  );

  return (
    <ul
      className="flex flex-wrap items-center gap-2 border-t border-hairline pt-8 sm:gap-3"
      aria-label={locale === "ar" ? "ضمانات المعرض" : "Garanties du showroom"}
    >
      {items.map((item) => (
        <li key={item.label}>
          <TrustBadge icon={item.icon} label={item.label} variant="line" size="default" />
        </li>
      ))}
    </ul>
  );
}
