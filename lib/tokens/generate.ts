import { BrandToken, PlatformToken } from '@/types/token';
import { lightTokens, darkTokens } from './semanticTokens';
import { suggestColorScheme } from './colorAutomation';
import { resolveIconStyleFromToken, resolveTheme } from './resolveTheme';

/* ═══════════════════════════════════════════════════════════════
 * 4-Tier CSS var reference maps
 * These mirror globals.css role/variant declarations exactly.
 * Role tokens reference semantic vars → dark mode cascades
 * automatically via [data-theme="dark"] overrides on :root.
 * ═══════════════════════════════════════════════════════════════ */

const ROLE_TOKEN_VARS: Record<string, string> = {
  // Button
  '--comp-button-primary-bg':        'var(--color-fill-normal)',
  '--comp-button-primary-fg':        'var(--color-text-on-fill)',
  '--comp-button-secondary-bg':      'var(--color-fill-neutral)',
  '--comp-button-secondary-fg':      'var(--color-text-normal)',
  '--comp-button-secondary-bd':      'var(--color-border-normal)',
  '--comp-button-outline-bd':        'var(--color-border-brand)',
  '--comp-button-outline-fg':        'var(--color-text-brand)',
  '--comp-button-ghost-fg':          'var(--color-text-normal)',
  '--comp-button-disabled-bg':       'var(--color-fill-neutral)',
  '--comp-button-disabled-fg':       'var(--color-text-disabled)',
  // Badge
  '--comp-badge-solid-bg':           'var(--color-fill-normal)',
  '--comp-badge-solid-fg':           'var(--color-text-on-fill)',
  '--comp-badge-soft-bg':            'var(--color-fill-brand-weak)',
  '--comp-badge-soft-fg':            'var(--color-text-brand)',
  '--comp-badge-accent-bg':          'var(--color-fill-accent-weak)',
  '--comp-badge-accent-fg':          'var(--color-text-accent)',
  '--comp-badge-muted-bg':           'var(--color-bg-elevated)',
  '--comp-badge-muted-fg':           'var(--color-text-alternative)',
  '--comp-badge-muted-bd':           'var(--color-border-normal)',
  // Chip
  '--comp-chip-bg':                  'var(--color-bg-elevated)',
  '--comp-chip-fg':                  'var(--color-text-alternative)',
  '--comp-chip-bd':                  'var(--color-border-normal)',
  '--comp-chip-active-bg':           'var(--color-fill-normal)',
  '--comp-chip-active-fg':           'var(--color-text-on-fill)',
  // Input
  '--comp-input-bg':                 'var(--color-bg-normal)',
  '--comp-input-bd':                 'var(--color-border-normal)',
  '--comp-input-fg':                 'var(--color-text-normal)',
  '--comp-input-placeholder':        'var(--color-text-assistive)',
  '--comp-input-label':              'var(--color-text-normal)',
  // Card
  '--comp-card-bg':                  'var(--color-bg-elevated)',
  '--comp-card-bd':                  'var(--color-border-normal)',
  // NavTab
  '--comp-navtab-fg':                'var(--color-text-assistive)',
  '--comp-navtab-fg-active':         'var(--color-text-normal)',
  '--comp-navtab-indicator':         'var(--color-fill-normal)',
};

const VARIANT_TOKEN_VARS: Record<string, string> = {
  '--comp-button-primary-bg-hover':    'var(--color-fill-strong)',
  '--comp-button-primary-bg-pressed':  'var(--color-fill-alternative)',
  '--comp-button-secondary-bg-hover':  'var(--color-fill-neutral-alt)',
  '--comp-button-outline-bd-hover':    'var(--color-border-strong)',
  '--comp-button-ghost-fg-hover':      'var(--color-text-normal)',
  '--comp-button-ghost-bg-hover':      'var(--color-fill-neutral)',
  '--comp-chip-bg-hover':              'var(--color-fill-neutral)',
  '--comp-chip-bd-hover':              'var(--color-border-strong)',
  '--comp-card-bg-hover':              'var(--color-fill-neutral)',
  '--comp-input-bd-focus':             'var(--color-border-focus)',
  '--comp-input-shadow-focus':         'var(--color-fill-brand-weak)',
  '--comp-input-bd-error':             'var(--color-border-danger)',
  '--comp-input-fg-error':             'var(--color-text-danger)',
  '--comp-input-bg-disabled':          'var(--color-fill-neutral)',
  '--comp-input-bd-disabled':          'var(--color-border-weak)',
  '--comp-input-fg-disabled':          'var(--color-text-disabled)',
  '--comp-input-placeholder-disabled': 'var(--color-text-disabled)',
  '--comp-navtab-fg-hover':            'var(--color-text-alternative)',
};

/* ─────────────── helpers ─────────────── */

