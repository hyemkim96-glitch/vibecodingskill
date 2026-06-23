/**
 * OKLCH Color Space Utilities
 *
 * Full bidirectional conversion: sRGB hex ↔ OKLCH
 *
 *   hex → linear-sRGB → XYZ-D65 → OKLab → OKLCH
 *
 * Based on Björn Ottosson's OKLab specification (2020).
 * Reference: https://bottosson.github.io/posts/oklab/
 *
 * Public API:
 *   hexToOklch(hex)         → { l, c, h }
 *   oklchToHex(l, c, h)     → hex string
 *   deriveTintOklch(hex, isDark) → pale tint hex, hue-preserving
 *   ensureContrastOklch(fg, bg, minRatio) → WCAG-safe fg, OKLCH L binary search
 */

/** IEC 61966-2-1 gamma expansion: sRGB [0,1] → linear light */
function linearize(v: number): number {
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

/** IEC 61966-2-1 gamma compression: linear light → sRGB [0,1] */
function delinearize(v: number): number {
  return v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
}

function hexToLinearRGB(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  if (h.length < 6) return [0, 0, 0];
  return [
    linearize(parseInt(h.slice(0, 2), 16) / 255),
    linearize(parseInt(h.slice(2, 4), 16) / 255),
    linearize(parseInt(h.slice(4, 6), 16) / 255),
  ];
}

function linearRGBToHex(r: number, g: number, b: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(1, v));
  return (
    '#' +
    [r, g, b]
      .map((v) =>
        Math.round(delinearize(clamp(v)) * 255)
          .toString(16)
          .padStart(2, '0'),
      )
      .join('')
  );
}

// ── Matrix helpers ────────────────────────────────────────────────────────────

type Vec3 = [number, number, number];
type Mat3 = [Vec3, Vec3, Vec3];

function mul(m: Mat3, v: Vec3): Vec3 {
  return [
    m[0][0] * v[0] + m[0][1] * v[1] + m[0][2] * v[2],
    m[1][0] * v[0] + m[1][1] * v[1] + m[1][2] * v[2],
    m[2][0] * v[0] + m[2][1] * v[1] + m[2][2] * v[2],
  ];
}

// ── Conversion matrices (D65 illuminant) ─────────────────────────────────────

// Linear sRGB → XYZ (IEC 61966-2-1)
const M_RGB_XYZ: Mat3 = [
  [0.4124564, 0.3575761, 0.1804375],
  [0.2126729, 0.7151522, 0.0721750],
  [0.0193339, 0.1191920, 0.9503041],
];

// XYZ → linear sRGB
const M_XYZ_RGB: Mat3 = [
  [ 3.2404542, -1.5371385, -0.4985314],
  [-0.9692660,  1.8760108,  0.0415560],
  [ 0.0556434, -0.2040259,  1.0572252],
];

// XYZ → LMS cone space (Ottosson M1)
const M_XYZ_LMS: Mat3 = [
  [ 0.8189330101,  0.3618667424, -0.1288597137],
  [ 0.0329845436,  0.9293118715,  0.0361456387],
  [ 0.0482003018,  0.2643662691,  0.6338517070],
];

// LMS' → OKLab (Ottosson M2)
const M_LMS_LAB: Mat3 = [
  [0.2104542553,  0.7936177850, -0.0040720468],
  [1.9779984951, -2.4285922050,  0.4505937099],
  [0.0259040371,  0.7827717662, -0.8086757660],
];

// OKLab → LMS' (M2 inverse)
const M_LAB_LMS: Mat3 = [
  [1.0000000000,  0.3963377774,  0.2158037573],
  [1.0000000000, -0.1055613458, -0.0638541728],
  [1.0000000000, -0.0894841775, -1.2914855480],
];

// LMS → XYZ (M1 inverse)
const M_LMS_XYZ: Mat3 = [
  [ 1.2270138511035211, -0.5577999806518222,  0.2812561489664678],
  [-0.0405801784232806,  1.1122568696168302, -0.0716766786656012],
  [-0.0763812845057069, -0.4214819784180127,  1.5861632204407947],
];

