/**
 * Standard-UI Audit Engine
 * ────────────────────────
 * 만들어진 UI가 디자인 시스템 규칙대로 제작되었는지 검사하는 엔진.
 *
 * 두 개의 독립 검사기로 구성된다:
 *
 *   1) 서비스 자체 디자인 시스템 검사기 (serviceInspector)
 *      - 사이트 본체(app/**, Navigation, globals.css)가 서비스 토큰
 *        (--color-*, Pretendard, 표준 컴포넌트)으로 만들어졌는지 검사.
 *
 *   2) 와이어프레임 컴포넌트 디자인 시스템 검사기 (wireframeInspector)
 *      - DS 원자(ds.tsx) / 패턴(patterns.tsx) / 갤러리(ComponentSheet.tsx) /
 *        브랜드 프리뷰(BrandUIPreview.tsx)가 ResolvedTheme 토큰만 사용하고,
 *        이모지 대신 <Icon>을 쓰며, 하드코딩 색을 쓰지 않는지 검사.
 *
 * 순수 함수형: 파일 목록을 받아 위반(Violation) 목록을 돌려준다.
 * Node ESM으로 직접 실행 가능 (`node lib/audit/uiAudit.mjs`).
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = process.cwd();

/* ── 공통 패턴 ── */

// UI에 직접 쓰이면 안 되는 글리프(이모지/기호 아이콘 대용). 한글·라틴은 제외.
const GLYPH = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{25A0}-\u{25FF}\u{2B50}\u{FE0F}]|[✓✗✕⚠▾▴◀▸▶◆●■★→←↑↓‹›»«]/u;
// 비밀번호 마스킹·말줄임 등 허용 글리프
const ALLOWED_GLYPH = /[•…·]/u;
// 하드코딩 hex 색상
const HEX = /#[0-9a-fA-F]{3,8}\b/;
// 컴포넌트 레이어에서 허용하는 순수 흑백(노브·오버레이 등)
const ALLOWED_HEX = /#(fff|ffffff|000|000000)\b/i;

function isCommentLine(line) {
  const s = line.trim();
  return (
    s.startsWith('//') ||
    s.startsWith('*') ||
    s.startsWith('/*') ||
    s.startsWith('{/*') ||   // JSX 주석
    s.startsWith('*/')
  );
}

/* ── 파일 수집 ── */

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

function readFiles(paths) {
  return paths
    .filter((p) => existsSync(p))
    .map((p) => ({ path: relative(ROOT, p), code: readFileSync(p, 'utf8') }));
}

/* ── 검사기 1: 서비스 자체 디자인 시스템 ── */

const WIREFRAME_FILES = new Set([
  'components/ds.tsx',
  'components/patterns.tsx',
  'components/ComponentSheet.tsx',
  'components/BrandUIPreview.tsx',
]);

export function collectServiceFiles() {
  const appTsx = walk(join(ROOT, 'app')).filter((p) => /\.(tsx)$/.test(p));
  const chrome = [
    'components/Navigation.tsx',
    'components/Profile.tsx',
    'components/WikiClient.tsx',
    'components/WikiHighlight.tsx',
    'components/WikiProvider.tsx',
  ].map((p) => join(ROOT, p));
  const css = [join(ROOT, 'app/globals.css')];
  return readFiles([...appTsx, ...chrome, ...css]);
}

export function serviceInspector(files) {
  const v = [];
  const add = (rule, severity, file, line, message) =>
    v.push({ inspector: 'service', rule, severity, file, line, message });

  // S-FONT: globals.css는 Pretendard를 쓰고 SUIT를 쓰면 안 됨
  const css = files.find((f) => f.path.endsWith('globals.css'));
  if (css) {
    if (!/Pretendard/.test(css.code))
      add('S-FONT', 'error', css.path, 0, '서비스 본문 폰트가 Pretendard로 설정되어 있지 않음');
    if (/'Suit'|SUIT-/.test(css.code))
      add('S-FONT', 'error', css.path, 0, '제거되어야 할 SUIT 폰트 참조가 남아 있음');
  } else {
    add('S-FONT', 'error', 'app/globals.css', 0, 'globals.css를 찾을 수 없음');
  }

  // 외부 브랜드 로고(SVG)의 정당한 브랜드 색 — 토큰화 대상 아님
  const BRAND_HEX = /#(4285F4|34A853|FBBC05|EA4335|1877F2|03C75A|FEE500)\b/i;

  for (const f of files) {
    if (f.path.endsWith('.css')) continue;
    f.code.split('\n').forEach((line, i) => {
      if (isCommentLine(line)) return;
      // S-NO-EMOJI: 서비스 chrome에 이모지/기호 아이콘 직접 사용 금지
      const g = line.match(GLYPH);
      if (g && !ALLOWED_GLYPH.test(g[0]))
        add('S-NO-EMOJI', 'error', f.path, i + 1, `이모지/기호 직접 사용: ${g[0]} → Icon 사용`);
      // S-COLOR-TOKEN: 실제 스타일 컨텍스트의 raw hex만 경고.
      // 데이터/색 계산 폴백(return)·외부 브랜드 로고 색은 예외.
      const styleColorCtx = /(background|color|borderColor|\bfill)\s*[:=]/.test(line);
      if (styleColorCtx && !/\breturn\b/.test(line)) {
        const h = line.match(HEX);
        if (h && !BRAND_HEX.test(line))
          add('S-COLOR-TOKEN', 'warn', f.path, i + 1, `하드코딩 색상 ${h[0]} → var(--color-*) 토큰 권장`);
      }
    });
  }
  return summarize('서비스 자체 디자인 시스템', v);
}