function getBrandPrimary(token: BrandToken): string {
  // Same resolution the renderer uses, so brand colours (often Korean roles like
  // "주요 액션"/"CTA") are detected instead of falling back to a neutral.
  return resolveTheme(token, 'mobile', 'brand').primary;
}

function getMergedSemanticLight(token: BrandToken): Record<string, string> {
  // Drive the exported semantic colours from resolveTheme — the exact values the
  // on-screen preview renders — so copying the CSS reproduces the UI 1:1.
  const rt = resolveTheme(token, 'mobile', 'brand');
  const brandOverrides = suggestColorScheme(rt.primary);
  const merged: Record<string, string> = { ...lightTokens };
  for (const [k, v] of Object.entries(brandOverrides)) {
    if (v) merged[k] = v;
  }
  // The renderer paints every primary-action surface (primary button, solid
  // badge, active chip, tab indicator → all bound to --color-fill-normal) with
  // the brand primary, so the exported fill-normal must be the brand colour too.
  merged['--color-fill-normal']      = rt.primary;
  merged['--color-fill-strong']      = rt.primary;
  merged['--color-fill-brand']       = rt.primary;
  merged['--color-fill-brand-weak']  = rt.primaryTint;
  merged['--color-text-on-fill']     = rt.onPrimary;
  // Semantic families are harmonised to the brand hue at render time — export the
  // same harmonised values, not the raw Foundation palette.
  merged['--color-fill-success']      = rt.success;
  merged['--color-fill-danger']       = rt.danger;
  merged['--color-fill-warning']      = rt.warning;
  merged['--color-fill-info']         = rt.info;
  merged['--color-fill-success-weak'] = rt.successWeak;
  merged['--color-fill-danger-weak']  = rt.dangerWeak;
  merged['--color-fill-warning-weak'] = rt.warningWeak;
  merged['--color-fill-info-weak']    = rt.infoWeak;
  merged['--color-text-success']      = rt.successText;
  merged['--color-text-danger']       = rt.dangerText;
  merged['--color-text-warning']      = rt.warningText;
  merged['--color-text-info']         = rt.infoText;
  return merged;
}

/** Semantic spacing scale (xxs…xl) with the density-derived values the renderer
 *  actually uses — exported alongside the raw scale so copied tokens reproduce
 *  the on-screen gaps/padding. */
function semanticSpaceScale(token: BrandToken, platform: 'mobile' | 'web'): Array<[string, number]> {
  const sp = resolveTheme(token, platform, 'brand').space;
  return (['xxs', 'xs', 'sm', 'md', 'lg', 'xl'] as const).map((k) => [k, sp[k]] as [string, number]);
}

function typeSizes(p: PlatformToken): string {
  return [
    '| Role | Size | Line Height | Letter Spacing |',
    '|------|------|-------------|----------------|',
    ...p.typography.sizes.map(s => `| ${s.role} | ${s.size} | ${s.lineHeight} | ${s.letterSpacing} |`),
  ].join('\n');
}

function spacingTable(p: PlatformToken): string {
  return [
    '| Name | Value | Token |',
    '|------|-------|-------|',
    ...p.spacing.scale.map(s => `| ${s.name} | ${s.value} | \`${s.token}\` |`),
  ].join('\n');
}

function shapesTable(p: PlatformToken): string {
  return [
    '| Element | Value |',
    '|---------|-------|',
    ...p.shapes.map(s => `| ${s.element} | ${s.value} |`),
  ].join('\n');
}

function deriveShadow(token: BrandToken): string {
  const primary = getBrandPrimary(token);
  const hex = primary.replace('#', '');
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return `rgba(${r},${g},${b},0.20) 0px 4px 16px 0px, rgba(${r},${g},${b},0.08) 0px 1px 4px 0px`;
}

