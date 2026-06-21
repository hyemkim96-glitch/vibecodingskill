import { BrandToken } from '@/types/token';

export function generateDesignMd(token: BrandToken): string {
  const colors = token.colors
    .map((c) => `- **${c.name}**: \`${c.value}\` — ${c.role}`)
    .join('\n');

  const typeSizes = token.typography.sizes
    .map((s) => `| ${s.role} | ${s.size} | ${s.lineHeight} | ${s.letterSpacing} |`)
    .join('\n');

  const spacing = token.spacing.scale
    .map((s) => `- ${s.name}: \`${s.value}\` (${s.token})`)
    .join('\n');

  const shapes = token.shapes
    .map((s) => `- ${s.element}: \`${s.value}\``)
    .join('\n');

  const dos = token.guidelines.dos.map((d) => `- ${d}`).join('\n');
  const donts = token.guidelines.donts.map((d) => `- ${d}`).join('\n');

  return `# ${token.name} Design Token
> Updated: ${token.updatedAt} | Category: ${token.category} | Theme: ${token.theme}

${token.description}

---

## Color

${colors}

---

## Typography

**Font Family:** ${token.typography.family}
**Substitute:** ${token.typography.substitute ?? 'system-ui'}
**Weights:** ${token.typography.weights.join(', ')}

| Role | Size | Line Height | Letter Spacing |
|------|------|-------------|----------------|
${typeSizes}

---

## Spacing

**Base Unit:** ${token.spacing.baseUnit} | **Density:** ${token.spacing.density}

${spacing}

---

## Shape (Border Radius)

${shapes}

---

## Layout

- Max Width: ${token.layout.maxWidth}
- Section Gap: ${token.layout.sectionGap}

---

## Guidelines

### Do
${dos}

### Don't
${donts}

---

## AI Prompt Ready

\`\`\`
Use the ${token.name} design system:
- Primary color: ${token.colors[0]?.value}
- Font: ${token.typography.family} (substitute: ${token.typography.substitute ?? 'system-ui'})
- Border radius: ${token.shapes.find(s => s.element === 'cards')?.value ?? token.shapes[0]?.value}
- Spacing base: ${token.spacing.baseUnit}
- Theme: ${token.theme}
${token.description}
\`\`\`
`;
}

export function generateCSS(token: BrandToken): string {
  const colors = token.colors
    .map((c) => `  ${c.variable}: ${c.value};`)
    .join('\n');

  const spacing = token.spacing.scale
    .map((s) => `  ${s.token}: ${s.value};`)
    .join('\n');

  const shapes = token.shapes
    .map((s) => `  --radius-${s.element.replace(/\s/g, '-')}: ${s.value};`)
    .join('\n');

  return `:root {
  /* ${token.name} Design Tokens */
  /* Updated: ${token.updatedAt} */

  /* Colors */
${colors}

  /* Typography */
  --font-primary: '${token.typography.family}', ${token.typography.substitute ?? 'system-ui'};

  /* Spacing */
  --spacing-base: ${token.spacing.baseUnit};
${spacing}

  /* Border Radius */
${shapes}

  /* Layout */
  --page-max-width: ${token.layout.maxWidth};
  --section-gap: ${token.layout.sectionGap};
}`;
}

export function generateTailwind(token: BrandToken): string {
  const colors = token.colors
    .map((c) => {
      const name = c.name.toLowerCase().replace(/\s/g, '-');
      return `    '${name}': '${c.value}',`;
    })
    .join('\n');

  const spacing = token.spacing.scale
    .map((s) => `    '${s.name}': '${s.value}',`)
    .join('\n');

  return `// tailwind.config.js — ${token.name} Design Tokens
// Updated: ${token.updatedAt}

module.exports = {
  theme: {
    extend: {
      colors: {
${colors}
      },
      fontFamily: {
        primary: ['${token.typography.family}', '${token.typography.substitute ?? 'system-ui'}'],
      },
      spacing: {
${spacing}
      },
      borderRadius: {
${token.shapes.map((s) => `        '${s.element.replace(/\s/g, '-')}': '${s.value}',`).join('\n')}
      },
    },
  },
};`;
}

export function generateDesignTokensJSON(token: BrandToken): string {
  const colors: Record<string, { value: string; type: string; description: string }> = {};
  token.colors.forEach((c) => {
    const key = c.name.toLowerCase().replace(/\s/g, '-');
    colors[key] = { value: c.value, type: 'color', description: c.role };
  });

  const spacing: Record<string, { value: string; type: string }> = {};
  token.spacing.scale.forEach((s) => {
    spacing[s.name] = { value: s.value, type: 'spacing' };
  });

  const radius: Record<string, { value: string; type: string }> = {};
  token.shapes.forEach((s) => {
    radius[s.element.replace(/\s/g, '-')] = { value: s.value, type: 'borderRadius' };
  });

  const json = {
    $metadata: { tokenSetOrder: ['color', 'spacing', 'borderRadius'] },
    $description: `${token.name} Design Tokens — Updated: ${token.updatedAt}`,
    color: colors,
    spacing,
    borderRadius: radius,
    typography: {
      fontFamily: { value: token.typography.family, type: 'fontFamily' },
      weights: Object.fromEntries(
        token.typography.weights.map((w) => [String(w), { value: String(w), type: 'fontWeight' }])
      ),
    },
  };

  return JSON.stringify(json, null, 2);
}

export function generateFigmaVariables(token: BrandToken): string {
  const colorRows = token.colors
    .map((c) => `| Color | ${c.name} | ${c.value} | ${c.variable.replace('--color-', '')} |`)
    .join('\n');

  const spacingRows = token.spacing.scale
    .map((s) => `| Number | spacing/${s.name} | ${s.value} | ${s.token.replace('--spacing-', '')} |`)
    .join('\n');

  return `# ${token.name} — Figma Variables 가이드
> Updated: ${token.updatedAt}

## Figma Variables 직접 추가 방법

1. Figma 파일 열기 → 우측 패널 **Variables** 클릭
2. **Create variable collection** → 컬렉션명: \`${token.name}\`
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
${generateDesignTokensJSON(token)}
\`\`\`

---

## Style Dictionary로 내보내기

\`\`\`bash
npx style-dictionary build --config style-dictionary.config.json
\`\`\`
`;
}
