import { BrandToken } from '@/types/token';

/**
 * Design System Engine — Theme Resolver
 *
 * Pure function that maps a raw BrandToken (+ platform) into a fully resolved,
 * semantic theme. Every spacing, type size, radius and color the UI renderer
 * uses comes from here — so the preview is genuinely token-driven, not a
 * mockup with swapped colors.
 */

export interface ResolvedType {
  size: number; // px
  lineHeight: number; // unitless multiplier
  letterSpacing: string;
  weight: number;
}

export interface ResolvedTheme {
  // ── colors (semantic) ──
  primary: string;
  onPrimary: string;
  bg: string;
  surface: string; // card / elevated surface
  surfaceAlt: string; // secondary fill (chips, inputs)
  textMain: string;
  textSub: string;
  textMuted: string;
  border: string;
  accent: string;
  success: string;
  danger: string;

  // ── typography ──
  font: string;
  weightRegular: number;
  weightMedium: number;
  weightBold: number;
  type: {
    display: ResolvedType;
    h1: ResolvedType;
    h2: ResolvedType;
    body: ResolvedType;
    bodySm: ResolvedType;
    caption: ResolvedType;
  };

  // ── spacing (semantic, px numbers) ──
  space: { xs: number; sm: number; md: number; lg: number; xl: number };
  containerPad: number; // outer screen padding
  cardPad: number; // inner card padding
  stackGap: number; // gap between stacked blocks
  rowGap: number; // gap inside a row

  // ── radii (px number or raw string for multi-corner) ──
  radius: {
    button: string;
    card: string;
    input: string;
    chip: string;
    badge: string;
  };

  // ── meta ──
  density: string;
  isMobile: boolean;
  category: string;
  isLocal: boolean;
}

/* ── helpers ── */