function deriveComponentSpecs(token: BrandToken, p: PlatformToken): string {
  const btn = p.shapes.find(s => s.element === 'button')?.value ?? '8px';
  const card = p.shapes.find(s => s.element === 'card')?.value ?? '12px';
  const input = p.shapes.find(s => s.element === 'input')?.value ?? '6px';
  const bodySize = p.typography.sizes.find(s => s.role === 'Body 1')?.size ?? '16px';
  const boldWeight = p.typography.weights.slice(-1)[0] ?? 700;
  const bodyWeight = p.typography.weights[1] ?? 500;
  const badge = p.shapes.find(s => s.element === 'badge')?.value ?? '4px';
  const captionSize = p.typography.sizes.find(s => s.role === 'caption')?.size ?? '12px';

  return `### Primary Button
\`\`\`
height: 48–52px
border-radius: ${btn}
background: var(--comp-button-primary-bg)        /* → --color-fill-normal */
color: var(--comp-button-primary-fg)              /* → --color-text-on-fill */
font: ${boldWeight} ${bodySize}/${p.typography.sizes.find(s => s.role === 'Body 1')?.lineHeight ?? 1} ${p.typography.family}
padding: 0 24px
width: 100% (mobile full-width CTA)
:hover  → background: var(--comp-button-primary-bg-hover)   /* scale(1) + fill-strong */
:active → background: var(--comp-button-primary-bg-pressed) /* scale(0.97) + fill-alternative */
\`\`\`

### Secondary Button
\`\`\`
height: 48–52px
border-radius: ${btn}
background: var(--comp-button-secondary-bg)   /* → --color-fill-neutral */
color: var(--comp-button-secondary-fg)        /* → --color-text-normal */
border: 1px solid var(--comp-button-secondary-bd) /* → --color-border-normal */
font: ${bodyWeight} ${bodySize} ${p.typography.family}
:hover → background: var(--comp-button-secondary-bg-hover)
\`\`\`

### Card
\`\`\`
border-radius: ${card}
background: var(--comp-card-bg)   /* → --color-bg-elevated */
border: 1px solid var(--comp-card-bd) /* → --color-border-normal */
padding: ${p.spacing.scale[3]?.value ?? '16px'}
:hover → background: var(--comp-card-bg-hover) + translateY(-2px)
transition: 200ms ease
\`\`\`

### Input Field
\`\`\`
height: 48px (mobile) / 44px (web)
border-radius: ${input}
background: var(--comp-input-bg)  /* → --color-bg-normal */
border: 1px solid var(--comp-input-bd)    /* → --color-border-normal */
color: var(--comp-input-fg)               /* → --color-text-normal */
::placeholder → var(--comp-input-placeholder) /* → --color-text-assistive */
:focus  → border: 1px solid var(--comp-input-bd-focus), box-shadow 0 0 0 3px var(--comp-input-shadow-focus)
:error  → border: 1px solid var(--comp-input-bd-error), color var(--comp-input-fg-error)
:disabled → opacity 0.5, background: var(--comp-input-bg-disabled)
\`\`\`

### Badge
\`\`\`
border-radius: ${badge}
font: ${boldWeight} ${captionSize} ${p.typography.family}
padding: 2px 7px

# Solid
background: var(--comp-badge-solid-bg)   /* → --color-fill-normal */
color: var(--comp-badge-solid-fg)        /* → --color-text-on-fill */

# Soft (brand tint)
background: var(--comp-badge-soft-bg)   /* → --color-fill-brand-weak */
color: var(--comp-badge-soft-fg)        /* → --color-text-brand */

# Muted
background: var(--comp-badge-muted-bg)  /* → --color-bg-elevated */
color: var(--comp-badge-muted-fg)       /* → --color-text-alternative */
border: 1px solid var(--comp-badge-muted-bd)
\`\`\``;
}

function verifiedPrinciples(token: BrandToken, p: PlatformToken): string {
  // Single source of truth: same resolver the renderer uses, so the exported
  // recommendation always matches the icons shown in the brand preview.
  const iconChoice = resolveIconStyleFromToken(token);
  const ICON_META = {
    phosphor: { lib: 'Phosphor', why: '따뜻하고 둥근 표정 — 메신저·배달·지역 서비스의 친근함에 적합' },
    tabler:   { lib: 'Tabler',   why: '에디토리얼하고 또렷한 선 — 커머스의 상품 중심 위계에 적합' },
    lucide:   { lib: 'Lucide',   why: '깔끔하고 전문적인 스트로크 — 금융·검색·도구 서비스에 적합' },
  } as const;
  const { lib: iconLib, why: iconWhy } = ICON_META[iconChoice];

  return `## 디자인 시스템 원칙 (검증된 시행착오)

> 이 서비스를 구축하며 반복해서 부딪힌 문제와 해결책.

### 1. 토큰 4계층 엄수 — 절대 건너뛰지 않는다
\`Palette → Semantic → Role → Variant\` 순서만 허용.
컴포넌트는 반드시 **Role 토큰(\`--comp-*\`)** 을 참조하고, Role은 **Semantic 토큰(\`--color-*\`)** 을 참조한다.
Palette 원시값(hex, \`neutral[900].hex\`)을 컴포넌트에서 직접 참조하면 다크모드/테마 전환이 깨진다.

### 2. 색상은 절대 하드코딩 금지
\`\`\`
❌  background: #18181b;
❌  background: neutral[900].hex;
✅  background: var(--comp-button-primary-bg);
\`\`\`

### 3. 아이콘은 라이브러리, 이모지 금지
- **추천: ${iconLib}** — ${iconWhy}
- 크기 기준 24×24px, 터치 영역 ${p.layout.touchTarget ?? '48px'} 확보.

### 4. 폰트 — 한글 메트릭 안정화
본문은 \`${p.typography.family}\`, **폴백은 Pretendard**로 고정.
배지·칩 안 한글은 \`line-height: 1\` + 위 패딩을 아래보다 크게 설정해 광학 중앙 정렬.

### 5. 상태는 유채색으로
성공·경고·오류는 \`--color-fill-success / warning / danger\`로 명확히 구분.
무채 브랜드여도 상태색은 유채를 사용한다.

### 6. 여백은 토큰만
\`gap / padding / margin\`은 항상 \`--spacing-xxs\`~\`--spacing-xl\` 스케일 토큰만 사용. 임의 픽셀 금지.

### 7. 같은 역할 = 같은 컴포넌트
동일 역할 UI(필터 탭, 입력창 등)는 페이지마다 재구현하지 않고 단일 공유 컴포넌트를 쓴다.

### 8. 대비·접근성
- 본문 대비 ≥ 4.5:1 (WCAG AA)
- 배지/칩: 불투명 틴트 + 풀컬러 텍스트 (alpha 배경 + 옅은 텍스트 금지)
- 포커스 링 2px solid \`var(--color-border-focus)\``;
}

