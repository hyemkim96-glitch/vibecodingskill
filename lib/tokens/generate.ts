import { BrandToken, PlatformToken } from '@/types/token';

function platformDesignMd(token: BrandToken, platform: 'mobile' | 'web'): string {
  const p: PlatformToken = token.platforms[platform];
  const label = platform === 'mobile' ? 'Mobile (390px)' : 'Web (1440px)';

  const colors = token.colors
    .map((c) => `- **${c.name}**: \`${c.value}\` — ${c.role}`)
    .join('\n');

  const typeSizes = p.typography.sizes
    .map((s) => `| ${s.role} | ${s.size} | ${s.lineHeight} | ${s.letterSpacing} |`)
    .join('\n');

  const spacing = p.spacing.scale
    .map((s) => `- ${s.name}: \`${s.value}\` (${s.token})`)
    .join('\n');

  const shapes = p.shapes
    .map((s) => `- ${s.element}: \`${s.value}\``)
    .join('\n');

  const dos = token.guidelines.dos.map((d) => `- ${d}`).join('\n');
  const donts = token.guidelines.donts.map((d) => `- ${d}`).join('\n');

  const d = token.deep;

  const deepInteraction = d ? `
---

## Interaction & Motion

- **Duration:** ${d.interaction.duration}
- **Easing:** ${d.interaction.easing}
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

  const deepComponents = d && d.components.length > 0 ? `
---

## Component Specs

${d.components.map(c => `### ${c.name}
${c.anatomy ? `**구조:** ${c.anatomy}\n` : ''}${c.states ? `**States:** ${c.states}\n` : ''}
\`\`\`
${c.spec}
\`\`\``).join('\n\n')}
` : '';

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
` : '';

  const deepA11y = d ? `
---

## Accessibility

\`\`\`
${d.accessibilityNotes}
\`\`\`
` : '';

  const aiPromptColors = token.colors
    .filter(c => !/(gray|white|black|grey)/i.test(c.name))
    .slice(0, 3)
    .map(c => `  ${c.name}: ${c.value}`)
    .join('\n');

  return `# ${token.tagline} Design Token — ${label}
> Updated: ${token.updatedAt} | Category: ${token.category} | Theme: ${token.theme}

${token.description}

---

## Color Palette

${colors}

---

## Typography

**Font Family:** ${p.typography.family}
**Substitute:** ${p.typography.substitute ?? 'system-ui'}
**Weights:** ${p.typography.weights.join(', ')}

| Role | Size | Line Height | Letter Spacing |
|------|------|-------------|----------------|
${typeSizes}

---

## Spacing

**Base Unit:** ${p.spacing.baseUnit} | **Density:** ${p.spacing.density}

${spacing}

---

## Shape (Border Radius)

${shapes}

---

## Layout

- Max Width: ${p.layout.maxWidth}
- Section Gap: ${p.layout.sectionGap}
${p.layout.columns ? `- Grid: ${p.layout.columns}` : ''}
${p.layout.touchTarget ? `- Touch Target (min): ${p.layout.touchTarget}` : ''}

---

## Design Guidelines

### Do
${dos}

### Don't
${donts}
${deepInteraction}${deepVoice}${deepComponents}${deepBreakpoints}${deepStyle}${deepA11y}
---

## AI Prompt Ready

\`\`\`
Design system: ${token.tagline} (${label})
Category: ${token.category} | Theme: ${token.theme}

Brand colors:
${aiPromptColors}

Typography: ${p.typography.family} (fallback: ${p.typography.substitute ?? 'system-ui'})
Font weights: ${p.typography.weights.join(', ')}
Base font size: ${p.typography.sizes.find(s => s.role === 'Body 1')?.size ?? '16px'}

Border radius (card): ${p.shapes.find(s => s.element === 'card')?.value ?? p.shapes[0]?.value}
Border radius (button): ${p.shapes.find(s => s.element === 'button')?.value ?? p.shapes[0]?.value}
Spacing base: ${p.spacing.baseUnit} | Density: ${p.spacing.density}
Max width: ${p.layout.maxWidth}

${token.description}
${d ? `
Voice: ${d.voice.tone}
Motion: ${d.interaction.duration}
Press feedback: ${d.interaction.pressScale ?? 'none'}
` : ''}
\`\`\`
`;
}

export function generateDesignMd(token: BrandToken, platform: 'mobile' | 'web' = 'mobile'): string {
  return platformDesignMd(token, platform);
}

export function generateCSS(token: BrandToken, platform: 'mobile' | 'web' = 'mobile'): string {
  const p = token.platforms[platform];
  const colors = token.colors
    .map((c) => `  ${c.variable}: ${c.value};`)
    .join('\n');

  const spacing = p.spacing.scale
    .map((s) => `  ${s.token}: ${s.value};`)
    .join('\n');

  const shapes = p.shapes
    .map((s) => `  --radius-${s.element.replace(/[\s/]/g, '-')}: ${s.value};`)
    .join('\n');

  return `:root {
  /* ${token.tagline} Design Tokens — ${platform === 'mobile' ? 'Mobile' : 'Web'} */
  /* Updated: ${token.updatedAt} */

  /* Colors */
${colors}

  /* Typography */
  --font-primary: '${p.typography.family}', ${p.typography.substitute ?? 'system-ui'};

  /* Spacing */
  --spacing-base: ${p.spacing.baseUnit};
${spacing}

  /* Border Radius */
${shapes}

  /* Layout */
  --page-max-width: ${p.layout.maxWidth};
  --section-gap: ${p.layout.sectionGap};
}`;
}

export function generateTailwind(token: BrandToken, platform: 'mobile' | 'web' = 'mobile'): string {
  const p = token.platforms[platform];
  const colors = token.colors
    .map((c) => {
      const name = c.name.toLowerCase().replace(/\s/g, '-');
      return `    '${name}': '${c.value}',`;
    })
    .join('\n');

  const spacing = p.spacing.scale
    .map((s) => `    '${s.name}': '${s.value}',`)
    .join('\n');

  return `// tailwind.config.js — ${token.tagline} Design Tokens (${platform})
// Updated: ${token.updatedAt}

module.exports = {
  theme: {
    extend: {
      colors: {
${colors}
      },
      fontFamily: {
        primary: ['${p.typography.family}', '${p.typography.substitute ?? 'system-ui'}'],
      },
      spacing: {
${spacing}
      },
      borderRadius: {
${p.shapes.map((s) => `        '${s.element.replace(/[\s/]/g, '-')}': '${s.value}',`).join('\n')}
      },
    },
  },
};`;
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

  const json = {
    $metadata: { tokenSetOrder: ['color', 'spacing', 'borderRadius'] },
    $description: `${token.tagline} Design Tokens (${platform}) — Updated: ${token.updatedAt}`,
    color: colors,
    spacing,
    borderRadius: radius,
    typography: {
      fontFamily: { value: p.typography.family, type: 'fontFamily' },
      weights: Object.fromEntries(
        p.typography.weights.map((w) => [String(w), { value: String(w), type: 'fontWeight' }])
      ),
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