function luminance(hex: string): number {
  const h = hex.replace('#', '');
  if (h.length < 6) return 0.5;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

function contrastOn(hex: string): string {
  return luminance(hex) > 0.62 ? '#111111' : '#ffffff';
}

function findColor(
  colors: BrandToken['colors'],
  role: RegExp,
  fallback: string,
): string {
  return colors.find((c) => role.test(c.role))?.value ?? fallback;
}

function isNeutral(name: string): boolean {
  return /gray|grey|white|black|neutral/i.test(name);
}

function px(value: string | undefined, fallback: number): number {
  if (!value) return fallback;
  const n = parseFloat(value);
  return Number.isFinite(n) ? n : fallback;
}

/** nearest value in a numeric scale to a target */
function nearest(scale: number[], target: number): number {
  if (scale.length === 0) return target;
  return scale.reduce((best, v) =>
    Math.abs(v - target) < Math.abs(best - target) ? v : best,
  );
}

function resolveType(
  sizes: BrandToken['platforms']['mobile']['typography']['sizes'],
  role: RegExp,
  weight: number,
  fallbackSize: number,
): ResolvedType {
  const found = sizes.find((s) => role.test(s.role));
  return {
    size: px(found?.size, fallbackSize),
    lineHeight: found ? parseFloat(found.lineHeight) || 1.4 : 1.4,
    letterSpacing: found?.letterSpacing ?? '0',
    weight,
  };
}

/* ── main resolver ── */

export type ThemeMode = 'brand' | 'wireframe';

/** Neutral grayscale palette — keeps structure, removes brand color. */
const WIREFRAME_COLORS = {
  primary: '#52525b',
  onPrimary: '#ffffff',
  bg: '#ffffff',
  surface: '#f4f4f5',
  surfaceAlt: '#e8e8ea',
  textMain: '#3f3f46',
  textSub: '#71717a',
  textMuted: '#a1a1aa',
  border: '#e4e4e7',
  accent: '#a1a1aa',
  success: '#71717a',
  danger: '#71717a',
};

export function resolveTheme(
  token: BrandToken,
  platform: 'mobile' | 'web',
  mode: ThemeMode = 'brand',
): ResolvedTheme {
  const c = token.colors;
  const p = token.platforms[platform];

  // colors
  const primary =
    c.find((col) => /primary|주요 액션|CTA/i.test(col.role))?.value ??
    c.find((col) => !isNeutral(col.name))?.value ??
    '#3182F6';
  const onPrimary = contrastOn(primary);
  const accent =
    c.find((col) => !isNeutral(col.name) && col.value !== primary)?.value ??
    primary;

  // typography
  const weights = p.typography.weights;
  const weightRegular = weights[0] ?? 400;
  const weightMedium = weights.find((w) => w >= 500 && w < 700) ?? 500;
  const weightBold = weights[weights.length - 1] ?? 700;
  const sizes = p.typography.sizes;

  // spacing scale → semantic
  const scaleNums = p.spacing.scale
    .map((s) => px(s.value, 0))
    .filter((n) => n > 0)
    .sort((a, b) => a - b);
  const space = {
    xs: nearest(scaleNums, 4),
    sm: nearest(scaleNums, 8),
    md: nearest(scaleNums, 12),
    lg: nearest(scaleNums, 16),
    xl: nearest(scaleNums, 24),
  };

  // density drives the breathing room
  const density = p.spacing.density;
  const padTarget =
    density === 'compact' ? 12 : density === 'spacious' ? 24 : 16;
  const gapTarget =
    density === 'compact' ? 8 : density === 'spacious' ? 16 : 12;
  const containerPad = nearest(scaleNums, padTarget) || padTarget;
  const cardPad = nearest(scaleNums, density === 'compact' ? 12 : 16) || 16;
  const stackGap = nearest(scaleNums, gapTarget) || gapTarget;
  const rowGap = nearest(scaleNums, density === 'compact' ? 6 : 8) || 8;

  // radii
  const shape = (el: string, fb: string) =>
    p.shapes.find((s) => s.element === el)?.value ?? fb;

  const isLocal = !!token.serviceTypes?.some((s) =>
    /지역|커뮤니티|중고|동네/.test(s),
  );

  const brandColors = {
    primary,
    onPrimary,
    bg: findColor(c, /기본 배경|배경.*표면/, '#ffffff'),
    surface: findColor(c, /카드 배경|카드 표면|보조 배경/, '#f5f6f8'),
    surfaceAlt: findColor(c, /보조 배경|카드 배경/, '#eef0f3'),
    textMain: findColor(c, /본문 텍스트|주요 컨텐츠/, '#1a1a1a'),
    textSub: findColor(c, /보조 텍스트|라벨/, '#666666'),
    textMuted: findColor(c, /비활성|플레이스홀더|힌트/, '#9aa0a6'),
    border: findColor(c, /구분선|보더/, '#e5e7eb'),
    accent,
    success: findColor(c, /성공|증가/, '#27B853'),
    danger: findColor(c, /에러|위험|감소/, '#F04452'),
  };
  const palette = mode === 'wireframe' ? WIREFRAME_COLORS : brandColors;

  return {
    ...palette,

    font: p.typography.family,
    weightRegular,
    weightMedium,
    weightBold,
    type: {
      display: resolveType(sizes, /display/i, weightBold, 28),
      h1: resolveType(sizes, /heading 1|h1|제목 1/i, weightBold, 22),
      h2: resolveType(sizes, /heading 2|h2|제목 2/i, weightBold, 18),
      body: resolveType(sizes, /body 1|본문 1|^body$/i, weightRegular, 16),
      bodySm: resolveType(sizes, /body 2|본문 2/i, weightRegular, 14),
      caption: resolveType(sizes, /caption|캡션/i, weightRegular, 12),
    },

    space,
    containerPad,
    cardPad,
    stackGap,
    rowGap,

    radius: {
      button: shape('button', '8px'),
      card: shape('card', '12px'),
      input: shape('input', '8px'),
      chip: shape('chip', '9999px'),
      badge: shape('badge', '4px'),
    },

    density,
    isMobile: platform === 'mobile',
    category: token.category,
    isLocal,
  };
}

export { contrastOn };
