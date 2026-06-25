import { BrandToken } from '@/types/token';
import { lightTokens, darkTokens } from './semanticTokens';
import { deriveTintOklch, ensureContrastOklch, relativeLuminance } from './oklch';
import { makeBrandHarmony, BrandHueStep } from './palette';

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
  warning: string;
  info: string;
  disabled: string;
  textDisabled: string;
  // Auto-contrast text variants — WCAG AA guaranteed against current bg
  successText: string;
  dangerText: string;
  warningText: string;
  infoText: string;
  // Weak (tint) fills — semantic bg tints for toasts, banners, chips
  successWeak: string;
  dangerWeak: string;
  warningWeak: string;
  infoWeak: string;
  starFill: string;      // warm highlight amber — --color-fill-highlight
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

  // ── elevation (shadow scale) ──
  shadow: { sm: string; md: string; lg: string; xl: string };

  // ── meta ──
  density: string;
  isMobile: boolean;
  isDark: boolean;
  category: string;
  isLocal: boolean;
  iconStyle: 'lucide' | 'phosphor' | 'tabler';
  // structural layout signature derived from layout.columns + category
  archetype: LayoutArchetype;
}

export type LayoutArchetype = 'masonry' | 'grid' | 'list' | 'stack' | 'feed';

/* ── helpers ── */

export function contrastOn(hex: string): string {
  const L = relativeLuminance(hex);
  // For dark-to-medium colors (L < 0.24), white text is always safer visually —
  // pure math picks black on e.g. dark blue (#1A74E9, L≈0.208) because the ratio
  // is marginally higher, but the result fails the eye test at that luminance range.
  if (L < 0.24) return lightTokens['--color-text-on-fill'];
  const onWhite = 1.05 / (L + 0.05);
  const onBlack = (L + 0.05) / 0.05;
  return onBlack > onWhite ? lightTokens['--color-text-normal'] : lightTokens['--color-text-on-fill'];
}

export function ensureContrast(fg: string, bg: string, minRatio = 4.5): string {
  return ensureContrastOklch(fg, bg, minRatio);
}

function deriveTint(primary: string, isDark: boolean): string {
  return deriveTintOklch(primary, isDark);
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
  fallbackLineHeight = 1.6,
  fallbackLetterSpacing = '-0.01em',
): ResolvedType {
  const found = sizes.find((s) => role.test(s.role));
  return {
    size: px(found?.size, fallbackSize),
    lineHeight: found ? (parseFloat(found.lineHeight) || fallbackLineHeight) : fallbackLineHeight,
    letterSpacing: found?.letterSpacing ?? fallbackLetterSpacing,
    weight,
  };
}

/* ── wireframe palettes ── */

const wl = lightTokens;
const wd = darkTokens;

const WIREFRAME_LIGHT = {
  primary:      wl['--color-fill-normal'],
  onPrimary:    wl['--color-text-on-fill'],
  primaryTint:  wl['--color-fill-brand-weak'],
  bg:           wl['--color-bg-normal'],
  surface:      wl['--color-bg-elevated'],
  surfaceAlt:   wl['--color-fill-neutral'],
  textMain:     wl['--color-text-normal'],
  textSub:      wl['--color-text-alternative'],
  textMuted:    wl['--color-text-assistive'],
  border:       wl['--color-border-normal'],
  accent:       wl['--color-fill-accent'],
  success:      wl['--color-fill-success'],
  danger:       wl['--color-fill-danger'],
  warning:      wl['--color-fill-warning'],
  info:         wl['--color-fill-info'],
  disabled:     wl['--color-fill-neutral-alt'],
  textDisabled: wl['--color-text-disabled'],
  starFill:     wl['--color-fill-highlight'],
  successWeak:  wl['--color-fill-success-weak'],
  dangerWeak:   wl['--color-fill-danger-weak'],
  warningWeak:  wl['--color-fill-warning-weak'],
  infoWeak:     wl['--color-fill-info-weak'],
  successText: '', dangerText: '', warningText: '', infoText: '',
};

