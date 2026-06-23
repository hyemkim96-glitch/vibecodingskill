/**
 * Role & Variant Color Tokens — Foundation tier 3 & 4
 *
 * Cascade order:
 *   Palette (primitive) → Semantic (intent) → Role (component) → Variant (state)
 *
 * Role tokens bind a semantic intent to a specific component slot.
 * Variant tokens override a role token for a particular interaction state.
 *
 * Naming convention:
 *   Role:    --comp-{component}-{slot}-{modifier?}
 *   Variant: --comp-{component}-{slot}-{state}
 *
 * These JS objects hold resolved hex values (from semanticTokens) for use in
 * the Foundation docs and type-safe token inspection. The matching CSS custom
 * properties in globals.css reference var(--color-*) so they cascade with
 * dark mode automatically.
 */

import { lightTokens, darkTokens, TokenMap } from './semanticTokens';

// ── Role Tokens ───────────────────────────────────────────────────────────────

export const lightRoleTokens: TokenMap = {
  // Button
  '--comp-button-primary-bg':        lightTokens['--color-fill-normal'],
  '--comp-button-primary-fg':        lightTokens['--color-text-on-fill'],
  '--comp-button-secondary-bg':      lightTokens['--color-fill-neutral'],
  '--comp-button-secondary-fg':      lightTokens['--color-text-normal'],
  '--comp-button-secondary-bd':      lightTokens['--color-border-normal'],
  '--comp-button-outline-bd':        lightTokens['--color-border-brand'],
  '--comp-button-outline-fg':        lightTokens['--color-text-brand'],
  '--comp-button-ghost-fg':          lightTokens['--color-text-normal'],
  '--comp-button-disabled-bg':       lightTokens['--color-fill-neutral'],
  '--comp-button-disabled-fg':       lightTokens['--color-text-disabled'],

  // Badge
  '--comp-badge-solid-bg':           lightTokens['--color-fill-normal'],
  '--comp-badge-solid-fg':           lightTokens['--color-text-on-fill'],
  '--comp-badge-soft-bg':            lightTokens['--color-fill-brand-weak'],
  '--comp-badge-soft-fg':            lightTokens['--color-text-brand'],
  '--comp-badge-accent-bg':          lightTokens['--color-fill-accent-weak'],
  '--comp-badge-accent-fg':          lightTokens['--color-text-accent'],
  '--comp-badge-muted-bg':           lightTokens['--color-bg-elevated'],
  '--comp-badge-muted-fg':           lightTokens['--color-text-alternative'],
  '--comp-badge-muted-bd':           lightTokens['--color-border-normal'],

  // Chip
  '--comp-chip-bg':                  lightTokens['--color-bg-elevated'],
  '--comp-chip-fg':                  lightTokens['--color-text-alternative'],
  '--comp-chip-bd':                  lightTokens['--color-border-normal'],
  '--comp-chip-active-bg':           lightTokens['--color-fill-normal'],
  '--comp-chip-active-fg':           lightTokens['--color-text-on-fill'],

  // Input
  '--comp-input-bg':                 lightTokens['--color-bg-normal'],
  '--comp-input-bd':                 lightTokens['--color-border-normal'],
  '--comp-input-fg':                 lightTokens['--color-text-normal'],
  '--comp-input-placeholder':        lightTokens['--color-text-assistive'],
  '--comp-input-label':              lightTokens['--color-text-normal'],

  // Card
  '--comp-card-bg':                  lightTokens['--color-bg-elevated'],
  '--comp-card-bd':                  lightTokens['--color-border-normal'],

  // NavTab
  '--comp-navtab-fg':                lightTokens['--color-text-assistive'],
  '--comp-navtab-fg-active':         lightTokens['--color-text-normal'],
  '--comp-navtab-indicator':         lightTokens['--color-fill-normal'],
};