/* ─────────────── main Design.md generator ─────────────── */

function platformDesignMd(token: BrandToken, platform: 'mobile' | 'web'): string {
  const p: PlatformToken = token.platforms[platform];
  const label = platform === 'mobile' ? 'Mobile (390px)' : 'Web (1440px)';
  const d = token.deep;
  const mergedLight = getMergedSemanticLight(token);

  const deepInteraction = d ? `
---

## Interaction & Motion

- **Duration:** ${d.interaction.duration}
- **Easing:** ${d.interaction.easing}
${d.interaction.hoverScale ? `- **Hover Scale:** ${d.interaction.hoverScale}` : ''}
${d.interaction.pressScale ? `- **Press Scale:** ${d.interaction.pressScale}` : ''}
- **Notes:** ${d.interaction.notes}
` : '';

  const deepVoice = d ? `
---

## Voice & Tone

**Tone:** ${d.voice.tone}

### 텍스트 예시
${d.voice.examples.map(e => `- ${e}`).join('\n')}

### 피해야 할 표현
${d.voice.avoid.map(a => `- ${a}`).join('\n')}
` : '';

  const componentSection = d?.components && d.components.length > 0
    ? `---

## Component Specs

${d.components.map(c => `### ${c.name}
${c.anatomy ? `**구조:** ${c.anatomy}\n` : ''}${c.states ? `**States:** ${c.states}\n` : ''}
\`\`\`
${c.spec}
\`\`\``).join('\n\n')}`
    : `---

## Component Specs

${deriveComponentSpecs(token, p)}`;

  const deepBreakpoints = d?.breakpoints ? `
---

## Breakpoints

| Name | Value | Behavior |
|------|-------|----------|
${d.breakpoints.map(b => `| ${b.name} | ${b.value} | ${b.behavior} |`).join('\n')}
` : '';

  const deepStyle = d ? `
---

## Icon & Image Style

**Icons:** ${d.iconStyle}
${d.imageStyle ? `\n**Images:** ${d.imageStyle}` : ''}
` : `
---

## Icon & Image Style

**Icons:** 시스템 아이콘 (outline 2px) 또는 브랜드 아이콘 세트. 크기 24×24px (터치 영역 48×48px).

**Images:** 카드 내 이미지는 ${p.shapes.find(s => s.element === 'card')?.value ?? '12px'} radius, object-fit: cover.
`;

  const deepA11y = d?.accessibilityNotes ? `
---

## Accessibility

