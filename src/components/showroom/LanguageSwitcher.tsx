import * as React from "react";
import { Languages } from "lucide-react";

import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n";

/**
 * LanguageSwitcher — segmented FR / ع toggle.
 *
 * Kept small and self-contained so it can drop into the navbar (desktop)
 * and mobile drawer alike. Uses the design-system tokens only.
 */
export interface LanguageSwitcherProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Compact variant hides the leading icon (mobile drawer / footer strip). */
  compact?: boolean;
}

export function LanguageSwitcher({ className, compact = false, ...props }: LanguageSwitcherProps) {
  const { locale, setLocale, t } = useLanguage();

  return (
    <div
      role="group"
      aria-label={t.a11y.switchLanguage}
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-hairline bg-surface/70 p-1 backdrop-blur",
        className,
      )}
      {...props}
    >
      {!compact ? (
        <Languages
          className="ms-2 size-3.5 text-muted-foreground"
          strokeWidth={1.75}
          aria-hidden="true"
        />
      ) : null}
      <button
        type="button"
        onClick={() => setLocale("fr")}
        aria-pressed={locale === "fr"}
        className={cn(
          "cursor-pointer rounded-full px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          locale === "fr"
            ? "bg-gold text-gold-foreground"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        FR
      </button>
      <button
        type="button"
        onClick={() => setLocale("ar")}
        aria-pressed={locale === "ar"}
        lang="ar"
        className={cn(
          "cursor-pointer rounded-full px-3 py-2 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          locale === "ar"
            ? "bg-gold text-gold-foreground"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        ع
      </button>
    </div>
  );
}
