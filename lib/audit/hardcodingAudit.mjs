import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();

const TARGET_DIRS = ['app', 'components'];
const TARGET_EXT = new Set(['.ts', '.tsx', '.css']);

const RAW_HEX = /#[0-9a-fA-F]{3,8}\b/;
const RAW_COLOR_FN = /\b(?:rgba?|hsla?)\(/i;
const STYLE_CONTEXT = /\b(?:background(?:Color)?|color|border(?:Color)?|fill|stroke|boxShadow|textShadow)\s*[:=]/;

const ALLOWED_LINES = [
  /fill="#(?:4285F4|34A853|FBBC05|EA4335)"/i, // Google OAuth logo mark
  /@supports\s*\(color:\s*oklch/i,
  /oklch\(/i,
  /var\(--color-/,
  /var\(--palette-/,
];

function walk(dir, acc = []) {
  if (!existsSync(dir)) return acc;
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === '.next' || name === '.git') continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, acc);
    else acc.push(p);
  }
  return acc;
}

function ext(path) {
  const i = path.lastIndexOf('.');
  return i >= 0 ? path.slice(i) : '';
}

function isComment(line) {
  const s = line.trim();
  return s.startsWith('//') || s.startsWith('/*') || s.startsWith('*') || s.startsWith('{/*');
}

function isAllowed(line) {
  return ALLOWED_LINES.some((rule) => rule.test(line));
}

function inspectFile(path) {
  const rel = relative(ROOT, path).replaceAll('\\', '/');
  const code = readFileSync(path, 'utf8');
  const violations = [];

  code.split('\n').forEach((line, index) => {
    if (isComment(line) || isAllowed(line)) return;
    if (line.trim().startsWith('--')) return;
    if (!STYLE_CONTEXT.test(line)) return;

    const hasRawHex = RAW_HEX.test(line);
    const hasRawColorFn = RAW_COLOR_FN.test(line);
    if (!hasRawHex && !hasRawColorFn) return;

    violations.push({
      file: rel,
      line: index + 1,
      sample: line.trim(),
      reason: hasRawHex ? 'raw hex color in UI style context' : 'raw rgb/hsl color function in UI style context',
    });
  });

  return violations;
}

const files = TARGET_DIRS
  .flatMap((dir) => walk(join(ROOT, dir)))
  .filter((path) => TARGET_EXT.has(ext(path)));

const violations = files.flatMap(inspectFile);

if (violations.length > 0) {
  console.error('\nHardcoding audit failed. Use Foundation tokens instead of raw colors.\n');
  for (const v of violations) {
    console.error(`${v.file}:${v.line}  ${v.reason}`);
    console.error(`  ${v.sample}`);
  }
  console.error('\nExpected patterns: t.*, lightTokens/darkTokens, or var(--color-*) through the Foundation cascade.\n');
  process.exit(1);
}

console.log('Hardcoding audit passed: no raw UI colors in app/components style contexts.');
