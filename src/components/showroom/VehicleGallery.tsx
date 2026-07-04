import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * VehicleGallery — hero image + thumbnail strip for the detail page.
 *
 * - Large 16:10 stage with soft crossfade between shots.
 * - Prev / Next arrows overlaid (keyboard-accessible via arrow keys).
 * - Thumbnail row below; active thumb gets a gold ring.
 */
export function VehicleGallery({
  images,
  alt,
  className,
}: {
  images: string[];
  alt: string;
  className?: string;
}) {
  const [index, setIndex] = React.useState(0);
  const total = images.length;

  const go = React.useCallback(
    (dir: 1 | -1) => setIndex((i) => (i + dir + total) % total),
    [total],
  );

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  if (total === 0) return null;

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="surface-card group relative aspect-[16/10] overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.img
            key={images[index]}
            src={images[index]}
            alt={`${alt} — ${index + 1} / ${total}`}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.01 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 h-full w-full object-cover"
            loading="eager"
          />
        </AnimatePresence>

        {total > 1 ? (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Image précédente"
              className="absolute start-4 top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-hairline bg-background/70 text-foreground/90 opacity-0 backdrop-blur-xl transition-all hover:border-gold/50 hover:text-gold group-hover:opacity-100 focus-visible:opacity-100"
            >
              <ChevronLeft className="size-5 rtl:rotate-180" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Image suivante"
              className="absolute end-4 top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-hairline bg-background/70 text-foreground/90 opacity-0 backdrop-blur-xl transition-all hover:border-gold/50 hover:text-gold group-hover:opacity-100 focus-visible:opacity-100"
            >
              <ChevronRight className="size-5 rtl:rotate-180" aria-hidden />
            </button>
            <div
              className="absolute bottom-4 end-4 rounded-full border border-hairline bg-background/70 px-3 py-1 text-[11px] font-semibold text-foreground/90 backdrop-blur"
              dir="ltr"
            >
              <span className="tabular-nums">
                {index + 1} / {total}
              </span>
            </div>
          </>
        ) : null}
      </div>

      {total > 1 ? (
        <div className="grid grid-cols-4 gap-3 sm:gap-4">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Voir l'image ${i + 1}`}
              aria-current={i === index}
              className={cn(
                "relative aspect-[16/10] overflow-hidden rounded-lg border transition-all",
                i === index
                  ? "border-gold shadow-[0_0_0_2px_var(--color-gold)]"
                  : "border-hairline opacity-70 hover:opacity-100",
              )}
            >
              <img
                src={src}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
