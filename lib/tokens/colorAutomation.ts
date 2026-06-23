/**
 * Color Automation Utilities
 * WCAG contrast calculation + accessible color combo finder
 * Pure functions — no React imports
 */

import { neutral, hues, PaletteColor } from './palette';
import { TokenMap, lightTokens } from './semanticTokens';

/**
 * Convert hex color to relative luminance (WCAG 2.1)
 */
export function hexToLuminance(hex: string): number {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;

  const linearize = (v: number): number =>
    v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);

  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
}

/**
 * WCAG contrast ratio between two hex colors (always >= 1)
 */
export function contrastRatio(fg: string, bg: string): number {
  const l1 = hexToLuminance(fg);
  const l2 = hexToLuminance(bg);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export type WCAGLevel = 'AAA' | 'AA' | 'AA-large' | 'fail';

/**
 * Check WCAG contrast level for a foreground/background pair
 */
export function checkContrast(fg: string, bg: string): { ratio: number; level: WCAGLevel } {
  const ratio = contrastRatio(fg, bg);
  let level: WCAGLevel;
  if (ratio >= 7) level = 'AAA';
  else if (ratio >= 4.5) level = 'AA';
  else if (ratio >= 3) level = 'AA-large';
  else level = 'fail';
  return { ratio, level };
}

/**
 * All palette colors as keyed entries for iteration
 */
function getAllPaletteColors(): Array<{ color: PaletteColor; key: string }> {
  const entries: Array<{ color: PaletteColor; key: string }> = [];

  // Neutral scale
  for (const [step, color] of Object.entries(neutral)) {
    entries.push({ color: color as PaletteColor, key: `neutral-${step}` });
  }

  // Hue families
  for (const [hueName, steps] of Object.entries(hues)) {
    for (const [step, c] of Object.entries(steps)) {
      entries.push({ color: c as PaletteColor, key: `${hueName}-${step}` });
    }
  }

  return entries;
}

/**
 * Given a background hex, find all palette colors meeting minimum contrast
 */
export function findAccessibleColors(
  bg: string,
  minRatio = 4.5
): Array<{ color: PaletteColor; key: string; ratio: number; level: WCAGLevel }> {
  return getAllPaletteColors()
    .map(({ color, key }) => {
      const { ratio, level } = checkContrast(color.hex, bg);
      return { color, key, ratio, level };
    })
    .filter(({ ratio }) => ratio >= minRatio)
    .sort((a, b) => b.ratio - a.ratio);
}

/**
 * Auto-suggest a semantic color scheme override from a brand hex color.
 * Returns a partial TokenMap that can override lightTokens.
 */
export function suggestColorScheme(brandHex: string): Partial<TokenMap> {
  const brandLuminance = hexToLuminance(brandHex);
  const isDark = brandLuminance < 0.18;

  // Find best text color on the brand fill
  const onFill = isDark ? neutral[0].hex : neutral[950].hex;

  // Tint: lighten for dark brand, or use very light version
  const brandTint = isDark ? neutral[100].hex : neutral[800].hex;

  return {
    '--color-fill-brand':      brandHex,
    '--color-fill-brand-weak': brandTint,
    '--color-border-brand':    brandHex,
    '--color-border-focus':    brandHex,
    '--color-text-brand':      isDark ? neutral[950].hex : neutral[0].hex,
    '--color-text-on-fill':    onFill,
    '--color-fill-normal':     lightTokens['--color-fill-normal'],
    '--color-fill-strong':     lightTokens['--color-fill-strong'],
  };
}