\`\`\`
${d.accessibilityNotes}
\`\`\`
` : `
---

## Accessibility

\`\`\`
터치 영역 최소 ${p.layout.touchTarget ?? '48px'} (WCAG 2.5.5 AAA)
색상 대비 최소 4.5:1 (WCAG AA) — 본문 텍스트 기준
포커스 링: 2px solid var(--color-border-focus), offset 2px
prefers-reduced-motion: transition/animation 비활성화
스크린리더: 모든 버튼/아이콘에 aria-label 필수
\`\`\`
`;

  // Key semantic tokens to show in Design.md (subset for readability)
  const keySemanticTokens = [
    ['--color-fill-normal',      '기본 채움 / CTA 배경'],
    ['--color-fill-brand',       '브랜드 컬러 채움'],
    ['--color-fill-brand-weak',  '브랜드 틴트 (배지 soft-bg)'],
    ['--color-bg-normal',        '페이지 기본 배경'],
    ['--color-bg-elevated',      '카드·패널 배경'],
    ['--color-bg-alt',           '보조 배경 (sections)'],
    ['--color-text-normal',      '본문 텍스트'],
    ['--color-text-alternative', '보조 텍스트'],
    ['--color-text-assistive',   '힌트·플레이스홀더'],
    ['--color-text-on-fill',     '채움 위 텍스트'],
    ['--color-text-brand',       '브랜드 컬러 텍스트'],
    ['--color-border-normal',    '기본 테두리'],
    ['--color-border-focus',     '포커스 링'],
    ['--color-border-brand',     '브랜드 테두리'],
    ['--color-fill-success',     '성공 상태'],
    ['--color-fill-danger',      '오류 상태'],
    ['--color-fill-warning',     '경고 상태'],
  ] as const;

  const semanticRows = keySemanticTokens
    .map(([k, desc]) => {
      const light = mergedLight[k] ?? '—';
      const dark  = darkTokens[k]  ?? '—';
      return `| \`${k}\` | \`${light}\` | \`${dark}\` | ${desc} |`;
    })
    .join('\n');

  const keyRoleTokens = [
    ['--comp-button-primary-bg',   '기본 버튼 배경', 'var(--color-fill-normal)'],
    ['--comp-button-primary-fg',   '기본 버튼 텍스트', 'var(--color-text-on-fill)'],
    ['--comp-card-bg',             '카드 배경', 'var(--color-bg-elevated)'],
    ['--comp-card-bd',             '카드 테두리', 'var(--color-border-normal)'],
    ['--comp-input-bd',            '입력창 테두리', 'var(--color-border-normal)'],
    ['--comp-input-bd-focus',      '입력창 포커스 테두리', 'var(--color-border-focus)'],
    ['--comp-badge-solid-bg',      '배지(solid) 배경', 'var(--color-fill-normal)'],
    ['--comp-chip-active-bg',      '칩(활성) 배경', 'var(--color-fill-normal)'],
    ['--comp-navtab-indicator',    '탭 활성 인디케이터', 'var(--color-fill-normal)'],
  ] as const;

  const roleRows = keyRoleTokens
    .map(([k, desc, ref]) => `| \`${k}\` | \`${ref}\` | ${desc} |`)
    .join('\n');

  const keyVariantTokens = [
    ['--comp-button-primary-bg-hover',   'var(--color-fill-strong)',      '버튼 호버'],
    ['--comp-button-primary-bg-pressed', 'var(--color-fill-alternative)', '버튼 눌림'],
    ['--comp-input-bd-error',            'var(--color-border-danger)',     '입력 오류 테두리'],
    ['--comp-input-bd-focus',            'var(--color-border-focus)',      '입력 포커스 테두리'],
    ['--comp-chip-bg-hover',             'var(--color-fill-neutral)',      '칩 호버'],
  ] as const;

  const variantRows = keyVariantTokens
    .map(([k, ref, desc]) => `| \`${k}\` | \`${ref}\` | ${desc} |`)
    .join('\n');

  return `# ${token.tagline} Design Token — ${label}
> Updated: ${token.updatedAt} | Category: ${token.category} | Theme: ${token.theme}

${token.description}

---

## 4-Tier Color Cascade

\`\`\`
Palette (원시값)  →  Semantic (의미)  →  Role (컴포넌트 슬롯)  →  Variant (인터랙션 상태)
palette.ts           semanticTokens.ts    roleTokens.ts              roleTokens.ts
neutral[900].hex  →  --color-fill-normal  →  --comp-button-primary-bg  →  --comp-button-primary-bg-hover
\`\`\`

### Tier 2 — Semantic Tokens (핵심 14종)
| Token | Light | Dark | 용도 |
|-------|-------|------|------|
${semanticRows}

> 전체 목록은 **CSS 탭** → Tier 2 블록 참조

### Tier 3 — Role Tokens (컴포넌트 슬롯)
| Token | References | 용도 |
|-------|-----------|------|
${roleRows}

> **다크모드 자동 전환**: Role 토큰은 var(--color-*) 참조이므로 [data-theme="dark"] 선언만으로 모든 컴포넌트가 자동 전환됨.

### Tier 4 — Variant Tokens (상태별 오버라이드)
| Token | References | 트리거 |
|-------|-----------|--------|
${variantRows}

> 전체 Role·Variant 목록은 **CSS 탭** Tier 3/4 블록 참조

---

## Typography — ${label}

### ${p.typography.family}
- **Substitute:** ${p.typography.substitute ?? 'system-ui'}
- **Weights:** ${p.typography.weights.join(', ')}

${typeSizes(p)}

---

## Spacing & Shapes

**Density:** ${p.spacing.density} | **Base unit:** ${p.spacing.baseUnit}

${spacingTable(p)}

### Border Radius

${shapesTable(p)}

### Layout

- **Max width:** ${p.layout.maxWidth}
- **Section gap:** ${p.layout.sectionGap}
${p.layout.columns ? `- **Grid:** ${p.layout.columns}col` : ''}
${p.layout.touchTarget ? `- **Touch target (min):** ${p.layout.touchTarget}` : ''}

---

${componentSection}

---

## Do's and Don'ts

### Do
${token.guidelines.dos.map(d => `- ${d}`).join('\n')}

### Don't
${token.guidelines.donts.map(d => `- ${d}`).join('\n')}

---

${verifiedPrinciples(token, p)}
${deepInteraction}${deepVoice}${deepBreakpoints}${deepStyle}${deepA11y}
---

## Elevation

| Name | Value | Token |
|------|-------|-------|
| card (default) | \`0 2px 8px rgba(0,0,0,0.06)\` | \`--shadow-card\` |
| card (hover) | \`0 6px 20px rgba(0,0,0,0.10)\` | \`--shadow-card-hover\` |
| primary CTA | \`${deriveShadow(token)}\` | \`--shadow-primary\` |
| modal / sheet | \`0 -4px 32px rgba(0,0,0,0.12)\` | \`--shadow-overlay\` |
`;
}

