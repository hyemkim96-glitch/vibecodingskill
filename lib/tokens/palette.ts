/**
 * Primitive Color Palette — Tier 1
 *
 * OKLCH-based, perceptually uniform, sRGB-safe.
 * No semantic meaning at this layer — only hue-named color families.
 * Semantic role assignment starts at semanticTokens.ts (Tier 2).
 *
 * color(l, c, h) factory:
 *   - Generates hex via oklchToHex (no manual hex)
 *   - Dev-only validation: sRGB gamut clip + WCAG AA check for text steps
 *
 * OKLCH constraints (design spec):
 *   Neutral:     C 0.000–0.009,  any L         — near-achromatic
 *   Hue 600:     C 0.140–0.198,  L 0.488–0.602 — fill (WCAG AA bg contrast)
 *   Hue 700:     L 0.390–0.498                  — text (≥ 4.5:1 on white)
 *   Hue 50–200:  C 0.010–0.080,  L > 0.89       — light tints
 */

import { oklchToHex, hexToOklch, contrastRatio } from './oklch';

export interface PaletteColor {
  oklch: string;
  hex: string;
}

export type HueStep = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950;
export type HuePalette = Record<HueStep, PaletteColor>;

// ── Color factory with dev-time validation ────────────────────────────────────

function color(l: number, c: number, h: number): PaletteColor {
  const hex = oklchToHex(l, c, h);

  if (typeof window === 'undefined') {
    // Server-side / build-time validation only (avoids client re-runs)
    const back = hexToOklch(hex);
    // sRGB gamut: significant L shift → clipping occurred
    if (Math.abs(back.l - l) > 0.025) {
      console.warn(`[palette] oklch(${l} ${c} ${h}) gamut-clipped → L=${back.l.toFixed(3)}`);
    }
    // Chroma clipping
    if (c > 0.05 && back.c < c * 0.70) {
      console.warn(`[palette] oklch(${l} ${c} ${h}) chroma clipped: ${c.toFixed(3)} → ${back.c.toFixed(3)}`);
    }
    // WCAG AA: steps used as text (L 0.10–0.50) must contrast ≥ 4.5:1 on white
    if (l < 0.50 && l > 0.10) {
      const ratio = contrastRatio(hex, '#ffffff');
      if (ratio < 4.5) {
        console.warn(`[palette] oklch(${l} ${c} ${h}) contrast on white = ${ratio.toFixed(2)} (< 4.5 WCAG AA)`);
      }
    }
  }

  return {
    oklch: `oklch(${l.toFixed(3)} ${c.toFixed(3)} ${h})`,
    hex,
  };
}

// ── Hue palette generator ─────────────────────────────────────────────────────
//
// Base [L, C] per step. Chroma peaks at 500–600 (fill range), tapers at extremes.
// Per-hue chromaScale corrects for sRGB gamut limits:
//   yellow/amber are tightest (can't reach C ≈ 0.19 at mid-L).
//   red, blue, violet have the widest gamut.

const STEPS: Array<[HueStep, number, number]> = [
  [ 50, 0.971, 0.018],
  [100, 0.943, 0.038],
  [200, 0.895, 0.072],
  [300, 0.832, 0.115],
  [400, 0.752, 0.155],
  [500, 0.651, 0.188],
  [600, 0.545, 0.193],
  [700, 0.449, 0.175],
  [800, 0.362, 0.145],
  [900, 0.282, 0.108],
  [950, 0.213, 0.072],
];

function makeHue(h: number, chromaScale: number): HuePalette {
  return Object.fromEntries(
    STEPS.map(([step, l, c]) => [step, color(l, c * chromaScale, h)])
  ) as HuePalette;
}

// ── Brand hue scale (Foundation rules at an arbitrary hue) ────────────────────
//
// Generates a full tonal scale for any hue using the SAME STEPS [L,C] table the
// Foundation hue families use, so brand palettes follow Foundation rules and the
// scale stays monotonic (no raw-primary injection that breaks ordering — the
// classic "100 looks darker than 200" bug on bright yellows).
//
// chromaScale is derived from the hue's own sRGB gamut so tight hues (yellow)
// are muted exactly like the hand-tuned Foundation families, without a lookup.

/** Largest in-gamut chroma at (l, h), via binary search on round-trip fidelity. */
export function maxChromaAt(l: number, h: number): number {
  let lo = 0;
  let hi = 0.4;
  let best = 0;
  for (let i = 0; i < 22; i++) {
    const mid = (lo + hi) / 2;
    const back = hexToOklch(oklchToHex(l, mid, h));
    if (Math.abs(back.c - mid) < 0.004 && Math.abs(back.l - l) < 0.012) {
      best = mid;
      lo = mid;
    } else {
      hi = mid;
    }
  }
  return best;
}

export interface BrandHueStep {
  step: HueStep;
  l: number;
  hex: string;
}

/**
 * Brand hue scale at hue `h`, following Foundation STEPS. Chroma is gamut-scaled
 * so the fill step (≈L 0.545) sits at the hue's achievable max relative to the
 * nominal 0.193, matching how Foundation tunes yellow ↓ and blue ↑.
 */
export function makeBrandHueScale(h: number): BrandHueStep[] {
  const fillMax = maxChromaAt(0.545, h);
  const chromaScale = Math.max(0.32, Math.min(1, fillMax / 0.193));
  return STEPS.map(([step, l, c]) => ({ step, l, hex: oklchToHex(l, c * chromaScale, h) }));
}

// ── Hue families ──────────────────────────────────────────────────────────────

export const red    = makeHue( 22, 1.00); // hue 22 — classic red
export const orange = makeHue( 46, 0.88); // hue 46
export const amber  = makeHue( 62, 0.70); // hue 62 — gamut-limited
export const yellow = makeHue( 92, 0.45); // hue 92 — tightest sRGB gamut
export const green  = makeHue(145, 0.88); // hue 145
export const teal   = makeHue(182, 0.82); // hue 182
export const blue   = makeHue(254, 1.00); // hue 254
export const indigo = makeHue(270, 0.92); // hue 270
export const violet = makeHue(293, 1.00); // hue 293
export const pink   = makeHue(348, 0.88); // hue 348

// ── Neutral scale ─────────────────────────────────────────────────────────────
//   13 steps, hue 286, C ≤ 0.009 (perceptually near-achromatic).

export const neutral: Record<0 | 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950 | 1000, PaletteColor> = {
      0: color(1.000, 0.000,   0),
     50: color(0.985, 0.002, 286),
    100: color(0.961, 0.003, 286),
    200: color(0.921, 0.004, 286),
    300: color(0.870, 0.005, 286),
    400: color(0.718, 0.008, 286),
    500: color(0.556, 0.009, 286),
    600: color(0.442, 0.008, 286),
    700: color(0.350, 0.007, 286),
    800: color(0.269, 0.005, 286),
    900: color(0.205, 0.004, 286),
    950: color(0.130, 0.003, 286),
   1000: color(0.000, 0.000,   0),
};

// ── Convenience map for iteration ─────────────────────────────────────────────

export const hues = {
  red, orange, amber, yellow, green, teal, blue, indigo, violet, pink,
} as const;

export type HueName = keyof typeof hues;
