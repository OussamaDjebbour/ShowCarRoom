import * as React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, MapPin, Sparkles, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TrustBadge } from "./TrustBadge";
import { WhatsAppButton } from "./WhatsAppButton";
import { useLanguage } from "@/lib/i18n";
import { siteConfig } from "@/lib/siteConfig";
import { cn } from "@/lib/utils";

/**
 * HeroSection — the editorial opening of the Oran showroom home page.
 *
 * Composition:
 *   - Ambient radial + soft gold wash (no image dependency; swap for a real
 *     photo of the showroom floor before the client meeting).
 *   - Eyebrow · display headline · supporting body.
 *   - Primary CTA row: "Voir l'inventaire" (gold) + WhatsApp.
 *   - Credibility strip of 4 TrustBadges (agréé · garantie · financement · Oran).
 *
 * RTL: no fixed ordering — flex flows via `dir`. WhatsApp stays the trailing
 * action in FR and the leading action in AR because it's the second child of
 * a flex row that reverses under RTL. Both directions read naturally.
 */
export function HeroSection() {
  const { t, locale } = useLanguage();

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

  return (
    <section
      className="relative isolate overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28 lg:pt-48 lg:pb-32"
    >
      {/* Ambient background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_30%_20%,_oklch(0.28_0.02_265)_0%,_var(--color-background)_55%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-96 bg-[radial-gradient(ellipse_at_top,_oklch(0.78_0.11_82_/_0.18),_transparent_70%)]"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-32 end-[-10%] -z-10 h-[420px] w-[420px] rounded-full bg-gold/10 blur-3xl"
      />

      <motion.div
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
        }}
        className="relative mx-auto flex max-w-7xl flex-col gap-12 px-4 sm:px-6 lg:gap-16 lg:px-8"
      >
        <div className="flex flex-col gap-6 lg:max-w-3xl">
          <motion.div variants={fadeUp}>
            <TrustBadge
              icon={Sparkles}
              label={eyebrow}
              variant="line"
              size="sm"
              className="self-start"
            />
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-display-lg sm:text-display-xl lg:text-display-2xl text-balance text-foreground"
          >
            {headline}
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-body-lg text-muted-foreground max-w-2xl"
          >
            {sub}
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-4 flex flex-wrap items-center gap-3"
          >
            <Button asChild size="lg" variant="default">
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
              className="text-body-sm text-muted-foreground hover:text-foreground ms-2 inline-flex items-center gap-2 transition-colors"
            >
              <span className="hidden sm:inline">
                {locale === "ar" ? "أو اتصل بنا" : "ou appelez-nous"}
              </span>
              <span dir="ltr" className="tabular-nums font-medium text-foreground/90">
                {siteConfig.dealership.phone}
              </span>
            </a>
          </motion.div>
        </div>

        {/* Credibility strip */}
        <motion.div variants={fadeUp}>
          <CredibilityStrip />
        </motion.div>
      </motion.div>
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
      className={cn(
        "flex flex-wrap items-center gap-2 border-t border-hairline pt-8 sm:gap-3",
      )}
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