/* ─────────────── CSS generator (4-tier cascade) ─────────────── */

export function generateCSS(token: BrandToken, platform: 'mobile' | 'web' = 'mobile'): string {
  const p = token.platforms[platform];
  const mergedLight = getMergedSemanticLight(token);

  const tier2Light = Object.entries(mergedLight)
    .map(([k, v]) => `  ${k}: ${v};`)
    .join('\n');

  const tier2Dark = Object.entries(darkTokens)
    .map(([k, v]) => `  ${k}: ${v};`)
    .join('\n');

  const tier3 = Object.entries(ROLE_TOKEN_VARS)
    .map(([k, v]) => `  ${k}: ${v};`)
    .join('\n');

  const tier4 = Object.entries(VARIANT_TOKEN_VARS)
    .map(([k, v]) => `  ${k}: ${v};`)
    .join('\n');

  const typeVars = p.typography.sizes
    .map(s => `  --type-${s.role.toLowerCase().replace(/\s+/g, '-')}-size: ${s.size};`)
    .join('\n');

  const spacingVars = p.spacing.scale.map(s => `  ${s.token}: ${s.value};`).join('\n');
  const semanticSpaceVars = semanticSpaceScale(token, platform).map(([k, v]) => `  --space-${k}: ${v}px;`).join('\n');
  const shapeVars = p.shapes.map(s => `  --radius-${s.element}: ${s.value};`).join('\n');

  return `/* =====================================================
 * ${token.tagline}
 * Foundation Token Cascade — ${platform.toUpperCase()}
 * Updated: ${token.updatedAt}
 *
 * 4-Tier Cascade:
 *   Tier 2 (Semantic)  → --color-*
 *   Tier 3 (Role)      → --comp-{component}-{slot}
 *   Tier 4 (Variant)   → --comp-{component}-{slot}-{state}
 *   Dark mode          → [data-theme="dark"] overrides Tier 2 only
 *                        Tier 3/4 cascade automatically.
 * ===================================================== */

/* ─── Tier 2: Semantic ─────────────────────────────────
 * Maps design intent to resolved color values.
 * Brand overrides applied to --color-fill-brand,
 * --color-border-brand, --color-border-focus.
 * To change brand color: update only these vars.
 * ──────────────────────────────────────────────────── */
:root {
${tier2Light}

  /* Typography */
  --font-primary: ${p.typography.family};
  --font-substitute: ${p.typography.substitute ?? 'system-ui'};
${typeVars}

  /* Spacing — raw scale (4px grid design tokens) */
${spacingVars}

  /* Spacing — semantic scale (the density-aware gaps/padding components render) */
${semanticSpaceVars}

  /* Border radius */
${shapeVars}

  /* Layout */
  --layout-max-width: ${p.layout.maxWidth};
  --layout-section-gap: ${p.layout.sectionGap};
}

/* ─── Tier 3: Role ─────────────────────────────────────
 * Binds a semantic intent to a specific component slot.
 * Uses var(--color-*) → dark mode cascades automatically.
 * Never override these per-brand; change Tier 2 instead.
 * ──────────────────────────────────────────────────── */
:root {
${tier3}
}

/* ─── Tier 4: Variant ──────────────────────────────────
 * Interaction state overrides for role tokens.
 * Applied via :hover / :active / .is-error classes.
 * ──────────────────────────────────────────────────── */
:root {
${tier4}
}

/* ─── Dark mode ─────────────────────────────────────────
 * Override Tier 2 (Semantic) only.
 * Tier 3 (Role) and Tier 4 (Variant) auto-cascade.
 * ──────────────────────────────────────────────────── */
[data-theme="dark"] {
${tier2Dark}
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
${tier2Dark.split('\n').map(l => '  ' + l).join('\n')}
  }
}`;
}

/* ─────────────── Tailwind v4 generator ─────────────── */

