/**
 * siteConfig — the "swap in under 5 minutes" surface for a new dealership.
 *
 * All dealership-specific strings, routes, contact info, and bilingual
 * translations live here. Components import from this file only.
 */

export type Locale = "fr" | "ar";

export interface NavItem {
  /** Stable key used for translation lookup and RTL-aware ordering. */
  key: "home" | "inventory" | "services" | "about" | "contact";
  /** Hash anchor into the home page (Stage 6 will attach the sections). */
  href: string;
}

export const siteConfig = {
  dealership: {
    /** Legal / display name — used in navbar wordmark and footer. */
    name: "Prestige Motors Oran",
    shortName: "Prestige Motors",
    /** Editorial tagline shown in hero / footer, per locale. */
    city: "Oran, Algérie",
    /** International format — WhatsAppButton normalizes automatically. */
    phone: "+213 555 12 34 56",
    /** Digits-only for WhatsApp deep link. */
    whatsapp: "213555123456",
    address: "Boulevard Millénium, Bir El Djir, Oran",
    hours: "Sam–Jeu · 09:00 – 19:00",
    email: "contact@prestigemotors-oran.dz",
  },
  nav: [
    { key: "home", href: "#top" },
    { key: "inventory", href: "#inventaire" },
    { key: "services", href: "#services" },
    { key: "about", href: "#about" },
    { key: "contact", href: "#contact" },
  ] as NavItem[],
} as const;

/**
 * Bilingual copy. Keep keys flat and predictable — designers and non-devs
 * will edit this file directly before a pitch.
 */
export const translations = {
  fr: {
    locale: "Français",
    localeShort: "FR",
    nav: {
      home: "Accueil",
      inventory: "Inventaire",
      services: "Services",
      about: "À propos",
      contact: "Contact",
    },
    cta: {
      whatsapp: "WhatsApp",
      call: "Appeler",
      viewInventory: "Voir l'inventaire",
      bookVisit: "Prendre rendez-vous",
    },
    a11y: {
      openMenu: "Ouvrir le menu",
      closeMenu: "Fermer le menu",
      switchLanguage: "Changer de langue",
      skipToContent: "Aller au contenu",
    },
    meta: {
      showroomBadge: "Showroom à Oran",
    },
  },
  ar: {
    locale: "العربية",
    localeShort: "ع",
    nav: {
      home: "الرئيسية",
      inventory: "المعرض",
      services: "الخدمات",
      about: "من نحن",
      contact: "اتصل بنا",
    },
    cta: {
      whatsapp: "واتساب",
      call: "اتصال",
      viewInventory: "تصفح المعرض",
      bookVisit: "حجز موعد",
    },
    a11y: {
      openMenu: "فتح القائمة",
      closeMenu: "إغلاق القائمة",
      switchLanguage: "تغيير اللغة",
      skipToContent: "الانتقال إلى المحتوى",
    },
    meta: {
      showroomBadge: "معرضنا في وهران",
    },
  },
} as const satisfies Record<Locale, unknown>;

export type Translations = {
  locale: string;
  localeShort: string;
  nav: Record<NavItem["key"], string>;
  cta: {
    whatsapp: string;
    call: string;
    viewInventory: string;
    bookVisit: string;
  };
  a11y: {
    openMenu: string;
    closeMenu: string;
    switchLanguage: string;
    skipToContent: string;
  };
  meta: {
    showroomBadge: string;
  };
};
