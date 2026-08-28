import * as React from "react";
import { Menu, Phone, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n";
import { siteConfig } from "@/lib/siteConfig";
import { LanguageSwitcher } from "@/components/showroom/LanguageSwitcher";
import { WhatsAppButton } from "@/components/showroom/WhatsAppButton";
import { Button } from "@/components/ui/button";

/**
 * Navbar — sticky glassmorphism header.
 *
 * Behavior:
 *   - Transparent over the hero; on scroll (>16px) morphs into a frosted
 *     glass bar with a hairline divider and subtle elevation.
 *   - RTL-aware: the whole row flips via `dir` on <html>. The WhatsApp CTA
 *     stays as the trailing action in both directions because we rely on
 *     `justify-between` (flex flips with dir), not fixed ordering.
 *   - Mobile: hamburger toggles a full-height overlay drawer with the same
 *     nav links + language switcher + primary CTA.
 */
export function Navbar() {
  const { t, locale } = useLanguage();
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const panelRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while drawer is open
  React.useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Drawer a11y: Escape closes it, focus moves into the panel on open and
  // returns to the trigger (the hamburger) on close.
  React.useEffect(() => {
    if (!mobileOpen) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    panelRef.current?.querySelector<HTMLElement>("a, button")?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      previouslyFocused?.focus?.();
    };
  }, [mobileOpen]);

  const waMessage =
    locale === "ar"
      ? "السلام عليكم، أود الاستفسار عن السيارات المتوفرة."
      : "Bonjour, je souhaite des informations sur vos véhicules.";

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color,box-shadow] duration-300",
          scrolled
            ? "border-b border-hairline bg-background/70 shadow-[0_10px_30px_-20px_oklch(0_0_0/0.6)] backdrop-blur-xl"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:h-20 sm:px-6 lg:px-8">
          {/* Wordmark */}
          <a
            href="#top"
            className="group flex items-center gap-3"
            aria-label={siteConfig.dealership.name}
          >
            <span
              aria-hidden="true"
              className="grid size-9 place-items-center rounded-full border border-gold/40 bg-gold/10 font-display text-sm font-semibold text-gold transition-colors group-hover:bg-gold/20"
            >
              PM
            </span>
            <span className="flex flex-col leading-tight">
              <span className="font-display text-base font-semibold tracking-tight text-foreground sm:text-lg">
                {siteConfig.dealership.shortName}
              </span>
              <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                {siteConfig.dealership.city}
              </span>
            </span>
          </a>

          {/* Desktop nav */}
          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {siteConfig.nav.map((item) => (
                <li key={item.key}>
                  <a
                    href={item.href}
                    className="relative rounded-full px-4 py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {t.nav[item.key]}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Trailing actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSwitcher className="hidden sm:inline-flex" />
            <a
              href={`tel:${siteConfig.dealership.phone.replace(/\s/g, "")}`}
              className="hidden items-center gap-2 rounded-full border border-hairline bg-surface/60 px-3 py-2 text-xs font-medium text-foreground/85 backdrop-blur transition-colors hover:border-gold/40 hover:text-foreground md:inline-flex"
              aria-label={`${t.cta.call} — ${siteConfig.dealership.phone}`}
            >
              <Phone className="size-3.5 text-gold" strokeWidth={1.75} aria-hidden="true" />
              <span dir="ltr" className="tabular-nums">
                {siteConfig.dealership.phone}
              </span>
            </a>
            <WhatsAppButton
              phone={siteConfig.dealership.whatsapp}
              message={waMessage}
              label={t.cta.whatsapp}
              size="sm"
              className="hidden sm:inline-flex"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="lg:hidden"
              aria-label={mobileOpen ? t.a11y.closeMenu : t.a11y.openMenu}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label={siteConfig.dealership.name}
        inert={!mobileOpen}
        className={cn(
          "fixed inset-0 z-40 lg:hidden",
          mobileOpen ? "pointer-events-auto" : "pointer-events-none",
        )}
      >
        {/* Scrim */}
        <div
          onClick={() => setMobileOpen(false)}
          className={cn(
            "absolute inset-0 bg-background/70 backdrop-blur-md transition-opacity duration-300",
            mobileOpen ? "opacity-100" : "opacity-0",
          )}
        />
        {/* Panel */}
        <div
          ref={panelRef}
          className={cn(
            "absolute inset-x-0 top-0 flex flex-col gap-8 border-b border-hairline bg-surface px-6 pb-8 pt-24 shadow-elevated transition-transform duration-300 ease-out",
            mobileOpen ? "translate-y-0" : "-translate-y-full",
          )}
        >
          <nav aria-label="Mobile primary">
            <ul className="flex flex-col gap-1">
              {siteConfig.nav.map((item) => (
                <li key={item.key}>
                  <a
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between rounded-2xl border border-transparent px-4 py-3 font-display text-2xl font-semibold text-foreground transition-colors hover:border-hairline hover:bg-surface-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <span>{t.nav[item.key]}</span>
                    <span
                      aria-hidden="true"
                      className="text-xs font-sans font-medium text-muted-foreground"
                    >
                      0{siteConfig.nav.indexOf(item) + 1}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex flex-col gap-3">
            <WhatsAppButton
              phone={siteConfig.dealership.whatsapp}
              message={waMessage}
              label={t.cta.whatsapp}
              size="lg"
              className="w-full"
            />
            <a
              href={`tel:${siteConfig.dealership.phone.replace(/\s/g, "")}`}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-hairline bg-surface-elevated px-5 py-3 text-sm font-medium text-foreground"
            >
              <Phone className="size-4 text-gold" strokeWidth={1.75} aria-hidden="true" />
              <span dir="ltr" className="tabular-nums">
                {siteConfig.dealership.phone}
              </span>
            </a>
            <div className="flex items-center justify-between pt-2">
              <span className="text-caption text-muted-foreground">{t.a11y.switchLanguage}</span>
              <LanguageSwitcher compact />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
