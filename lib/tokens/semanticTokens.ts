/**
 * Semantic Color Tokens
 * Light and dark mode token maps using the primitive palette
 */

import { neutral, status } from './palette';

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
  '--color-fill-success':     status.success.fill.hex,
  '--color-fill-success-weak': status.success.bg.hex,
  '--color-fill-danger':      status.danger.fill.hex,
  '--color-fill-danger-weak': status.danger.bg.hex,
  '--color-fill-warning':     status.warning.fill.hex,
  '--color-fill-warning-weak': status.warning.bg.hex,
  '--color-fill-info':        status.info.fill.hex,
  '--color-fill-info-weak':   status.info.bg.hex,
  '--color-fill-accent':      status.accent.fill.hex,
  '--color-fill-accent-weak': status.accent.bg.hex,

  // Text
  '--color-text-normal':      neutral[950].hex,
  '--color-text-alternative': neutral[600].hex,
  '--color-text-assistive':   neutral[400].hex,
  '--color-text-disabled':    neutral[300].hex,
  '--color-text-on-fill':     neutral[0].hex,
  '--color-text-brand':       neutral[900].hex,
  '--color-text-success':     status.success.text.hex,
  '--color-text-danger':      status.danger.text.hex,
  '--color-text-warning':     status.warning.text.hex,
  '--color-text-info':        status.info.text.hex,
  '--color-text-accent':      status.accent.text.hex,

  // Border
  '--color-border-normal':    neutral[200].hex,
  '--color-border-strong':    neutral[400].hex,
  '--color-border-weak':      neutral[100].hex,
  '--color-border-brand':     neutral[900].hex,
  '--color-border-focus':     neutral[900].hex,
  '--color-border-success':   status.success.fill.hex,
  '--color-border-danger':    status.danger.fill.hex,
  '--color-border-warning':   status.warning.fill.hex,
  '--color-border-info':      status.info.fill.hex,
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
  '--color-fill-success':     status.success.fill.hex,
  '--color-fill-success-weak': status.success.bg.hex,
  '--color-fill-danger':      status.danger.fill.hex,
  '--color-fill-danger-weak': status.danger.bg.hex,
  '--color-fill-warning':     status.warning.fill.hex,
  '--color-fill-warning-weak': status.warning.bg.hex,
  '--color-fill-info':        status.info.fill.hex,
  '--color-fill-info-weak':   status.info.bg.hex,
  '--color-fill-accent':      status.accent.fill.hex,
  '--color-fill-accent-weak': status.accent.bg.hex,

  // Text
  '--color-text-normal':      neutral[50].hex,
  '--color-text-alternative': neutral[400].hex,
  '--color-text-assistive':   neutral[600].hex,
  '--color-text-disabled':    neutral[700].hex,
  '--color-text-on-fill':     neutral[950].hex,
  '--color-text-brand':       neutral[50].hex,
  '--color-text-success':     status.success.text.hex,
  '--color-text-danger':      status.danger.text.hex,
  '--color-text-warning':     status.warning.text.hex,
  '--color-text-info':        status.info.text.hex,
  '--color-text-accent':      status.accent.text.hex,

  // Border
  '--color-border-normal':    neutral[700].hex,
  '--color-border-strong':    neutral[500].hex,
  '--color-border-weak':      neutral[800].hex,
  '--color-border-brand':     neutral[50].hex,
  '--color-border-focus':     neutral[50].hex,
  '--color-border-success':   status.success.fill.hex,
  '--color-border-danger':    status.danger.fill.hex,
  '--color-border-warning':   status.warning.fill.hex,
  '--color-border-info':      status.info.fill.hex,
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
