import { BrandToken } from '@/types/token';

/**
 * Design System Engine — Theme Resolver v2
 *
 * Pure function: BrandToken + platform + mode → ResolvedTheme.
 * Every px, color, weight and timing value the renderer uses flows from here.
 *
 * Key improvements over v1:
 * - px(): handles rem units (converts at 16px base), not just px strings
 * - contrastOn(): WCAG-compliant relative luminance (sRGB linearisation), not
 *   the simplified weighted-sum shortcut
 * - surface vs surfaceAlt: separate regex buckets → never the same color
 * - weightMedium: picks the weight closest to 500 from the brand's actual set,
 *   so brands with only [400, 700] don't end up requesting a missing 500
 * - dark-theme support: WIREFRAME_DARK palette used when token.theme === 'dark'
 * - primaryTint: tint ratio scales with primary luminance so the tint stays
 *   visible on light backgrounds (pale colours tinted less aggressively)
 * - resolveMotion: safe against missing deep / missing interaction fields
 */

export interface ResolvedType {
  size: number;        // px
  lineHeight: number;  // unitless multiplier
  letterSpacing: string;
  weight: number;
}

export interface ResolvedMotion {
  duration: number;    // ms — standard transition
  easing: string;      // css timing function
  pressScale: number;  // active/press feedback (0.97 = slight shrink)
  hoverScale: number;  // hover lift (1 = none, 1.02 = slight grow)
}

export interface ResolvedTheme {
  // ── colors ──
  primary: string;
  onPrimary: string;
  primaryTint: string;  // opaque soft-badge / chip background
  bg: string;
  surface: string;      // card / elevated surface
  surfaceAlt: string;   // secondary fills, skeleton, striped thumbs
  textMain: string;
  textSub: string;
  textMuted: string;
  border: string;
  accent: string;
  success: string;
  danger: string;
  textOnImage: string;   // text placed over imagery (inverse)
  scrim: string;         // gradient overlay for image legibility

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
  space: { xxs: number; xs: number; sm: number; md: number; lg: number; xl: number };
  containerPad: number;
  cardPad: number;
  stackGap: number;
  rowGap: number;

  // ── radii ──
  radius: {
    button: string;
    card: string;
    input: string;
    chip: string;
    badge: string;
  };

  // ── motion ──
  motion: ResolvedMotion;

  // ── meta ──
  density: string;
  isMobile: boolean;
  isDark: boolean;
  category: string;
  isLocal: boolean;
  iconStyle: 'lucide' | 'phosphor' | 'tabler';
}

/* ── helpers ── */

/**
 * WCAG-correct relative luminance.
 * Uses sRGB linearisation (gamma 2.2 approximation) rather than the
 * simple 0.299/0.587/0.114 weighted sum — the latter over-estimates
 * luminance for saturated greens/cyans, causing contrastOn to return
 * the wrong colour for mid-range hues.
 */
