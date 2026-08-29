import * as React from "react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

/**
 * Gauge — the "Cluster" signature: a tachometer-style arc that performs the
 * ignition needle-sweep every car does at start-up (0 → redline → settle onto
 * the reading). The cyan needle is the live illumination; the redline zone near
 * full-scale is the one warm amber accent.
 *
 * Motion is via Framer Motion, so <MotionConfig reducedMotion="user"> (root)
 * makes it settle instantly with no sweep when the user prefers reduced motion.
 */

const START = -135; // degrees, clockwise from 12 o'clock
const END = 135;
const SWEEP = END - START; // 270°

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.sin(rad), y: cy - r * Math.cos(rad) };
}

function arcPath(cx: number, cy: number, r: number, a1: number, a2: number) {
  const start = polar(cx, cy, r, a1);
  const end = polar(cx, cy, r, a2);
  const largeArc = Math.abs(a2 - a1) > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`;
}

export interface GaugeProps {
  /** Current reading. */
  value: number;
  /** Scale maximum. */
  max: number;
  /** Scale minimum (default 0). */
  min?: number;
  /** Fraction (0–1) of the scale where the redline zone begins. */
  redlineFrom?: number;
  /** Big centre readout (defaults to the value). */
  readout?: string;
  /** Small label under the readout. */
  label?: string;
  variant?: "hero" | "spec";
  className?: string;
}

export function Gauge({
  value,
  max,
  min = 0,
  redlineFrom = 0.82,
  readout,
  label,
  variant = "spec",
  className,
}: GaugeProps) {
  const cx = 100;
  const cy = 100;
  const r = 78;
  const isHero = variant === "hero";

  const clamped = Math.max(min, Math.min(max, value));
  const f = max === min ? 0 : (clamped - min) / (max - min);
  const valueAngle = START + f * SWEEP;
  const redlineAngle = START + redlineFrom * SWEEP;

  const ticks = Array.from({ length: 9 }, (_, i) => START + (i / 8) * SWEEP);
  const centre = readout ?? String(clamped);

  return (
    <svg
      viewBox="0 0 200 200"
      className={cn("overflow-visible", className)}
      role="img"
      aria-label={label ? `${label} : ${centre}` : centre}
    >
      {/* Track */}
      <path
        d={arcPath(cx, cy, r, START, END)}
        fill="none"
        stroke="var(--color-muted-foreground)"
        strokeOpacity={0.22}
        strokeWidth={isHero ? 5 : 6}
        strokeLinecap="round"
      />
      {/* Redline zone */}
      <path
        d={arcPath(cx, cy, r, redlineAngle, END)}
        fill="none"
        stroke="var(--color-gold)"
        strokeWidth={isHero ? 5 : 6}
        strokeLinecap="round"
      />
      {/* Ticks */}
      {ticks.map((a, i) => {
        const inner = polar(cx, cy, r - (i % 2 === 0 ? 13 : 8), a);
        const outer = polar(cx, cy, r - 1, a);
        const major = i % 2 === 0;
        return (
          <line
            key={a}
            x1={inner.x}
            y1={inner.y}
            x2={outer.x}
            y2={outer.y}
            stroke="var(--color-muted-foreground)"
            strokeOpacity={major ? 0.6 : 0.3}
            strokeWidth={major ? 2 : 1.25}
            strokeLinecap="round"
          />
        );
      })}
      {/* Needle — sweeps 0 → redline → value on load (cool illumination) */}
      <motion.g
        style={{ transformBox: "view-box", transformOrigin: `${cx}px ${cy}px` }}
        initial={{ rotate: START }}
        animate={{ rotate: [START, END, valueAngle] }}
        transition={{ duration: 1.6, times: [0, 0.55, 1], ease: [0.22, 1, 0.36, 1] }}
        className="[filter:drop-shadow(0_0_5px_var(--color-needle))]"
      >
        <path
          d={`M ${cx - 3.2} ${cy} L ${cx} ${cy - (r - 10)} L ${cx + 3.2} ${cy} Z`}
          fill="var(--color-needle)"
        />
        <circle cx={cx} cy={cy - (r - 10)} r={2} fill="var(--color-foreground)" />
      </motion.g>
      {/* Hub */}
      <circle cx={cx} cy={cy} r={7} fill="var(--color-surface-elevated)" />
      <circle cx={cx} cy={cy} r={7} fill="none" stroke="var(--color-needle)" strokeWidth={1.5} />

      {/* Centre readout */}
      <text
        x={cx}
        y={isHero ? cy + 42 : cy + 40}
        textAnchor="middle"
        style={{ fontFamily: "var(--font-mono)", fontFeatureSettings: '"zero" 1' }}
        fontWeight={600}
        fontSize={isHero ? 30 : 26}
        letterSpacing={1}
        fill="var(--color-foreground)"
      >
        {centre}
      </text>
      {label ? (
        <text
          x={cx}
          y={isHero ? cy + 60 : cy + 58}
          textAnchor="middle"
          style={{
            fontFamily: "var(--font-mono)",
            textTransform: "uppercase",
          }}
          fontWeight={500}
          fontSize={isHero ? 9 : 10}
          letterSpacing={2.4}
          fill="var(--color-needle)"
        >
          {label}
        </text>
      ) : null}
    </svg>
  );
}
