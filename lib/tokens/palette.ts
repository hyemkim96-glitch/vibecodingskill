/**
 * Primitive Color Palette
 * OKLCH-based with perceptual uniformity + hex fallbacks
 */

export interface PaletteColor {
  oklch: string;
  hex: string;
}

export const neutral: Record<0 | 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950 | 1000, PaletteColor> = {
  0:    { oklch: 'oklch(1.000 0.000 0)',   hex: '#ffffff' },
  50:   { oklch: 'oklch(0.985 0.002 286)', hex: '#fafafa' },
  100:  { oklch: 'oklch(0.961 0.003 286)', hex: '#f4f4f5' },
  200:  { oklch: 'oklch(0.921 0.004 286)', hex: '#e4e4e7' },
  300:  { oklch: 'oklch(0.870 0.005 286)', hex: '#d1d1d6' },
  400:  { oklch: 'oklch(0.718 0.008 286)', hex: '#a0a0ab' },
  500:  { oklch: 'oklch(0.556 0.009 286)', hex: '#71717a' },
  600:  { oklch: 'oklch(0.442 0.008 286)', hex: '#52525b' },
  700:  { oklch: 'oklch(0.350 0.007 286)', hex: '#3f3f46' },
  800:  { oklch: 'oklch(0.269 0.005 286)', hex: '#27272a' },
  900:  { oklch: 'oklch(0.205 0.004 286)', hex: '#18181b' },
  950:  { oklch: 'oklch(0.130 0.003 286)', hex: '#09090b' },
  1000: { oklch: 'oklch(0.000 0.000 0)',   hex: '#000000' },
};

export const status = {
  success: {
    fill: { oklch: 'oklch(0.527 0.154 145)', hex: '#16a34a' },
    text: { oklch: 'oklch(0.431 0.144 145)', hex: '#15803d' },
    bg:   { oklch: 'oklch(0.950 0.041 145)', hex: '#f0fdf4' },
  },
  danger: {
    fill: { oklch: 'oklch(0.527 0.195 27)', hex: '#dc2626' },
    text: { oklch: 'oklch(0.431 0.186 27)', hex: '#b91c1c' },
    bg:   { oklch: 'oklch(0.950 0.045 27)', hex: '#fef2f2' },
  },
  warning: {
    fill: { oklch: 'oklch(0.602 0.140 60)', hex: '#d97706' },
    text: { oklch: 'oklch(0.498 0.131 60)', hex: '#b45309' },
    bg:   { oklch: 'oklch(0.952 0.038 60)', hex: '#fffbeb' },
  },
  info: {
    fill: { oklch: 'oklch(0.488 0.155 254)', hex: '#2563eb' },
    text: { oklch: 'oklch(0.390 0.148 254)', hex: '#1d4ed8' },
    bg:   { oklch: 'oklch(0.950 0.040 254)', hex: '#eff6ff' },
  },
  accent: {
    fill: { oklch: 'oklch(0.541 0.198 293)', hex: '#7c3aed' },
    text: { oklch: 'oklch(0.440 0.187 293)', hex: '#6d28d9' },
    bg:   { oklch: 'oklch(0.950 0.045 293)', hex: '#f5f3ff' },
  },
};