// Dark-background wireframe variant
const WIREFRAME_DARK = {
  primary:      wd['--color-fill-normal'],
  onPrimary:    wd['--color-text-on-fill'],
  primaryTint:  wd['--color-fill-brand-weak'],
  bg:           wd['--color-bg-normal'],
  surface:      wd['--color-bg-elevated'],
  surfaceAlt:   wd['--color-fill-neutral-alt'],
  textMain:     wd['--color-text-normal'],
  textSub:      wd['--color-text-alternative'],
  textMuted:    wd['--color-text-assistive'],
  border:       wd['--color-border-normal'],
  accent:       wd['--color-fill-accent'],
  success:      wd['--color-fill-success'],
  danger:       wd['--color-fill-danger'],
  warning:      wd['--color-fill-warning'],
  info:         wd['--color-fill-info'],
  disabled:     wd['--color-fill-neutral-alt'],
  textDisabled: wd['--color-text-disabled'],
  starFill:     wd['--color-fill-highlight'],
  successWeak:  wd['--color-fill-success-weak'],
  dangerWeak:   wd['--color-fill-danger-weak'],
  warningWeak:  wd['--color-fill-warning-weak'],
  infoWeak:     wd['--color-fill-info-weak'],
  successText: '', dangerText: '', warningText: '', infoText: '',
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
    (isDark ? darkTokens['--color-fill-brand'] : lightTokens['--color-fill-brand']);
  // Prefer an explicit brand override (e.g. Kakao brown on yellow, Daangn white on orange)
  const onPrimaryExplicit = c.find((col) => /CTA 텍스트|버튼 텍스트/i.test(col.role))?.value;
  const onPrimary = onPrimaryExplicit ?? contrastOn(primary);

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
  // Density drives the *rhythm* of the larger gaps so it reads as a real brand
  // signal, not just a colour swap. Micro gaps (xxs/xs) stay near the grid base
  // so component internals don't break; sm is lightly damped; md/lg/xl take the
  // full factor — compact (Coupang·Naver·Musinsa) visibly tighter, spacious
  // (Toss·KakaoBank·29CM) visibly airier.
  const densityFactor =
    ({ compact: 0.82, regular: 1, comfortable: 1.14, spacious: 1.34 } as Record<string, number>)[density] ?? 1;
  const space = {
    xxs: Math.round(baseUnit / 2),                       // 2–3px — micro gaps (label/value, badge stacks)
    xs:  baseUnit,                                       // 4–6px
    sm:  Math.round(baseUnit * 2 * (0.55 + 0.45 * densityFactor)), // 8–12px, lightly damped
    md:  Math.round(baseUnit * 3 * densityFactor),       // 12–18px
    lg:  Math.round(baseUnit * 4 * densityFactor),       // 16–24px
    xl:  Math.round(baseUnit * 6 * densityFactor),       // 24–36px
  };

  // Amplified rhythm — compact vs spacious gap widened so density reads as a
  // real brand signal (Naver dense multi-section vs Toss airy single-focus).
  const rhythm = {
    compact:     { container: 10, card: 10, stack: 6,  row: 5  },
    regular:     { container: 16, card: 14, stack: 12, row: 8  },
    comfortable: { container: 20, card: 18, stack: 16, row: 10 },
    spacious:    { container: 28, card: 24, stack: 20, row: 13 },
  } as const;
  const r = rhythm[(density as keyof typeof rhythm)] ?? rhythm.regular;

  // ── radii ──
  const shape = (el: string, fb: string) =>
    p.shapes.find((s) => s.element === el)?.value ?? fb;

  // ── brand palette (separate regexes so surface ≠ surfaceAlt) ──
  // Fallbacks use Foundation semantic token names, not raw palette refs.
  const lt = lightTokens;
  const dt = darkTokens;

  // Harmonious semantic hue families — same chromaScale as brand primary so
  // success/danger/warning/info read as perceptually matched in saturation.
  const harmony = makeBrandHarmony(primary);
  const hAt = (family: BrandHueStep[], step: 600 | 700) =>
    family.find((s) => s.step === step)?.hex;

  const brandColors = {
    primary,
    onPrimary,
    primaryTint: isDark
      ? deriveTint(primary, true)
      : (c.find((col) => /강조 영역 배경|강조 배경|tint/.test(col.role))?.value ??
         deriveTint(primary, false)),
    bg:         isDark ? dt['--color-bg-normal']        : findColor(c, /^기본 배경$|^배경$|배경 \(기본\)/,  lt['--color-bg-normal']),
    surface:    isDark ? dt['--color-bg-elevated']      : findColor(c, /카드 배경|카드 표면/,                lt['--color-bg-elevated']),
    surfaceAlt: isDark ? dt['--color-fill-neutral-alt'] : findColor(c, /보조 배경|비활성 배경|입력 배경/,    lt['--color-fill-neutral']),
    textMain:   isDark ? dt['--color-text-normal']      : findColor(c, /본문 텍스트|주요 컨텐츠|^텍스트 \(기본\)$/,  lt['--color-text-normal']),
    textSub:    isDark ? dt['--color-text-alternative'] : findColor(c, /보조 텍스트|라벨|^텍스트 \(보조\)$/,         lt['--color-text-alternative']),
    textMuted:  isDark ? dt['--color-text-assistive']   : findColor(c, /비활성 텍스트|플레이스홀더|힌트/,             lt['--color-text-assistive']),
    border:     isDark ? dt['--color-border-normal']    : findColor(c, /구분선|보더|^선$/,                            lt['--color-border-normal']),
    accent,
    // Semantic colors derived from brand-harmonious hue families (step 600 = fill).
    // Brand token overrides take priority (e.g. Baemin explicitly sets Success Teal).
    // Semantic mapping: green→success, red→danger, amber→warning, blue→info
    success: findColor(c, /성공|증가|긍정/, hAt(harmony.green, 600) ?? lt['--color-fill-success']),
    danger:  findColor(c, /에러|위험|감소|부정/, hAt(harmony.red,   600) ?? lt['--color-fill-danger']),
    warning: hAt(harmony.amber, 600) ?? lt['--color-fill-warning'],
    info:    hAt(harmony.blue,  600) ?? lt['--color-fill-info'],
    disabled:     isDark ? dt['--color-fill-neutral']     : lt['--color-fill-neutral'],
    textDisabled: isDark ? dt['--color-text-disabled']    : lt['--color-text-disabled'],
    starFill:     isDark ? dt['--color-fill-highlight']    : lt['--color-fill-highlight'],
    successWeak:  isDark ? dt['--color-fill-success-weak'] : lt['--color-fill-success-weak'],
    dangerWeak:   isDark ? dt['--color-fill-danger-weak']  : lt['--color-fill-danger-weak'],
    warningWeak:  isDark ? dt['--color-fill-warning-weak'] : lt['--color-fill-warning-weak'],
    infoWeak:     isDark ? dt['--color-fill-info-weak']    : lt['--color-fill-info-weak'],
    successText: '', dangerText: '', warningText: '', infoText: '',
  };

  const wireframePalette = isDark ? WIREFRAME_DARK : WIREFRAME_LIGHT;
  const palette = mode === 'wireframe' ? wireframePalette : brandColors;

  const isLocal = !!token.serviceTypes?.some((s) => /지역|커뮤니티|중고|동네/.test(s));

  const bgColor = palette.bg;

  return {
    ...palette,

    successText: ensureContrast(palette.success, bgColor),
    dangerText:  ensureContrast(palette.danger,  bgColor),
    warningText: ensureContrast(palette.warning, bgColor),
    infoText:    ensureContrast(palette.info,    bgColor),

    textOnImage: lightTokens['--color-text-on-fill'],
    scrim: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 60%)',

    font: mode === 'wireframe'
      ? "'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, sans-serif"
      : p.typography.family,
    weightRegular,
    weightMedium,
    weightBold,
    type: {
      //                 role pattern                             weight          size  lh     ls
      display: resolveType(sizes, /display/i,                    weightBold,     36,   1.25, '-0.04em'),
      h1:      resolveType(sizes, /heading\s*1|h1|제목\s*1/i,   weightBold,     26,   1.35, '-0.025em'),
      h2:      resolveType(sizes, /heading\s*2|h2|제목\s*2/i,   weightBold,     20,   1.40, '-0.015em'),
      body:    resolveType(sizes, /body\s*1|본문\s*1|^body$/i,  weightRegular,  16,   1.65, '-0.01em'),
      bodySm:  resolveType(sizes, /body\s*2|본문\s*2/i,         weightRegular,  14,   1.60, '-0.005em'),
      caption: resolveType(sizes, /caption|캡션/i,              weightRegular,  12,   1.50,  '0em'),
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

    shadow: resolveShadows(isDark),

    density,
    isMobile: platform === 'mobile',
    isDark,
    category: token.category,
    isLocal,
    iconStyle: resolveIconStyleFromToken(token),
    archetype: resolveLayoutArchetype(token),
  };
}

