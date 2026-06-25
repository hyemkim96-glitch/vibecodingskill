import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const MIN_NORMAL_TEXT = 4.5;

const M_XYZ_RGB = [
  [3.2404542, -1.5371385, -0.4985314],
  [-0.9692660, 1.8760108, 0.0415560],
  [0.0556434, -0.2040259, 1.0572252],
];

const M_LAB_LMS = [
  [1.0000000000, 0.3963377774, 0.2158037573],
  [1.0000000000, -0.1055613458, -0.0638541728],
  [1.0000000000, -0.0894841775, -1.2914855480],
];

const M_LMS_XYZ = [
  [1.2270138511035211, -0.5577999806518222, 0.2812561489664678],
  [-0.0405801784232806, 1.1122568696168302, -0.0716766786656012],
  [-0.0763812845057069, -0.4214819784180127, 1.5861632204407947],
];

const hueSteps = [
  [50, 0.971, 0.018],
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

const neutral = {
  0: color(1.000, 0.000, 0),
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
  1000: color(0.000, 0.000, 0),
};

const palettes = {
  neutral,
  green: makeHue(145, 1.00),
  red: makeHue(22, 1.02),
  amber: makeHue(62, 0.70),
  blue: makeHue(254, 1.00),
  violet: makeHue(293, 1.00),
};

const requiredDarkTextTokens = [
  '--color-text-normal',
  '--color-text-alternative',
  '--color-text-assistive',
  '--color-text-success',
  '--color-text-danger',
  '--color-text-warning',
  '--color-text-info',
  '--color-text-accent',
];

const optionalDarkTextTokens = [
  '--color-text-disabled',
];

const semanticPath = join(ROOT, 'lib', 'tokens', 'semanticTokens.ts');
const semanticSource = readFileSync(semanticPath, 'utf8');
const darkBlock = semanticSource.match(/export const darkTokens:[\s\S]*?};/)?.[0] ?? '';

if (!darkBlock) {
  fail([{ label: 'darkTokens', ratio: 0, fg: 'missing', bg: 'missing' }]);
}

const darkValues = new Map();
for (const match of darkBlock.matchAll(/'(?<token>--color-[^']+)':\s+(?<family>[a-z]+)\[(?<step>\d+)\]\.hex/g)) {
  const { token, family, step } = match.groups;
  const value = palettes[family]?.[Number(step)];
  if (value) darkValues.set(token, value);
}

const backgrounds = [
  ['normal', resolve('--color-bg-normal')],
  ['elevated', resolve('--color-bg-elevated')],
];

const violations = [];

for (const token of requiredDarkTextTokens) {
  const fg = resolve(token);
  for (const [surface, bg] of backgrounds) {
    const ratio = contrastRatio(fg, bg);
    if (ratio < MIN_NORMAL_TEXT) {
      violations.push({ label: `${token} on dark ${surface}`, ratio, fg, bg });
    }
  }
}

for (const token of optionalDarkTextTokens) {
  const fg = resolve(token);
  for (const [surface, bg] of backgrounds) {
    const ratio = contrastRatio(fg, bg);
    if (ratio < 3) {
      violations.push({ label: `${token} on dark ${surface}`, ratio, fg, bg });
    }
  }
}

if (violations.length > 0) fail(violations);

console.log('Contrast audit passed: dark Foundation text tokens meet WCAG contrast thresholds.');

function resolve(token) {
  const value = darkValues.get(token);
  if (!value) throw new Error(`Missing dark token value for ${token}`);
  return value;
}

function fail(violations) {
  console.error('\nContrast audit failed. Dark text tokens must meet WCAG contrast.\n');
  for (const v of violations) {
    console.error(`${v.label}: ${v.ratio.toFixed(2)} (${v.fg} on ${v.bg})`);
  }
  console.error(`\nRequired body/description/status text: ${MIN_NORMAL_TEXT}:1 or higher.`);
  process.exit(1);
}

function makeHue(h, chromaScale) {
  return Object.fromEntries(
    hueSteps.map(([step, l, c]) => [step, color(l, c * chromaScale, h)]),
  );
}

function color(l, c, h) {
  return oklchToHex(l, c, h);
}

function linearize(v) {
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
}

function delinearize(v) {
  return v <= 0.0031308 ? 12.92 * v : 1.055 * (v ** (1 / 2.4)) - 0.055;
}

function linearRGBToHex(r, g, b) {
  const clamp = (v) => Math.max(0, Math.min(1, v));
  return `#${[r, g, b]
    .map((v) => Math.round(delinearize(clamp(v)) * 255).toString(16).padStart(2, '0'))
    .join('')}`;
}

function hexToLinearRGB(hex) {
  const h = hex.replace('#', '');
  return [
    linearize(parseInt(h.slice(0, 2), 16) / 255),
    linearize(parseInt(h.slice(2, 4), 16) / 255),
    linearize(parseInt(h.slice(4, 6), 16) / 255),
  ];
}

function oklchToHex(l, c, h) {
  const hRad = (h * Math.PI) / 180;
  const lab = [l, c * Math.cos(hRad), c * Math.sin(hRad)];
  const lmsCbrt = mul(M_LAB_LMS, lab);
  const lms = [lmsCbrt[0] ** 3, lmsCbrt[1] ** 3, lmsCbrt[2] ** 3];
  const xyz = mul(M_LMS_XYZ, lms);
  const [r, g, b] = mul(M_XYZ_RGB, xyz);
  return linearRGBToHex(r, g, b);
}

function relativeLuminance(hex) {
  const [r, g, b] = hexToLinearRGB(hex);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(a, b) {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

function mul(m, v) {
  return [
    m[0][0] * v[0] + m[0][1] * v[1] + m[0][2] * v[2],
    m[1][0] * v[0] + m[1][1] * v[1] + m[1][2] * v[2],
    m[2][0] * v[0] + m[2][1] * v[1] + m[2][2] * v[2],
  ];
}