export function generateTailwind(token: BrandToken, platform: 'mobile' | 'web' = 'mobile'): string {
  const p = token.platforms[platform];
  const spacingVars = p.spacing.scale.map(s => `  ${s.token}: ${s.value};`).join('\n');
  const semanticSpaceVars = semanticSpaceScale(token, platform).map(([k, v]) => `  --spacing-${k}: ${v}px;`).join('\n');
  const shapeVars = p.shapes.map(s => `  --radius-${s.element}: ${s.value};`).join('\n');

  return `/* =====================================================
 * ${token.tagline} — Tailwind v4 Theme
 * Tailwind utilities reference Tier 2 (Semantic) CSS
 * vars so dark mode works via [data-theme="dark"].
 *
 * SETUP:
 * 1. Paste the CSS tab output into your globals.css
 * 2. Add this @theme block to globals.css
 * 3. Use Tailwind utilities: bg-bg, text-text, etc.
 * ===================================================== */

@theme {
  /* Brand */
  --color-brand:      var(--color-fill-brand);
  --color-on-brand:   var(--color-text-on-fill);
  --color-brand-weak: var(--color-fill-brand-weak);

  /* Backgrounds */
  --color-bg:          var(--color-bg-normal);
  --color-surface:     var(--color-bg-elevated);
  --color-surface-alt: var(--color-bg-alt);

  /* Text */
  --color-text:       var(--color-text-normal);
  --color-text-sub:   var(--color-text-alternative);
  --color-text-muted: var(--color-text-assistive);
  --color-text-off:   var(--color-text-disabled);
  --color-on-fill:    var(--color-text-on-fill);

  /* Fill */
  --color-fill:         var(--color-fill-normal);
  --color-fill-strong:  var(--color-fill-strong);
  --color-fill-neutral: var(--color-fill-neutral);

  /* Border */
  --color-border:       var(--color-border-normal);
  --color-border-focus: var(--color-border-focus);

  /* Status */
  --color-success: var(--color-fill-success);
  --color-danger:  var(--color-fill-danger);
  --color-warning: var(--color-fill-warning);
  --color-info:    var(--color-fill-info);
  --color-accent:  var(--color-fill-accent);

  /* Typography */
  --font-primary: ${p.typography.family};
${p.typography.sizes.map(s => `  --text-${s.role.toLowerCase().replace(/\s+/g, '-')}: ${s.size};`).join('\n')}

  /* Spacing — raw 4px grid scale (p-4, gap-8 …) */
${spacingVars}

  /* Spacing — semantic scale (p-md, gap-lg … = the gaps components render) */
${semanticSpaceVars}

  /* Border radius */
${shapeVars}

  /* Layout */
  --layout-max-width: ${p.layout.maxWidth};
  --layout-section-gap: ${p.layout.sectionGap};
}

/* Usage examples:
 *   bg-bg          → background: var(--color-bg-normal)
 *   text-text      → color: var(--color-text-normal)
 *   text-text-sub  → color: var(--color-text-alternative)
 *   border-border  → border-color: var(--color-border-normal)
 *   bg-brand       → background: var(--color-fill-brand)
 *   text-on-fill   → color: var(--color-text-on-fill)
 *   bg-success     → background: var(--color-fill-success)
 */`;
}

/* ─────────────── JSON (Token Studio) generator ─────────────── */

function varToRef(cssVar: string): string {
  // 'var(--color-fill-normal)' → '{semantic.fill-normal}'
  return cssVar.replace('var(--color-', '{semantic.').replace(')', '}');
}

export function generateDesignTokensJSON(token: BrandToken, platform: 'mobile' | 'web' = 'mobile'): string {
  const p = token.platforms[platform];
  const mergedLight = getMergedSemanticLight(token);

  const semantic: Record<string, { value: string; type: string }> = {};
  Object.entries(mergedLight).forEach(([k, v]) => {
    const name = k.replace('--color-', '');
    semantic[name] = { value: v, type: 'color' };
  });

  const role: Record<string, { value: string; type: string }> = {};
  Object.entries(ROLE_TOKEN_VARS).forEach(([k, v]) => {
    const name = k.replace('--comp-', '');
    role[name] = { value: varToRef(v), type: 'color' };
  });

  const variant: Record<string, { value: string; type: string }> = {};
  Object.entries(VARIANT_TOKEN_VARS).forEach(([k, v]) => {
    const name = k.replace('--comp-', '');
    variant[name] = { value: varToRef(v), type: 'color' };
  });

  const spacing: Record<string, { value: string; type: string }> = {};
  p.spacing.scale.forEach(s => {
    spacing[s.name] = { value: s.value, type: 'spacing' };
  });
  // Semantic scale (xxs…xl) with the density-derived values components render.
  semanticSpaceScale(token, platform).forEach(([k, v]) => {
    spacing[k] = { value: `${v}px`, type: 'spacing' };
  });

  const radius: Record<string, { value: string; type: string }> = {};
  p.shapes.forEach(s => {
    radius[s.element] = { value: s.value, type: 'borderRadius' };
  });

  const typography: Record<string, { value: string; type: string; lineHeight?: string; letterSpacing?: string }> = {
    'font-family': { value: p.typography.family, type: 'fontFamilies' },
  };
  p.typography.sizes.forEach(s => {
    const key = s.role.toLowerCase().replace(/\s+/g, '-');
    typography[key] = {
      value: s.size,
      type: 'fontSize',
      lineHeight: s.lineHeight,
      letterSpacing: s.letterSpacing,
    };
  });

  const json = {
    $metadata: {
      tokenSetOrder: ['semantic', 'role', 'variant', 'typography', 'spacing', 'borderRadius'],
    },
    $description: `${token.tagline} — 4-Tier Foundation Tokens (${platform}) — ${token.updatedAt}`,
    semantic,
    role,
    variant,
    typography,
    spacing,
    borderRadius: radius,
    shadow: {
      card: { value: '0 2px 8px rgba(0,0,0,0.06)', type: 'boxShadow' },
      primary: { value: deriveShadow(token), type: 'boxShadow' },
    },
  };

  return JSON.stringify(json, null, 2);
}

