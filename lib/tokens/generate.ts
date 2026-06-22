import { BrandToken, PlatformToken } from '@/types/token';

/* ─────────────── helpers ─────────────── */

function colorTable(token: BrandToken): string {
  return [
    '| Name | Value | Token | Role |',
    '|------|-------|-------|------|',
    ...token.colors.map(c => `| ${c.name} | \`${c.value}\` | \`${c.variable}\` | ${c.role} |`),
  ].join('\n');
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

function surfacesTable(token: BrandToken): string {
  const bg = token.colors.find(c => /기본 배경/.test(c.role));
  const card = token.colors.find(c => /카드 배경|보조 배경/.test(c.role));
  const dark = token.colors.find(c => /gray.?900|본문 텍스트/i.test(c.role));
  const rows: string[] = [];
  if (bg) rows.push(`| 0 | 기본 배경 | \`${bg.value}\` | \`${bg.variable}\` | 전체 페이지 캔버스 |`);
  if (card) rows.push(`| 1 | 카드 표면 | \`${card.value}\` | \`${card.variable}\` | 카드, 입력창 배경 |`);
  if (dark) rows.push(`| 2 | 다크 패널 | \`${dark.value}\` | \`${dark.variable}\` | 푸터, 반전 영역 |`);
  return rows.length
    ? '| Level | Name | Value | Token | Purpose |\n|-------|------|-------|-------|---------|' + '\n' + rows.join('\n')
    : '_(데이터 없음)_';
}

function quickColorRef(token: BrandToken): string {
  const primary = token.colors.find(c => /primary/i.test(c.role));
  const bg = token.colors.find(c => /기본 배경/.test(c.role));
  const border = token.colors.find(c => /구분선|보더/.test(c.role));
  const accent = token.colors.find(c => !/gray|white|black|grey/i.test(c.name) && c.value !== primary?.value);
  const lines: string[] = [];
  if (primary) lines.push(`- text (primary): ${token.colors.find(c => /본문 텍스트|주요 컨텐츠/.test(c.role))?.value ?? '#111'}`);
  if (bg) lines.push(`- background: ${bg.value}`);
  if (border) lines.push(`- border: ${border.value}`);
  if (accent) lines.push(`- accent / decoration: ${accent.value}`);
  if (primary) lines.push(`- primary action: ${primary.value}`);
  return lines.join('\n');
}

function deriveShadow(token: BrandToken): string {
  const primary = token.colors.find(c => /primary/i.test(c.role));
  if (!primary) return '0 2px 8px rgba(0,0,0,0.08)';
  const hex = primary.value.replace('#', '');
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return `rgba(${r},${g},${b},0.20) 0px 4px 16px 0px, rgba(${r},${g},${b},0.08) 0px 1px 4px 0px`;
}

function agentPromptGuide(token: BrandToken, p: PlatformToken): string {
  const primary = token.colors.find(c => /primary/i.test(c.role))?.value ?? '#888';
  const btn = p.shapes.find(s => s.element === 'button')?.value ?? '8px';
  const card = p.shapes.find(s => s.element === 'card')?.value ?? '12px';
  const bodyFont = p.typography.family;
  const bodySize = p.typography.sizes.find(s => s.role === 'Body 1')?.size ?? '16px';
  const displaySize = p.typography.sizes.find(s => s.role === 'Display')?.size ?? '32px';
  const headingSize = p.typography.sizes.find(s => s.role === 'Heading 1')?.size ?? '24px';
  const bg = token.colors.find(c => /기본 배경/.test(c.role))?.value ?? '#fff';
  const cardBg = token.colors.find(c => /카드 배경|보조 배경/.test(c.role))?.value ?? '#f5f5f5';
  const textMain = token.colors.find(c => /본문 텍스트|주요 컨텐츠/.test(c.role))?.value ?? '#111';
  const textSub = token.colors.find(c => /보조 텍스트/.test(c.role))?.value ?? '#666';
  const accent = token.colors.find(c => !/gray|white|black|grey/i.test(c.name) && c.value !== primary)?.value ?? primary;

  const examples: string[] = [];

  // Example 1: Primary CTA Button
  examples.push(`1. **Primary CTA Button**: ${primary} 배경, border-radius ${btn}. 텍스트 ${bodyFont} font-weight ${p.typography.weights.slice(-1)[0]}, ${bodySize}. 전체 너비 모바일 CTA.`);

  // Example 2: Card Component
  examples.push(`2. **카드 컴포넌트**: ${cardBg} 배경, border-radius ${card}, padding 16-20px. 타이틀 ${headingSize} font-weight ${p.typography.weights[1] ?? 500}, ${textMain}. 서브텍스트 ${bodySize}, ${textSub}. 그림자 없이 보더로 구분 또는 shadow-sm.`);

  // Example 3: Typography Specimen
  examples.push(`3. **타이포그래피 블록**: Display ${displaySize} font-weight ${p.typography.weights.slice(-1)[0]}, letter-spacing -0.02em, ${textMain}. Body 1 ${bodySize} font-weight ${p.typography.weights[0]}, line-height 1.6, ${textSub}. Font: ${bodyFont}.`);

  // Example 4: Input Field
  const inputRadius = p.shapes.find(s => s.element === 'input')?.value ?? btn;
  examples.push(`4. **Input Field**: border 1px solid ${token.colors.find(c => /구분선|보더/.test(c.role))?.value ?? '#e0e0e0'}, border-radius ${inputRadius}, height 48px (모바일). Focus 상태: border-color ${primary}, box-shadow 0 0 0 3px ${primary}26.`);

  // Example 5: Accent usage
  examples.push(`5. **Accent / 강조**: ${accent} 를 보조 CTA, 배지, 상태 표시에만 사용. 뱃지: border-radius ${p.shapes.find(s => s.element === 'badge')?.value ?? '4px'}, padding 2-4px 6-8px, text ${bodySize} font-weight ${p.typography.weights.slice(-1)[0]}.`);

  return `**Quick Color Reference**
${quickColorRef(token)}

**3-5 Example Component Prompts**

${examples.join('\n\n')}`;
}

function cssQuickStart(token: BrandToken, p: PlatformToken): string {
  const colorVars = token.colors.map(c => `  ${c.variable}: ${c.value};`).join('\n');
  const spacingVars = p.spacing.scale.map(s => `  ${s.token}: ${s.value};`).join('\n');
  const shapeVars = p.shapes.map(s => `  --radius-${s.element.replace(/[\s/]/g, '-')}: ${s.value};`).join('\n');
  const shadow = deriveShadow(token);

  return `:root {
  /* Colors */
${colorVars}

  /* Typography */
  --font-primary: '${p.typography.family}', ${p.typography.substitute ?? 'system-ui'};
  --font-weights: ${p.typography.weights.join(', ')};

  /* Spacing */
  --spacing-base: ${p.spacing.baseUnit};
${spacingVars}

  /* Border Radius */
${shapeVars}

  /* Layout */
  --page-max-width: ${p.layout.maxWidth};
  --section-gap: ${p.layout.sectionGap};

  /* Shadows */
  --shadow-primary: ${shadow};
  --shadow-card: 0 2px 8px rgba(0,0,0,0.06);
}`;
}

function tailwindV4Theme(token: BrandToken, p: PlatformToken): string {
  const colorVars = token.colors.map(c => `  ${c.variable}: ${c.value};`).join('\n');
  const spacingVars = p.spacing.scale.map(s => `  ${s.token}: ${s.value};`).join('\n');
  const shapeVars = p.shapes.map(s => `  --radius-${s.element.replace(/[\s/]/g, '-')}: ${s.value};`).join('\n');

  return `@theme {
  /* Colors */
${colorVars}

  /* Typography */
  --font-primary: '${p.typography.family}', ${p.typography.substitute ?? 'system-ui'};

  /* Type Scale */
${p.typography.sizes.map(s => `  --text-${s.role.toLowerCase().replace(/\s/g, '-')}: ${s.size};`).join('\n')}

  /* Spacing */
${spacingVars}

  /* Border Radius */
${shapeVars}

  /* Layout */
  --page-max-width: ${p.layout.maxWidth};
  --section-gap: ${p.layout.sectionGap};
}`;
}

function deriveComponentSpecs(token: BrandToken, p: PlatformToken): string {
  const primary = token.colors.find(c => /primary/i.test(c.role))?.value ?? '#888';
  const cardBg = token.colors.find(c => /카드 배경|보조 배경/.test(c.role))?.value ?? '#f5f5f5';
  const textMain = token.colors.find(c => /본문 텍스트|주요 컨텐츠/.test(c.role))?.value ?? '#111';
  const border = token.colors.find(c => /구분선|보더/.test(c.role))?.value ?? '#e0e0e0';
  const btn = p.shapes.find(s => s.element === 'button')?.value ?? '8px';
  const card = p.shapes.find(s => s.element === 'card')?.value ?? '12px';
  const input = p.shapes.find(s => s.element === 'input')?.value ?? '6px';
  const bodyWeight = p.typography.weights[1] ?? 500;
  const boldWeight = p.typography.weights.slice(-1)[0] ?? 700;
  const bodySize = p.typography.sizes.find(s => s.role === 'Body 1')?.size ?? '16px';
  const onPrimary = (() => {
    const h = primary.replace('#', '');
    if (h.length < 6) return '#ffffff';
    const lum = (0.299 * parseInt(h.slice(0, 2), 16) + 0.587 * parseInt(h.slice(2, 4), 16) + 0.114 * parseInt(h.slice(4, 6), 16)) / 255;
    return lum > 0.62 ? '#111111' : '#ffffff';
  })();
  const primaryTint = token.colors.find(c => /강조 영역 배경|강조 배경/.test(c.role))?.value ?? '연한 브랜드 틴트';
  const badge = p.shapes.find(s => s.element === 'badge')?.value ?? '4px';
  const captionSize = p.typography.sizes.find(s => s.role === 'Caption')?.size ?? '12px';

  return `### Primary Button
**구조:** [아이콘?] + 텍스트 레이블
**States:** default → hover(brightness 1.08) → pressed(scale 0.97) → loading(spinner) → disabled(opacity 0.38)
\`\`\`
height: 48-52px
border-radius: ${btn}
background: ${primary}
font: ${boldWeight} ${bodySize}/${p.typography.sizes.find(s => s.role === 'Body 1')?.lineHeight ?? 1} ${p.typography.family}
padding: 0 24px
width: 100% (mobile full-width CTA)
transition: transform 150ms ease, filter 150ms ease
\`\`\`

### Secondary Button
**States:** default → hover(bg darken 4%) → pressed(scale 0.97) → disabled(opacity 0.38)
\`\`\`
height: 48-52px
border-radius: ${btn}
background: ${cardBg}
color: ${textMain}
border: 1px solid ${border}
font: ${bodyWeight} ${bodySize} ${p.typography.family}
\`\`\`

### Card
**구조:** 컨테이너 > [이미지?] > 헤더 > 본문 > [액션?]
**States:** default → hover(shadow 증가, translateY -2px) → active(scale 0.99)
\`\`\`
border-radius: ${card}
background: ${cardBg}
padding: ${p.spacing.scale[3]?.value ?? '16px'}
box-shadow: 0 2px 8px rgba(0,0,0,0.06)
hover: box-shadow 0 6px 20px rgba(0,0,0,0.10), transform translateY(-2px)
transition: 200ms ease
\`\`\`

### Input Field
**구조:** 레이블 > 입력창 > [보조 텍스트 | 에러 메시지]
**States:** default(border: ${border}) → focus(border: ${primary}, ring: 0 0 0 3px ${primary}26) → error(border: #ef4444) → disabled(opacity 0.5)
\`\`\`
height: 48px (mobile) / 44px (web)
border-radius: ${input}
border: 1px solid ${border}
font: ${bodyWeight} ${bodySize} ${p.typography.family}
padding: 0 16px
placeholder-color: ${token.colors.find(c => /비활성|힌트|플레이스홀더/.test(c.role))?.value ?? '#aaa'}
\`\`\`

### Badge / Chip
**용도:** 상태(판매중·품절), 카테고리 태그, 강조 라벨. **항상 충분한 대비를 확보해 명확히 보이도록 한다.**
**금지:** 배경에 brand 색의 낮은 투명도(예: \`${primary}22\`)를 깔고 그 위에 옅은 텍스트를 올리지 말 것 — 가독성이 떨어진다.
\`\`\`
border-radius: ${badge}
font: ${boldWeight} ${captionSize} ${p.typography.family}
padding: 2px 7px

# Solid (기본 — 상태/강조 라벨)
background: ${primary}
color: ${onPrimary}        # 흰/검정 자동 대비, 절대 옅게 깔지 않음

# Soft (보조 라벨, 가독성 유지)
background: ${primaryTint} # 불투명 틴트색 사용 (alpha 금지)
color: ${primary}          # 텍스트는 brand 풀컬러로 — 대비 확보

# Muted (품절·비활성)
background: ${token.colors.find(c => /비활성|힌트/.test(c.role))?.value ?? '#9aa0a6'}
color: #ffffff
\`\`\``;
}

/**
 * 검증된 디자인 시스템 원칙 — 이 서비스를 구축하며 겪은 시행착오에서
 * 도출한 규칙을 각 브랜드 MD에 맞춤 적용한다. (품질 검사 엔진과 1:1 대응)
 */
function verifiedPrinciples(token: BrandToken, p: PlatformToken): string {
  // 브랜드 성격에 따른 아이콘 라이브러리 추천 (resolveIconStyleFromToken과 동일 로직)
  const s = (token.serviceTypes ?? []).join(' ');
  const hint = (token.deep?.iconStyle ?? '').toLowerCase();
  let iconLib: string;
  let iconWhy: string;
  if (/fill|bold|두꺼|굵/.test(hint) || /메신저|소셜|채팅|배달|푸드|지역|중고|커뮤니티|동네/.test(s)) {
    iconLib = 'Phosphor';
    iconWhy = '따뜻하고 둥근 표정 — 메신저·배달·지역 서비스의 친근함에 적합';
  } else if (/tabler|editorial|각진/.test(hint) || token.category === '커머스') {
    iconLib = 'Tabler';
    iconWhy = '에디토리얼하고 또렷한 선 — 커머스의 상품 중심 위계에 적합';
  } else {
    iconLib = 'Lucide';
    iconWhy = '깔끔하고 전문적인 스트로크 — 금융·검색·도구 서비스에 적합';
  }

  const primary = token.colors.find(c => /primary/i.test(c.role))?.value ?? '#111';
  const family = p.typography.family;

  return `## 디자인 시스템 원칙 (검증된 시행착오)

> 이 서비스를 구축하며 반복해서 부딪힌 문제와 해결책. 신규 UI 제작 시 반드시 따른다.
> 품질 검사 엔진(서비스 DS / 와이어프레임 컴포넌트 DS 2-검사기)이 자동 검증한다.

### 1. 의존성 체인 — 단일 소스
\`파운데이션(토큰) → 컴포넌트 → 패턴 → 브랜드 디자인\` 순으로만 의존한다.
컴포넌트의 **컬러·타이포·여백은 반드시 파운데이션 토큰**을 따른다. 토큰 = 파운데이션.

### 2. 아이콘은 라이브러리, 이모지 금지
이모지(🔍❤👤 등)를 UI에 직접 쓰지 않는다. 모든 아이콘은 \`currentColor\`를 상속하는 아이콘 컴포넌트로 렌더.
- **추천 라이브러리: ${iconLib}** — ${iconWhy}
- 크기 기준 24×24px, 터치 영역 ${p.layout.touchTarget ?? '48px'} 확보.

### 3. 폰트 — 한글 메트릭 안정화
본문 typeface는 \`${family}\`, **폴백은 Pretendard**로 고정한다(한글 베이스라인 안정).
배지·칩·탭 등 pill 안의 한글은 라인박스 상단에 붙어 떠 보이므로,
\`line-height: 1\` + **위쪽 패딩을 아래보다 크게** 주어 광학적 중앙 정렬을 맞춘다.

### 4. 상태는 색으로 표현
Primary가 무채(예: \`${primary}\`) 기반이어도 **성공·경고·오류 상태는 유채색**(녹/황/적)으로 명확히 구분한다.
색이 전혀 없으면 에러·유효성 표현이 불가능하다(shadcn 기본 컨벤션).

### 5. 여백은 토큰만
모든 \`gap / padding / margin\`은 스페이싱 스케일(\`xxs · xs · sm · md · lg · xl\`)을 사용한다.
하드코딩 픽셀 여백 금지(레이아웃 래퍼 포함). 마이크로 간격은 \`xxs\`(2–3px).

### 6. 컴포넌트 우선 · 비표준 금지
신규 UI는 **디자인 시스템이 제공하는 표준 컴포넌트를 우선** 사용한다.
없으면 임의로 만들지 말고 **승인 후 표준 컴포넌트로 추가**한 뒤 사용한다.

### 7. 같은 레벨 UI = 같은 컴포넌트
동일한 역할의 UI(예: 필터/카테고리 탭)는 페이지마다 다르게 구현하지 않고 **단일 공유 컴포넌트**를 쓴다.

### 8. 이미지 위 텍스트는 오버레이 토큰
이미지·썸네일 위 텍스트는 \`textOnImage\` / \`scrim\` 토큰을 쓴다. 하드코딩 \`#fff\`·\`rgba()\` 금지.

### 9. 대비·접근성
배지/칩은 brand 색의 낮은 투명도 위에 옅은 텍스트를 올리지 않는다(불투명 틴트 + 풀컬러 텍스트로 대비 확보).
본문 대비 ≥ 4.5:1(WCAG AA), 포커스 링 2px.`;
}

/* ─────────────── main generator ─────────────── */

function platformDesignMd(token: BrandToken, platform: 'mobile' | 'web'): string {
  const p: PlatformToken = token.platforms[platform];
  const label = platform === 'mobile' ? 'Mobile (390px)' : 'Web (1440px)';
  const d = token.deep;
  const shadow = deriveShadow(token);

  /* deep sections */
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

  const componentSection = d && d.components.length > 0
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

  const deepBreakpoints = d ? `
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

**Images:** ${d.imageStyle}
` : `
---

## Icon & Image Style

**Icons:** 시스템 아이콘 (outline 2px) 또는 브랜드 아이콘 세트 사용 권장. 크기 24×24px (터치 영역 48×48px 확보).

**Images:** 브랜드 컬러 톤에 맞춰 보정. 카드 내 이미지는 ${p.shapes.find(s => s.element === 'card')?.value ?? '12px'} radius, object-fit: cover.
`;

  const deepA11y = d ? `
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
포커스 링: 2px solid ${token.colors.find(c => /primary/i.test(c.role))?.value ?? '#007AFF'}, offset 2px
prefers-reduced-motion: transition/animation 비활성화
스크린리더: 모든 버튼/아이콘에 aria-label 필수
\`\`\`
`;

  return `# ${token.tagline} Design Token — ${label}
> Updated: ${token.updatedAt} | Category: ${token.category} | Theme: ${token.theme}

${token.description}

---

## Tokens — Colors

${colorTable(token)}

---

## Tokens — Typography

### ${p.typography.family} — Primary typeface · \`--font-primary\`
- **Substitute:** ${p.typography.substitute ?? 'system-ui'}
- **Weights:** ${p.typography.weights.join(', ')}

### Type Scale

${typeSizes(p)}

---

## Tokens — Spacing & Shapes

**Density:** ${p.spacing.density}

### Spacing Scale

${spacingTable(p)}

### Border Radius

${shapesTable(p)}

### Shadows

| Name | Value | Token |
|------|-------|-------|
| card | \`0 2px 8px rgba(0,0,0,0.06)\` | \`--shadow-card\` |
| primary | \`${shadow}\` | \`--shadow-primary\` |

### Layout

- **Page max-width:** ${p.layout.maxWidth}
- **Section gap:** ${p.layout.sectionGap}
${p.layout.columns ? `- **Grid:** ${p.layout.columns}` : ''}
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

## Surfaces

${surfacesTable(token)}

---

## Elevation

- **Card (default):** \`0 2px 8px rgba(0,0,0,0.06)\`
- **Card (hover):** \`0 6px 20px rgba(0,0,0,0.10)\`
- **Primary CTA Button:** \`${shadow}\`
- **Modal / Bottom Sheet:** \`0 -4px 32px rgba(0,0,0,0.12)\`

---

## Agent Prompt Guide

${agentPromptGuide(token, p)}

---

## Typography Pairing Logic

${p.typography.family}를 UI 전반에 걸쳐 사용. 본문(Body)에는 weight ${p.typography.weights[0]}–${p.typography.weights[1] ?? p.typography.weights[0]}, 제목(Heading)에는 weight ${p.typography.weights.slice(-1)[0]}을 기본으로.
${d ? `
- 숫자/금액 표기는 tabular-nums feature 활성화 권장
- 한국어 자간: Body에서 0, Display에서 -0.02em 이하` : `
- 자간(letter-spacing): Display/Heading에서 -0.01em ~ -0.02em, Body에서 0
- 행간(line-height): Display 1.1–1.3, Body 1.5–1.6`}

---

## Quick Start

### CSS Custom Properties

\`\`\`css
${cssQuickStart(token, p)}
\`\`\`

### Tailwind v4

\`\`\`css
${tailwindV4Theme(token, p)}
\`\`\`
`;
}

export function generateDesignMd(token: BrandToken, platform: 'mobile' | 'web' = 'mobile'): string {
  return platformDesignMd(token, platform);
}

export function generateCSS(token: BrandToken, platform: 'mobile' | 'web' = 'mobile'): string {
  const p = token.platforms[platform];
  return cssQuickStart(token, p);
}

export function generateTailwind(token: BrandToken, platform: 'mobile' | 'web' = 'mobile'): string {
  const p = token.platforms[platform];
  return tailwindV4Theme(token, p);
}

export function generateDesignTokensJSON(token: BrandToken, platform: 'mobile' | 'web' = 'mobile'): string {
  const p = token.platforms[platform];
  const colors: Record<string, { value: string; type: string; description: string }> = {};
  token.colors.forEach((c) => {
    const key = c.name.toLowerCase().replace(/\s/g, '-');
    colors[key] = { value: c.value, type: 'color', description: c.role };
  });

  const spacing: Record<string, { value: string; type: string }> = {};
  p.spacing.scale.forEach((s) => {
    spacing[s.name] = { value: s.value, type: 'spacing' };
  });

  const radius: Record<string, { value: string; type: string }> = {};
  p.shapes.forEach((s) => {
    radius[s.element.replace(/[\s/]/g, '-')] = { value: s.value, type: 'borderRadius' };
  });

  const typography: Record<string, { value: string; type: string }> = {};
  p.typography.sizes.forEach(s => {
    const key = s.role.toLowerCase().replace(/\s/g, '-');
    typography[key] = { value: s.size, type: 'fontSize' };
  });

  const json = {
    $metadata: { tokenSetOrder: ['color', 'typography', 'spacing', 'borderRadius'] },
    $description: `${token.tagline} Design Tokens (${platform}) — Updated: ${token.updatedAt}`,
    color: colors,
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

export function generateFigmaVariables(token: BrandToken, platform: 'mobile' | 'web' = 'mobile'): string {
  const p = token.platforms[platform];
  const colorRows = token.colors
    .map((c) => `| Color | ${c.name} | ${c.value} | ${c.variable.replace('--color-', '')} |`)
    .join('\n');

  const spacingRows = p.spacing.scale
    .map((s) => `| Number | spacing/${s.name} | ${s.value} | ${s.token.replace('--spacing-', '')} |`)
    .join('\n');

  const typographyRows = p.typography.sizes
    .map(s => `| Text | typography/${s.role.replace(/\s/g, '-').toLowerCase()} | ${s.size} / lh ${s.lineHeight} | — |`)
    .join('\n');

  return `# ${token.tagline} — Figma Variables 가이드 (${platform})
> Updated: ${token.updatedAt}

## Figma Variables 직접 추가 방법

1. Figma 파일 열기 → 우측 패널 **Variables** 클릭
2. **Create variable collection** → 컬렉션명: \`${token.category}\`
3. 아래 표의 값을 타입별로 추가

---

## Color Variables

| Type | Name | Value | Group |
|------|------|-------|-------|
${colorRows}

---

## Spacing Variables (Number)

| Type | Name | Value | Group |
|------|------|-------|-------|
${spacingRows}

---

## Typography Variables

| Type | Name | Value | Group |
|------|------|-------|-------|
${typographyRows}

---

## Tokens Studio 플러그인으로 자동 추가 (권장)

1. Figma → Plugins → **Tokens Studio for Figma** 설치
2. 플러그인 열기 → **JSON** 탭 선택
3. 아래 JSON을 붙여넣기 → **Import** 클릭

\`\`\`json
${generateDesignTokensJSON(token, platform)}
\`\`\`

---

## Style Dictionary로 내보내기

\`\`\`bash
npx style-dictionary build --config style-dictionary.config.json
\`\`\`
`;
}
