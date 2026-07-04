import type { ReactNode } from "react";

import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { useLanguage } from "@/lib/i18n";

/**
 * RootLayout — page shell for every route.
 *
 * Composition:
 *   - Skip-to-content link (a11y).
 *   - Fixed glass Navbar overlays the page (main gets no top padding so hero
 *     can bleed under it; interior pages should add their own pt-* if they
 *     don't start with a hero).
 *   - <main id="top"> — the target of the "Home" nav anchor.
 *   - Footer.
 */
export function RootLayout({ children }: { children: ReactNode }) {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <a
        href="#top"
        className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-gold focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-gold-foreground"
      >
        {t.a11y.skipToContent}
      </a>
      <Navbar />
      <main id="top" className="relative">
        {children}
      </main>
      <Footer />
    </div>
  );
}