/* ─────────────── Figma variables guide ─────────────── */

export function generateFigmaVariables(token: BrandToken, platform: 'mobile' | 'web' = 'mobile'): string {
  const p = token.platforms[platform];
  const mergedLight = getMergedSemanticLight(token);

  const semanticRows = Object.entries(mergedLight)
    .slice(0, 18)
    .map(([k, v]) => `| Color | semantic/${k.replace('--color-', '')} | \`${v}\` | light |`)
    .join('\n');

  const roleRows = Object.entries(ROLE_TOKEN_VARS)
    .slice(0, 10)
    .map(([k, v]) => `| Color | role/${k.replace('--comp-', '')} | references semantic | light+dark |`)
    .join('\n');

  const spacingRows = p.spacing.scale
    .map(s => `| Number | spacing/${s.name} | ${s.value} | all |`)
    .join('\n');

  const typographyRows = [
    `| String | type/font-family | \`${p.typography.family}\` | — |`,
    ...p.typography.sizes
      .map(s => `| Text | type/${s.role.toLowerCase().replace(/\s/g, '-')} | ${s.size} / lh ${s.lineHeight} | — |`),
  ].join('\n');

  return `# ${token.tagline} — Figma Variables 가이드 (${platform})
> Updated: ${token.updatedAt}

## 4 컬렉션 구조

Figma에서는 아래 4개 컬렉션으로 구성합니다.
각 컬렉션은 Foundation 4계층에 대응합니다.

| 컬렉션 | 계층 | 모드 | 설명 |
|--------|------|------|------|
| **Semantic** | Tier 2 | light / dark | 의미 색상 (--color-*) |
| **Role** | Tier 3 | light / dark | 컴포넌트 슬롯 (--comp-*) |
| **Variant** | Tier 4 | — | 인터랙션 상태 (--comp-*-{state}) |
| **Spacing / Type** | — | — | 여백·타이포 원시값 |

---

## Semantic Variables (light 모드 — 일부)

| Type | Name | Value | Mode |
|------|------|-------|------|
${semanticRows}

> 전체 목록: **JSON 탭** → \`"semantic"\` 오브젝트

---

## Role Variables (일부)

| Type | Name | Value | Mode |
|------|------|-------|------|
${roleRows}

> Role 토큰은 Semantic 토큰을 alias 참조합니다.
> Figma에서 "alias" 타입으로 설정하면 라이트/다크 전환이 자동 작동합니다.
> 전체 목록: **JSON 탭** → \`"role"\` 오브젝트

---

## Spacing Variables

| Type | Name | Value | Mode |
|------|------|-------|------|
${spacingRows}

---

## Typography Variables

| Type | Name | Value | Mode |
|------|------|-------|------|
${typographyRows}

---

## Tokens Studio 플러그인으로 자동 추가 (권장)

1. Figma → Plugins → **Tokens Studio for Figma** 설치
2. 플러그인 열기 → **JSON** 탭
3. **JSON 탭**의 전체 내용을 붙여넣기 → **Import** 클릭
4. semantic 컬렉션에 **light / dark 두 모드**를 생성하고
   dark 모드에는 **CSS 탭**의 \`[data-theme="dark"]\` 블록 값 입력

\`\`\`json
{
  "NOTE": "아래 JSON 탭 전체를 복사하세요",
  "tokenSetOrder": ["semantic", "role", "variant", "typography", "spacing", "borderRadius"]
}
\`\`\`
`;
}

/* ─────────────── public API ─────────────── */

export function generateDesignMd(token: BrandToken, platform: 'mobile' | 'web' = 'mobile'): string {
  return platformDesignMd(token, platform);
}