/**
 * Derive the structural layout signature — a brand-level trait, so always read
 * from the web layout.columns (mobile has no columns field) plus category.
 *   "핀터레스트형 2열 Masonry"  → masonry   (Ohouse)
 *   "음식점 4열 그리드"/"product grid" → grid (Baemin·Coupang·Musinsa)
 *   "주 콘텐츠 + 사이드바"       → list      (Naver·Daangn·Kakao)
 *   "매거진 레이아웃 비대칭"     → feed      (29CM)
 *   핀테크 single column         → stack     (Toss·KakaoBank)
 * A bare "12-column grid" is a generic CSS descriptor, not a product grid, so it
 * is ignored in favour of the category default.
 */
function resolveLayoutArchetype(token: BrandToken): LayoutArchetype {
  const c = (token.platforms.web.layout.columns ?? '').toLowerCase();
  const cat = token.category;
  if (/masonry|핀터레스트/.test(c)) return 'masonry';
  if (/매거진|에디토리얼|비대칭|editorial|magazine/.test(c)) return 'feed';
  if (/사이드바|sidebar/.test(c)) return 'list';
  if (/\d+열|상품.*그리드|음식점.*그리드|product\s*grid/.test(c)) return 'grid';
  if (/핀테크|금융|뱅킹/.test(cat)) return 'stack';
  if (/커머스/.test(cat)) return 'grid';
  if (/플랫폼/.test(cat)) return 'list';
  return 'feed';
}