// ── Public API ────────────────────────────────────────────────────────────────

export interface Oklch {
  l: number; // perceptual lightness [0, 1]
  c: number; // chroma  [0, ~0.4]
  h: number; // hue angle [0, 360)
}

/** Hex string → OKLCH */
export function hexToOklch(hex: string): Oklch {
  const rgb = hexToLinearRGB(hex);
  const xyz = mul(M_RGB_XYZ, rgb);
  const lms = mul(M_XYZ_LMS, xyz);
  const lmsCbrt: Vec3 = [Math.cbrt(lms[0]), Math.cbrt(lms[1]), Math.cbrt(lms[2])];
  const [L, a, b] = mul(M_LMS_LAB, lmsCbrt);
  const c = Math.sqrt(a * a + b * b);
  const h = ((Math.atan2(b, a) * 180) / Math.PI + 360) % 360;
  return { l: L, c, h };
}

/** OKLCH → hex string */
export function oklchToHex(l: number, c: number, h: number): string {
  const hRad = (h * Math.PI) / 180;
  const lab: Vec3 = [l, c * Math.cos(hRad), c * Math.sin(hRad)];
  const lmsCbrt = mul(M_LAB_LMS, lab);
  const lms: Vec3 = [lmsCbrt[0] ** 3, lmsCbrt[1] ** 3, lmsCbrt[2] ** 3];
  const xyz = mul(M_LMS_XYZ, lms);
  const [r, g, b] = mul(M_XYZ_RGB, xyz);
  return linearRGBToHex(r, g, b);
}

/**
 * Derive an opaque tint of `primary` suitable as a soft-badge or chip background.
 * Hue is preserved exactly. Chroma is reduced to keep the result subtle.
 * Lightness is pushed toward the appropriate extreme (light or dark surface).
 */
export function deriveTintOklch(primary: string, isDark: boolean): string {
  const { l, c, h } = hexToOklch(primary);
  if (isDark) {
    // Dark surface: shade slightly — lower L, moderate chroma
    const targetL = Math.max(0.1, l * 0.55);
    const targetC = Math.min(c * 0.5, 0.12);
    return oklchToHex(targetL, targetC, h);
  }
  // Light surface: pale tint — high L, low chroma
  // More luminous primaries (pale yellows) need less whitening than dark ones
  const targetL = 0.92 + (1 - l) * 0.06;
  const targetC = Math.min(c * 0.30, 0.055);
  return oklchToHex(targetL, targetC, h);
}

/**
 * Adjust `fg` lightness in OKLCH until contrast ratio against `bg` meets `minRatio`.
 * Hue and (scaled) chroma are preserved — only L changes.
 * Falls back to a neutral palette extreme if no solution is found.
 */
export function ensureContrastOklch(fg: string, bg: string, minRatio = 4.5): string {
  if (contrastRatio(fg, bg) >= minRatio) return fg;

  const { l: lOrig, c, h } = hexToOklch(fg);
  const bgLum = relativeLuminance(bg);
  const lighten = bgLum < 0.18; // dark bg → push fg lighter; light bg → push fg darker

  let lo = lighten ? lOrig : 0;
  let hi = lighten ? 1 : lOrig;
  let result = fg;

  for (let i = 0; i < 28; i++) {
    const mid = (lo + hi) / 2;
    // Gamut: chroma must shrink as L approaches 0 or 1 to stay inside sRGB
    const distFromMid = Math.abs(mid - 0.5) * 2; // 0 at mid-grey, 1 at extremes
    const chromaScale = Math.max(0, 1 - distFromMid * 1.2);
    const candidate = oklchToHex(mid, c * chromaScale, h);
    if (contrastRatio(candidate, bg) >= minRatio) {
      result = candidate;
      if (lighten) hi = mid; else lo = mid;
    } else {
      if (lighten) lo = mid; else hi = mid;
    }
  }
  return result;
}

// ── WCAG helpers ─────────────────────────────────────────────────────────────

/** WCAG 2.1 relative luminance (sRGB linearised) */
export function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToLinearRGB(hex);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG contrast ratio between two hex colours (always ≥ 1) */
export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}
