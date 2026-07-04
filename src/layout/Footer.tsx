import { Clock, MapPin, Phone } from "lucide-react";

import { siteConfig } from "@/lib/siteConfig";
import { useLanguage } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/showroom/LanguageSwitcher";

/**
 * Footer — minimal wordmark, contact strip, legal line.
 *
 * Page-level detail (hours, address, social) is repeated in ContactCTA above
 * this section on the home page. Footer stays quiet to close the composition.
 */
export function Footer() {
  const { t, locale } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-hairline bg-surface/60">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        {/* Brand block */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="grid size-10 place-items-center rounded-full border border-gold/40 bg-gold/10 font-display text-sm font-semibold text-gold"
            >
              PM
            </span>
            <div className="leading-tight">
              <div className="font-display text-lg font-semibold text-foreground">
                {siteConfig.dealership.name}
              </div>
              <div className="text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                {siteConfig.dealership.city}
              </div>
            </div>
          </div>
          <p className="max-w-sm text-body-sm text-muted-foreground">
            {locale === "ar"
              ? "معرض متخصص في السيارات الفاخرة بوهران — خبرة، ثقة، وخدمة استثنائية."
              : "Showroom automobile premium à Oran — expertise, confiance et service d'exception."}
          </p>
        </div>

        {/* Contact block */}
        <div className="flex flex-col gap-3 text-body-sm">
          <div className="text-eyebrow">{t.nav.contact}</div>
          <a
            href={`tel:${siteConfig.dealership.phone.replace(/\s/g, "")}`}
            className="inline-flex items-center gap-2 text-foreground/85 transition-colors hover:text-gold"
          >
            <Phone className="size-4 text-gold" strokeWidth={1.75} aria-hidden="true" />
            <span dir="ltr" className="tabular-nums">
              {siteConfig.dealership.phone}
            </span>
          </a>
          <div className="inline-flex items-start gap-2 text-muted-foreground">
            <MapPin
              className="mt-0.5 size-4 flex-none text-gold"
              strokeWidth={1.75}
              aria-hidden="true"
            />
            <span>{siteConfig.dealership.address}</span>
          </div>
          <div className="inline-flex items-center gap-2 text-muted-foreground">
            <Clock className="size-4 flex-none text-gold" strokeWidth={1.75} aria-hidden="true" />
            <span>{siteConfig.dealership.hours}</span>
          </div>
        </div>

        {/* Language + meta */}
        <div className="flex flex-col items-start gap-4 lg:items-end">
          <LanguageSwitcher />
          <a
            href={`mailto:${siteConfig.dealership.email}`}
            className="text-body-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {siteConfig.dealership.email}
          </a>
        </div>
      </div>

      <div className="border-t border-hairline">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-[11px] uppercase tracking-[0.16em] text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
          <span>
            © {year} {siteConfig.dealership.name}
          </span>
          <span>
            {locale === "ar"
              ? "جميع الحقوق محفوظة"
              : "Tous droits réservés"}
          </span>
        </div>
      </div>
    </footer>
  );
}