function relativeLuminance(hex: string): number {
  const h = hex.replace('#', '');
  if (h.length < 6) return 0.5;
  const linearize = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  const r = linearize(parseInt(h.slice(0, 2), 16));
  const g = linearize(parseInt(h.slice(2, 4), 16));
  const b = linearize(parseInt(h.slice(4, 6), 16));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastOn(hex: string): string {
  const L = relativeLuminance(hex);
  // contrast ratio vs white = (L + 0.05) / (1 + 0.05)
  // contrast ratio vs black = (0 + 0.05) / (L + 0.05) = 0.05 / (L + 0.05)
  const onWhite = (1.05) / (L + 0.05);
  const onBlack = (L + 0.05) / 0.05;
  return onBlack > onWhite ? '#111111' : '#ffffff';
}

/** Mix a hex colour toward white by ratio (0 → original, 1 → white). */
function tintToward(hex: string, ratio: number): string {
  const h = hex.replace('#', '');
  if (h.length < 6) return hex;
  const mix = (c: number) => Math.round(c + (255 - c) * ratio);
  const r = mix(parseInt(h.slice(0, 2), 16));
  const g = mix(parseInt(h.slice(2, 4), 16));
  const b = mix(parseInt(h.slice(4, 6), 16));
  return '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('');
}

/** Mix a hex colour toward black by ratio (0 → original, 1 → black). */
function shadeToward(hex: string, ratio: number): string {
  const h = hex.replace('#', '');
  if (h.length < 6) return hex;
  const mix = (c: number) => Math.round(c * (1 - ratio));
  const r = mix(parseInt(h.slice(0, 2), 16));
  const g = mix(parseInt(h.slice(2, 4), 16));
  const b = mix(parseInt(h.slice(4, 6), 16));
  return '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('');
}

/**
 * Derive an opaque soft-tint background that reads well on both light and dark
 * surfaces without alpha. Adapts the ratio to the primary's own luminance so
 * very pale colours (e.g. Kakao yellow) don't wash out completely.
 */
function deriveTint(primary: string, isDark: boolean): string {
  const L = relativeLuminance(primary);
  if (isDark) {
    // On dark surfaces, shade primary slightly for the tint slot
    return shadeToward(primary, Math.min(0.6, 0.2 + L * 0.5));
  }
  // On light surfaces: the more luminous the primary, the less we tint it
  // (a pale yellow at L=0.8 only needs ~0.6 extra whitening; a dark navy at
  // L=0.05 can go all the way to 0.90 toward white)
  const ratio = Math.max(0.60, Math.min(0.90, 1 - L * 0.4));
  return tintToward(primary, ratio);
}

function findColor(colors: BrandToken['colors'], role: RegExp, fallback: string): string {
  return colors.find((c) => role.test(c.role))?.value ?? fallback;
}

function isNeutral(name: string): boolean {
  return /gray|grey|white|black|neutral|배경|표면/i.test(name);
}

/**
 * Parse a CSS size string to px number.
 * Handles: '14px', '14', '0.875rem', '1.2rem', '1.5' (treated as px).
 */
function px(value: string | undefined, fallback: number): number {
  if (!value) return fallback;
  const trimmed = value.trim();
  if (trimmed.endsWith('rem')) {
    const n = parseFloat(trimmed);
    return Number.isFinite(n) ? Math.round(n * 16) : fallback;
  }
  const n = parseFloat(trimmed);
  return Number.isFinite(n) ? n : fallback;
}

/**
 * Resolve the brand's interaction token (freeform text) into usable values.
 * Safe against missing deep / missing interaction fields.
 */
function resolveMotion(deep: BrandToken['deep']): ResolvedMotion {
  const i = deep?.interaction;
  let duration = 200;
  if (i?.duration) {
    // prefer "NNNms (standard)" label
    const std = /(\d+)\s*ms\s*\(standard\)/i.exec(i.duration);
    const first = /(\d+)\s*ms/i.exec(i.duration);
    const parsed = parseInt((std?.[1] ?? first?.[1]) ?? '', 10);
    if (Number.isFinite(parsed) && parsed > 0 && parsed < 2000) duration = parsed;
  }

  let easing = 'cubic-bezier(0.4, 0, 0.2, 1)';
  if (i?.easing) {
    const cb = /cubic-bezier\([^)]*\)/i.exec(i.easing);
    const named = /\b(ease-in-out|ease-out|ease-in|ease|linear)\b/i.exec(i.easing);
    easing = cb?.[0] ?? named?.[0] ?? easing;
  }

  const scaleFrom = (s: string | undefined, fb: number): number => {
    if (!s) return fb;
    const m = /scale\(([\d.]+)\)/.exec(s) ?? /([\d.]+)/.exec(s);
    const v = parseFloat(m?.[1] ?? '');
    return Number.isFinite(v) && v > 0 && v < 2 ? v : fb;
  };

  return {
    duration,
    easing,
    pressScale: scaleFrom(i?.pressScale, 0.97),
    hoverScale: scaleFrom(i?.hoverScale, 1),
  };
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
    lineHeight: found ? (parseFloat(found.lineHeight) || 1.4) : 1.4,
    letterSpacing: found?.letterSpacing ?? '0',
    weight,
  };
}

