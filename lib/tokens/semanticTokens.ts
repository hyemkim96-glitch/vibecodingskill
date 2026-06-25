/**
 * Semantic Color Tokens
 * Light and dark mode token maps using the primitive palette
 */

import { neutral, green, red, amber, blue, violet } from './palette';

export type TokenMap = Record<string, string>;

export const lightTokens: TokenMap = {
  // Background
  '--color-bg-normal':        neutral[0].hex,
  '--color-bg-alt':           neutral[50].hex,
  '--color-bg-elevated':      neutral[0].hex,
  '--color-bg-overlay':       'rgba(0,0,0,0.5)',

  // Fill
  '--color-fill-normal':      neutral[900].hex,
  '--color-fill-strong':      neutral[950].hex,
  '--color-fill-alternative': neutral[700].hex,
  '--color-fill-neutral':     neutral[100].hex,
  '--color-fill-neutral-alt': neutral[200].hex,
  '--color-fill-brand':       neutral[900].hex,
  '--color-fill-brand-weak':  neutral[100].hex,
  '--color-fill-success':      green[500].hex,
  '--color-fill-success-weak': green[50].hex,
  '--color-fill-danger':       red[500].hex,
  '--color-fill-danger-weak':  red[50].hex,
  '--color-fill-warning':      amber[500].hex,
  '--color-fill-warning-weak': amber[50].hex,
  '--color-fill-info':         blue[500].hex,
  '--color-fill-info-weak':    blue[50].hex,
  '--color-fill-accent':       violet[500].hex,
  '--color-fill-accent-weak':  violet[50].hex,

  // Text
  '--color-text-normal':      neutral[950].hex,
  '--color-text-alternative': neutral[600].hex,
  '--color-text-assistive':   neutral[400].hex,
  '--color-text-disabled':    neutral[300].hex,
  '--color-text-on-fill':     neutral[0].hex,
  '--color-text-brand':       neutral[900].hex,
  '--color-text-success':      green[700].hex,
  '--color-text-danger':       red[700].hex,
  '--color-text-warning':      amber[700].hex,
  '--color-text-info':         blue[700].hex,
  '--color-text-accent':       violet[700].hex,

  // Border
  '--color-border-normal':    neutral[200].hex,
  '--color-border-strong':    neutral[400].hex,
  '--color-border-weak':      neutral[100].hex,
  '--color-border-brand':     neutral[900].hex,
  '--color-border-focus':     neutral[900].hex,
  '--color-border-success':    green[500].hex,
  '--color-border-danger':     red[500].hex,
  '--color-border-warning':    amber[500].hex,
  '--color-border-info':       blue[500].hex,

  // Highlight — warm amber for positive emphasis (ratings, featured, callouts)
  '--color-fill-highlight':    amber[400].hex,   // L≈0.752 — bright amber, no warning connotation
};

export const darkTokens: TokenMap = {
  // Background
  '--color-bg-normal':        neutral[950].hex,
  '--color-bg-alt':           neutral[900].hex,
  '--color-bg-elevated':      neutral[800].hex,
  '--color-bg-overlay':       'rgba(0,0,0,0.7)',

  // Fill
  '--color-fill-normal':      neutral[50].hex,
  '--color-fill-strong':      neutral[0].hex,
  '--color-fill-alternative': neutral[200].hex,
  '--color-fill-neutral':     neutral[800].hex,
  '--color-fill-neutral-alt': neutral[700].hex,
  '--color-fill-brand':       neutral[50].hex,
  '--color-fill-brand-weak':  neutral[800].hex,
  '--color-fill-success':      green[400].hex,
  '--color-fill-success-weak': green[50].hex,
  '--color-fill-danger':       red[400].hex,
  '--color-fill-danger-weak':  red[50].hex,
  '--color-fill-warning':      amber[400].hex,
  '--color-fill-warning-weak': amber[50].hex,
  '--color-fill-info':         blue[400].hex,
  '--color-fill-info-weak':    blue[50].hex,
  '--color-fill-accent':       violet[400].hex,
  '--color-fill-accent-weak':  violet[50].hex,

  // Text
  '--color-text-normal':      neutral[50].hex,
  '--color-text-alternative': neutral[300].hex,
  '--color-text-assistive':   neutral[400].hex,
  '--color-text-disabled':    neutral[500].hex,
  '--color-text-on-fill':     neutral[950].hex,
  '--color-text-brand':       neutral[50].hex,
  '--color-text-success':      green[400].hex,
  '--color-text-danger':       red[400].hex,
  '--color-text-warning':      amber[400].hex,
  '--color-text-info':         blue[400].hex,
  '--color-text-accent':       violet[400].hex,

  // Border
  '--color-border-normal':    neutral[700].hex,
  '--color-border-strong':    neutral[500].hex,
  '--color-border-weak':      neutral[800].hex,
  '--color-border-brand':     neutral[50].hex,
  '--color-border-focus':     neutral[50].hex,
  '--color-border-success':    green[400].hex,
  '--color-border-danger':     red[400].hex,
  '--color-border-warning':    amber[400].hex,
  '--color-border-info':       blue[400].hex,

  // Highlight — warm amber for positive emphasis (ratings, featured, callouts)
  '--color-fill-highlight':    amber[300].hex,   // L≈0.832 — brighter on dark bg
};

/**
 * Generate CSS custom properties block for a token map
 */
export function generateCSSVariables(tokens: TokenMap, selector = ':root'): string {
  const props = Object.entries(tokens)
    .map(([key, value]) => `  ${key}: ${value};`)
    .join('\n');
  return `${selector} {\n${props}\n}`;
}

/**
 * Generate both light and dark mode CSS variable blocks
 */
export function generateDarkModeCSS(): string {
  const light = generateCSSVariables(lightTokens, ':root');
  const darkProps = Object.entries(darkTokens)
    .map(([key, value]) => `    ${key}: ${value};`)
    .join('\n');
  const dark = `@media (prefers-color-scheme: dark) {\n  :root {\n${darkProps}\n  }\n}`;
  return `${light}\n\n${dark}`;
}