/* ── 검사기 2: 와이어프레임 컴포넌트 디자인 시스템 ── */

export function collectWireframeFiles() {
  return readFiles([...WIREFRAME_FILES].map((p) => join(ROOT, p)));
}

export function wireframeInspector(files) {
  const v = [];
  const add = (rule, severity, file, line, message) =>
    v.push({ inspector: 'wireframe', rule, severity, file, line, message });

  for (const f of files) {
    const usesIcon = /<Icon\b/.test(f.code) || /from '@\/components\/icons'/.test(f.code);
    f.code.split('\n').forEach((line, i) => {
      if (isCommentLine(line)) return;

      // W-NO-EMOJI: 컴포넌트/패턴 레이어에 이모지·기호 아이콘 금지 (Icon 사용)
      const g = line.match(GLYPH);
      if (g && !ALLOWED_GLYPH.test(g[0]))
        add('W-NO-EMOJI', 'error', f.path, i + 1, `이모지/기호 사용: ${g[0]} → <Icon> 사용`);

      // W-THEME-COLOR: 컴포넌트 레이어는 ResolvedTheme 토큰(t.*)만 사용.
      // 색상이 스타일 컨텍스트(background/color/fg/borderColor)에 쓰인 raw 값만 검사.
      // 그림자(boxShadow)의 rgba와 색 계산 헬퍼(return)는 표준 예외로 허용.
      const styleColorCtx = /(background|(?<!border-)color|borderColor|\bfg)\s*[:=]/.test(line);
      const isShadow = /boxShadow|shadow/i.test(line);
      const isReturn = /\breturn\b/.test(line);
      if (styleColorCtx && !isShadow && !isReturn) {
        const h = line.match(HEX);
        if (h && !ALLOWED_HEX.test(h[0]))
          add('W-THEME-COLOR', 'warn', f.path, i + 1, `하드코딩 색상 ${h[0]} → 테마 토큰(t.*) 사용`);
        if (/rgba?\(/.test(line))
          add('W-THEME-COLOR', 'warn', f.path, i + 1, '하드코딩 rgba() 색상 → 테마 토큰(t.*) 사용');
      }
    });

    // W-ICON-LIB: 아이콘을 쓰는 파일은 icons 추상화 레이어를 임포트해야 함
    if (/name="(home|search|cart|user|bell|chat)"/.test(f.code) && !usesIcon)
      add('W-ICON-LIB', 'error', f.path, 0, 'Icon 컴포넌트(@/components/icons) 미사용');
  }
  return summarize('와이어프레임 컴포넌트 디자인 시스템', v);
}

/* ── 집계/리포트 ── */

function summarize(name, violations) {
  const errors = violations.filter((x) => x.severity === 'error');
  const warns = violations.filter((x) => x.severity === 'warn');
  return { name, violations, errors: errors.length, warnings: warns.length, pass: errors.length === 0 };
}

export function runAudit() {
  return {
    service: serviceInspector(collectServiceFiles()),
    wireframe: wireframeInspector(collectWireframeFiles()),
  };
}

function printResult(r) {
  const status = r.pass ? '✅ PASS' : '❌ FAIL';
  console.log(`\n━━━ ${r.name} 검사기 ── ${status}  (errors: ${r.errors}, warnings: ${r.warnings})`);
  if (r.violations.length === 0) {
    console.log('  위반 없음 — 디자인 시스템 규칙을 모두 준수합니다.');
    return;
  }
  for (const x of r.violations) {
    const tag = x.severity === 'error' ? 'ERR ' : 'WARN';
    const loc = x.line ? `${x.file}:${x.line}` : x.file;
    console.log(`  [${tag}] ${x.rule}  ${loc}\n         ${x.message}`);
  }
}

// 직접 실행 시 두 검사기를 모두 돌려 리포트 출력
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { service, wireframe } = runAudit();
  console.log('╔══════════════════════════════════════════════════════╗');
  console.log('║   표준 UI 검사 엔진 (Standard-UI Audit Engine)        ║');
  console.log('╚══════════════════════════════════════════════════════╝');
  printResult(service);
  printResult(wireframe);
  const ok = service.pass && wireframe.pass;
  console.log(`\n총평: ${ok ? '✅ 모든 검사기 통과' : '❌ 위반 존재 — 위 항목을 수정하세요'}\n`);
  process.exit(ok ? 0 : 1);
}