export const darkRoleTokens: TokenMap = {
  // Button
  '--comp-button-primary-bg':        darkTokens['--color-fill-normal'],
  '--comp-button-primary-fg':        darkTokens['--color-text-on-fill'],
  '--comp-button-secondary-bg':      darkTokens['--color-fill-neutral'],
  '--comp-button-secondary-fg':      darkTokens['--color-text-normal'],
  '--comp-button-secondary-bd':      darkTokens['--color-border-normal'],
  '--comp-button-outline-bd':        darkTokens['--color-border-brand'],
  '--comp-button-outline-fg':        darkTokens['--color-text-brand'],
  '--comp-button-ghost-fg':          darkTokens['--color-text-normal'],
  '--comp-button-disabled-bg':       darkTokens['--color-fill-neutral'],
  '--comp-button-disabled-fg':       darkTokens['--color-text-disabled'],

  // Badge
  '--comp-badge-solid-bg':           darkTokens['--color-fill-normal'],
  '--comp-badge-solid-fg':           darkTokens['--color-text-on-fill'],
  '--comp-badge-soft-bg':            darkTokens['--color-fill-brand-weak'],
  '--comp-badge-soft-fg':            darkTokens['--color-text-brand'],
  '--comp-badge-accent-bg':          darkTokens['--color-fill-accent-weak'],
  '--comp-badge-accent-fg':          darkTokens['--color-text-accent'],
  '--comp-badge-muted-bg':           darkTokens['--color-bg-elevated'],
  '--comp-badge-muted-fg':           darkTokens['--color-text-alternative'],
  '--comp-badge-muted-bd':           darkTokens['--color-border-normal'],

  // Chip
  '--comp-chip-bg':                  darkTokens['--color-bg-elevated'],
  '--comp-chip-fg':                  darkTokens['--color-text-alternative'],
  '--comp-chip-bd':                  darkTokens['--color-border-normal'],
  '--comp-chip-active-bg':           darkTokens['--color-fill-normal'],
  '--comp-chip-active-fg':           darkTokens['--color-text-on-fill'],

  // Input
  '--comp-input-bg':                 darkTokens['--color-bg-normal'],
  '--comp-input-bd':                 darkTokens['--color-border-normal'],
  '--comp-input-fg':                 darkTokens['--color-text-normal'],
  '--comp-input-placeholder':        darkTokens['--color-text-assistive'],
  '--comp-input-label':              darkTokens['--color-text-normal'],

  // Card
  '--comp-card-bg':                  darkTokens['--color-bg-elevated'],
  '--comp-card-bd':                  darkTokens['--color-border-normal'],

  // NavTab
  '--comp-navtab-fg':                darkTokens['--color-text-assistive'],
  '--comp-navtab-fg-active':         darkTokens['--color-text-normal'],
  '--comp-navtab-indicator':         darkTokens['--color-fill-normal'],
};

// ── Variant Tokens (interaction states) ───────────────────────────────────────

export const lightVariantTokens: TokenMap = {
  // Button states
  '--comp-button-primary-bg-hover':    lightTokens['--color-fill-strong'],
  '--comp-button-primary-bg-pressed':  lightTokens['--color-fill-alternative'],
  '--comp-button-secondary-bg-hover':  lightTokens['--color-fill-neutral-alt'],
  '--comp-button-outline-bd-hover':    lightTokens['--color-border-strong'],
  '--comp-button-ghost-fg-hover':      lightTokens['--color-text-normal'],
  '--comp-button-ghost-bg-hover':      lightTokens['--color-fill-neutral'],

  // Chip states
  '--comp-chip-bg-hover':              lightTokens['--color-fill-neutral'],
  '--comp-chip-bd-hover':              lightTokens['--color-border-strong'],

  // Card states
  '--comp-card-bg-hover':              lightTokens['--color-fill-neutral'],

  // Input states
  '--comp-input-bd-focus':             lightTokens['--color-border-focus'],
  '--comp-input-shadow-focus':         lightTokens['--color-fill-brand-weak'],
  '--comp-input-bd-error':             lightTokens['--color-border-danger'],
  '--comp-input-fg-error':             lightTokens['--color-text-danger'],
  '--comp-input-bg-disabled':          lightTokens['--color-fill-neutral'],
  '--comp-input-bd-disabled':          lightTokens['--color-border-weak'],
  '--comp-input-fg-disabled':          lightTokens['--color-text-disabled'],
  '--comp-input-placeholder-disabled': lightTokens['--color-text-disabled'],

  // NavTab states
  '--comp-navtab-fg-hover':            lightTokens['--color-text-alternative'],
};

export const darkVariantTokens: TokenMap = {
  // Button states
  '--comp-button-primary-bg-hover':    darkTokens['--color-fill-strong'],
  '--comp-button-primary-bg-pressed':  darkTokens['--color-fill-alternative'],
  '--comp-button-secondary-bg-hover':  darkTokens['--color-fill-neutral-alt'],
  '--comp-button-outline-bd-hover':    darkTokens['--color-border-strong'],
  '--comp-button-ghost-fg-hover':      darkTokens['--color-text-normal'],
  '--comp-button-ghost-bg-hover':      darkTokens['--color-fill-neutral'],

  // Chip states
  '--comp-chip-bg-hover':              darkTokens['--color-fill-neutral'],
  '--comp-chip-bd-hover':              darkTokens['--color-border-strong'],

  // Card states
  '--comp-card-bg-hover':              darkTokens['--color-fill-neutral'],

  // Input states
  '--comp-input-bd-focus':             darkTokens['--color-border-focus'],
  '--comp-input-shadow-focus':         darkTokens['--color-fill-brand-weak'],
  '--comp-input-bd-error':             darkTokens['--color-border-danger'],
  '--comp-input-fg-error':             darkTokens['--color-text-danger'],
  '--comp-input-bg-disabled':          darkTokens['--color-fill-neutral'],
  '--comp-input-bd-disabled':          darkTokens['--color-border-weak'],
  '--comp-input-fg-disabled':          darkTokens['--color-text-disabled'],
  '--comp-input-placeholder-disabled': darkTokens['--color-text-disabled'],

  // NavTab states
  '--comp-navtab-fg-hover':            darkTokens['--color-text-alternative'],
};