/* ── wireframe palettes ── */

const WIREFRAME_LIGHT = {
  primary: '#18181b',      // shadcn-style: black primary
  onPrimary: '#ffffff',
  primaryTint: '#f4f4f5',
  bg: '#ffffff',
  surface: '#f4f4f5',
  surfaceAlt: '#e4e4e7',
  textMain: '#18181b',
  textSub: '#71717a',
  textMuted: '#a1a1aa',
  border: '#e4e4e7',
  accent: '#6366f1',       // indigo for accent/info
  success: '#16a34a',      // green-600
  danger: '#dc2626',       // red-600
};

// Dark-background wireframe variant
const WIREFRAME_DARK = {
  primary: '#f4f4f5',      // near-white primary on dark
  onPrimary: '#18181b',
  primaryTint: '#27272a',
  bg: '#18181b',
  surface: '#27272a',
  surfaceAlt: '#3f3f46',
  textMain: '#f4f4f5',
  textSub: '#a1a1aa',
  textMuted: '#71717a',
  border: '#3f3f46',
  accent: '#818cf8',       // indigo-400 for dark bg
  success: '#4ade80',      // green-400
  danger: '#f87171',       // red-400
};

/* ── main resolver ── */

export type ThemeMode = 'brand' | 'wireframe';

export function resolveTheme(
  token: BrandToken,
  platform: 'mobile' | 'web',
  mode: ThemeMode = 'brand',
): ResolvedTheme {
  const c = token.colors;
  const p = token.platforms[platform];
  const isDark = token.theme === 'dark';

  // ── primary color ──
  const primary =
    c.find((col) => /primary|주요 액션|CTA/i.test(col.role))?.value ??
    c.find((col) => !isNeutral(col.name))?.value ??
    '#3182F6';
  const onPrimary = contrastOn(primary);

  // accent: first non-neutral colour that isn't primary
  const accent =
    c.find((col) => !isNeutral(col.name) && col.value !== primary)?.value ??
    primary;

  // ── typography weights ──
  const weights = p.typography.weights.slice().sort((a, b) => a - b);
  const weightRegular = weights[0] ?? 400;
  const weightBold = weights[weights.length - 1] ?? 700;
  // closest to 500 from the actual weight set (avoids requesting missing weights)
  const weightMedium = weights.reduce((best, w) =>
    Math.abs(w - 500) < Math.abs(best - 500) ? w : best, weightBold);

  const sizes = p.typography.sizes;

  // ── spacing — monotonic 4px grid, density drives rhythm ──
  const density = p.spacing.density;
  const scaleNums = p.spacing.scale
    .map((s) => px(s.value, 0))
    .filter((n) => n > 0)
    .sort((a, b) => a - b);
  const baseUnit = Math.min(6, Math.max(4, scaleNums[0] || 4));
  const space = {
    xxs: Math.round(baseUnit / 2), // 2–3px — micro gaps (label/value, badge stacks)
    xs: baseUnit,          // 4–6px
    sm: baseUnit * 2,      // 8–12px
    md: baseUnit * 3,      // 12–18px
    lg: baseUnit * 4,      // 16–24px
    xl: baseUnit * 6,      // 24–36px
  };

  const rhythm = {
    compact:     { container: 12, card: 12, stack: 8,  row: 6  },
    regular:     { container: 16, card: 16, stack: 12, row: 8  },
    comfortable: { container: 18, card: 16, stack: 14, row: 9  },
    spacious:    { container: 24, card: 20, stack: 16, row: 10 },
  } as const;
  const r = rhythm[(density as keyof typeof rhythm)] ?? rhythm.regular;

  // ── radii ──
  const shape = (el: string, fb: string) =>
    p.shapes.find((s) => s.element === el)?.value ?? fb;

  // ── brand palette (separate regexes so surface ≠ surfaceAlt) ──
  const bgFallback = isDark ? '#111111' : '#ffffff';
  const surfFallback = isDark ? '#1e1e1e' : '#f5f6f8';
  const surfAltFallback = isDark ? '#2a2a2a' : '#eef0f3';

  const brandColors = {
    primary,
    onPrimary,
    primaryTint:
      c.find((col) => /강조 영역 배경|강조 배경|tint/.test(col.role))?.value ??
      deriveTint(primary, isDark),
    bg: findColor(c, /^기본 배경$|^배경$|배경 \(기본\)/, bgFallback),
    // surface: card/elevated — "카드 배경" or "카드 표면" only
    surface: findColor(c, /카드 배경|카드 표면/, surfFallback),
    // surfaceAlt: secondary fill — "보조 배경" only, intentionally different regex
    surfaceAlt: findColor(c, /보조 배경|비활성 배경|입력 배경/, surfAltFallback),
    textMain: findColor(c, /본문 텍스트|주요 컨텐츠|^텍스트 \(기본\)$/, isDark ? '#f0f0f0' : '#1a1a1a'),
    textSub: findColor(c, /보조 텍스트|라벨|^텍스트 \(보조\)$/, isDark ? '#a0a0a0' : '#666666'),
    textMuted: findColor(c, /비활성 텍스트|플레이스홀더|힌트/, isDark ? '#606060' : '#9aa0a6'),
    border: findColor(c, /구분선|보더|^선$/, isDark ? '#333333' : '#e5e7eb'),
    accent,
    success: findColor(c, /성공|증가|긍정/, '#27B853'),
    danger: findColor(c, /에러|위험|감소|부정/, '#F04452'),
  };

  const wireframePalette = isDark ? WIREFRAME_DARK : WIREFRAME_LIGHT;
  const palette = mode === 'wireframe' ? wireframePalette : brandColors;

  const isLocal = !!token.serviceTypes?.some((s) => /지역|커뮤니티|중고|동네/.test(s));

  return {
    ...palette,

    textOnImage: '#ffffff',
    scrim: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 60%)',

    font: mode === 'wireframe'
      ? "'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, sans-serif"
      : p.typography.family,
    weightRegular,
    weightMedium,
    weightBold,
    type: {
      display: resolveType(sizes, /display/i,                    weightBold,   28),
      h1:      resolveType(sizes, /heading\s*1|h1|제목\s*1/i,   weightBold,   22),
      h2:      resolveType(sizes, /heading\s*2|h2|제목\s*2/i,   weightBold,   18),
      body:    resolveType(sizes, /body\s*1|본문\s*1|^body$/i,  weightRegular, 16),
      bodySm:  resolveType(sizes, /body\s*2|본문\s*2/i,         weightRegular, 14),
      caption: resolveType(sizes, /caption|캡션/i,              weightRegular, 12),
    },

    space,
    containerPad: r.container,
    cardPad:      r.card,
    stackGap:     r.stack,
    rowGap:       r.row,

    radius: {
      button: shape('button', '8px'),
      card:   shape('card',   '12px'),
      input:  shape('input',  '8px'),
      chip:   shape('chip',   '9999px'),
      badge:  shape('badge',  '4px'),
    },

    motion: resolveMotion(token.deep),

    density,
    isMobile: platform === 'mobile',
    isDark,
    category: token.category,
    isLocal,
    iconStyle: resolveIconStyleFromToken(token),
  };
}

function resolveIconStyleFromToken(token: BrandToken): 'lucide' | 'phosphor' | 'tabler' {
  const hint = token.deep?.iconStyle?.toLowerCase() ?? '';
  if (/fill|bold|두꺼|굵/.test(hint)) return 'phosphor';
  if (/tabler|editorial|각진/.test(hint)) return 'tabler';
  if (/lucide|stroke|라인|선형/.test(hint)) return 'lucide';
  // service type fallback
  const s = (token.serviceTypes ?? []).join(' ');
  if (/메신저|소셜|채팅|배달|푸드|지역|중고|커뮤니티|동네/.test(s)) return 'phosphor';
  if (token.category === '커머스') return 'tabler';
  return 'lucide';
}
