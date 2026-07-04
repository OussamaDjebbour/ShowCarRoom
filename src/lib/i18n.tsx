import * as React from "react";

import {
  translations,
  type Locale,
  type Translations,
} from "@/lib/siteConfig";

/**
 * LanguageProvider — single source of truth for the active locale.
 *
 * - Persists to localStorage under "showroom.locale".
 * - Applies `dir` and `lang` to <html> so Tailwind logical utilities
 *   (ms-*, me-*, ps-*, pe-*) and the Arabic font swap in styles.css
 *   activate automatically.
 * - Server-safe: reads `document` behind a guard so SSR doesn't crash.
 */

interface LanguageContextValue {
  locale: Locale;
  t: Translations;
  dir: "ltr" | "rtl";
  setLocale: (next: Locale) => void;
  toggle: () => void;
}

const LanguageContext = React.createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "showroom.locale";
const DEFAULT_LOCALE: Locale = "fr";

function readInitialLocale(): Locale {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "fr" || stored === "ar") return stored;
  } catch {
    /* localStorage blocked — fall through */
  }
  return DEFAULT_LOCALE;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = React.useState<Locale>(DEFAULT_LOCALE);

  // Hydrate from storage after mount to keep SSR output deterministic.
  React.useEffect(() => {
    const initial = readInitialLocale();
    if (initial !== DEFAULT_LOCALE) setLocaleState(initial);
  }, []);

  const dir: "ltr" | "rtl" = locale === "ar" ? "rtl" : "ltr";

  React.useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    root.setAttribute("lang", locale);
    root.setAttribute("dir", dir);
  }, [locale, dir]);

  const setLocale = React.useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const toggle = React.useCallback(() => {
    setLocale(locale === "fr" ? "ar" : "fr");
  }, [locale, setLocale]);

  const value = React.useMemo<LanguageContextValue>(
    () => ({ locale, t: translations[locale] as Translations, dir, setLocale, toggle }),
    [locale, dir, setLocale, toggle],
  );


  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = React.useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used inside <LanguageProvider>");
  }
  return ctx;
}