/**
 * Elevation ramp — a single consistent shadow scale (sm→xl). Each level layers an
 * ambient + key shadow whose blur and opacity grow with elevation, so depth reads
 * uniformly across the system instead of ad-hoc per-component shadows.
 *   sm  미묘한 분리 (탭, 칩, 작은 토글)
 *   md  떠 있는 표면 (카드, 토스트, 스낵바)
 *   lg  오버레이 (드롭다운, 팝오버, 메뉴)
 *   xl  모달 (다이얼로그, 바텀시트)
 * Dark surfaces need deeper shadows to register, so opacities scale up when isDark.
 */
function resolveShadows(isDark: boolean): ResolvedTheme['shadow'] {
  const rgb = isDark ? '0,0,0' : '17,17,17';
  const k = isDark ? 1.8 : 1;
  const a = (n: number) => Math.min(0.5, n * k).toFixed(3);
  return {
    sm: `0 1px 2px rgba(${rgb},${a(0.06)})`,
    md: `0 2px 4px rgba(${rgb},${a(0.05)}), 0 4px 12px rgba(${rgb},${a(0.08)})`,
    lg: `0 4px 8px rgba(${rgb},${a(0.06)}), 0 12px 28px rgba(${rgb},${a(0.12)})`,
    xl: `0 8px 16px rgba(${rgb},${a(0.08)}), 0 24px 56px rgba(${rgb},${a(0.16)})`,
  };
}

export function resolveIconStyleFromToken(token: BrandToken): 'lucide' | 'phosphor' | 'tabler' {
  const hint = token.deep?.iconStyle?.toLowerCase() ?? '';
  // 1) Explicit library name wins — the brand named its set on purpose. Checked
  //    before fuzzy hints so e.g. Toss ("Lucide 계열 … 채움(fill) 아이콘은 활성 탭에만")
  //    reads as lucide, not phosphor from the incidental word "fill".
  if (/phosphor/.test(hint)) return 'phosphor';
  if (/tabler/.test(hint))   return 'tabler';
  if (/lucide/.test(hint))   return 'lucide';
  // 2) Character hints — rounded/fill → phosphor, angular/editorial → tabler, line → lucide
  if (/fill|두꺼|굵|bold|라운드|둥글|round|귀여/.test(hint)) return 'phosphor';
  if (/각진|editorial|에디토리얼|미니멀/.test(hint))        return 'tabler';
  if (/라인|선형|stroke/.test(hint))                        return 'lucide';
  // 3) Service-type fallback
  const s = (token.serviceTypes ?? []).join(' ');
  if (/메신저|소셜|채팅|배달|푸드|지역|중고|커뮤니티|동네/.test(s)) return 'phosphor';
  if (token.category === '커머스') return 'tabler';
  return 'lucide';
}
