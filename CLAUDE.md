# Design MD — AI 코딩 가이던스

이 문서는 AI 코딩 도구(Claude Code, Cursor, Copilot 등)가 이 레포지토리를 작업할 때 반드시 먼저 읽어야 하는 컨텍스트입니다.

---

## 핵심 원칙: 하드코딩 절대 금지

이 서비스에서 색상 값은 어디에도 직접 작성하지 않습니다.

```ts
// ❌ 절대 금지
color: '#18181b'
background: neutral[900].hex
border: '1px solid #e4e4e7'

// ✅ 올바른 방식 — Foundation 토큰 이름 참조
color: lightTokens['--color-text-normal']
background: lightTokens['--color-fill-neutral']
// 또는 CSS var 참조 (서비스 UI 레이어)
color: 'var(--color-text-normal)'
```

---

## 파일 구조 — 토큰 계층

```
lib/tokens/
├── palette.ts          # 1계층: OKLCH 원시값 (neutral 13단계 + status 5종)
├── semanticTokens.ts   # 2계층: 시멘틱 토큰 (lightTokens / darkTokens)
├── roleTokens.ts       # 3계층: Role 토큰 (--comp-{component}-{slot})
│                       #         Variant 토큰 (--comp-{component}-{slot}-{state})
├── resolveTheme.ts     # BrandToken → ResolvedTheme 변환 엔진
├── oklch.ts            # OKLCH 색 공간 변환 (sRGB ↔ OKLCH, 대비 검증)
├── serviceTheme.ts     # 서비스 자체 DS 싱글턴 (light + dark)
├── designMD.ts         # Design MD 서비스 BrandToken
└── [brand].ts          # 각 브랜드 토큰 (daangn.ts, kakao.ts 등)
```

---

## 토큰 4계층 캐스케이드

```
Palette (원시값)
  └─ palette.ts: neutral[0~1000].hex, status.success.fill.hex 등
       ↓ 참조
Semantic (의미)
  └─ semanticTokens.ts: lightTokens['--color-fill-normal'] = neutral[900].hex
  └─ globals.css: --color-fill-normal: var(--palette-neutral-900)
       ↓ 참조
Role (컴포넌트 슬롯)
  └─ roleTokens.ts: lightRoleTokens['--comp-button-primary-bg'] = lightTokens['--color-fill-normal']
  └─ globals.css: --comp-button-primary-bg: var(--color-fill-normal)
       ↓ 오버라이드
Variant (인터랙션 상태)
  └─ roleTokens.ts: lightVariantTokens['--comp-button-primary-bg-hover'] = lightTokens['--color-fill-strong']
  └─ globals.css: --comp-button-primary-bg-hover: var(--color-fill-strong)
```

**중요**: 각 계층은 반드시 바로 위 계층만 참조합니다. Variant → Role → Semantic → Palette 순서를 건너뛰지 않습니다.

---

## 색상 생성 규칙 (OKLCH 기반)

새 색상을 만들 때 반드시 지켜야 할 규칙:

| 용도 | L (밝기) | C (채도) | 이유 |
|------|----------|----------|------|
| 뉴트럴 | 0.000 ~ 1.000 | 0.000 ~ 0.009 | hue 286, 13단계 지각 균등 |
| 상태색 fill | 0.488 ~ 0.602 | 0.140 ~ 0.198 | WCAG AA 배경 대비 |
| 상태색 text | 0.390 ~ 0.498 | — | 흰 배경 4.5:1 이상 |
| 상태색 bg | 0.950 ~ 0.952 | 0.038 ~ 0.045 | 연한 배경 |

색상 변환은 `lib/tokens/oklch.ts`의 함수만 사용합니다:
- `hexToOklch(hex)` — sRGB → OKLCH
- `oklchToHex(l, c, h)` — OKLCH → sRGB
- `ensureContrastOklch(fg, bg, 4.5)` — WCAG AA 보장
- `deriveTintOklch(primary, isDark)` — 배지/칩 배경 틴트

HSL 기반 함수(hexToHSL, hslToHex 등)는 이 프로젝트에 존재하지 않습니다. 사용 금지.

---

## resolveTheme — 브랜드 토큰 → ResolvedTheme

```ts
// 시그니처
resolveTheme(token: BrandToken, platform: 'web' | 'mobile', mode: 'brand' | 'wireframe'): ResolvedTheme

// 서비스 자체 테마 (serviceTheme.ts)
export const serviceTheme     = resolveTheme(designMDToken, 'web', 'brand');
export const serviceDarkTheme = resolveTheme({ ...designMDToken, theme: 'dark' }, 'web', 'wireframe');
```

**mode 설명:**
- `'brand'`: 브랜드 토큰의 실제 색상 사용 (BrandUIPreview, 브랜드 갤러리)
- `'wireframe'`: Foundation 시멘틱 토큰 직접 사용 (WIREFRAME_LIGHT / WIREFRAME_DARK)

**isDark 결정:** `token.theme === 'dark'`로 결정됩니다. 어두운 서비스 테마가 필요하면 `theme: 'dark'`를 토큰에 명시하세요.

---

## 컴포넌트 DS (ds.tsx) 사용법

```ts
import { serviceDS, serviceDarkDS } from '@/lib/tokens/serviceTheme';
import { useTheme } from '@/components/ThemeProvider';

// 클라이언트 컴포넌트에서 다크모드 대응
const { theme } = useTheme();
const { Button, Badge, t } = theme === 'dark' ? serviceDarkDS : serviceDS;
```

`createDS(theme)` 반환값의 모든 컴포넌트는 inline style만 사용합니다 (CSS 클래스 없음). `t.*` 값은 항상 hex 문자열이며 CSS var가 아닙니다.

---

## 다크모드 구현 방식

- `<html data-theme="dark">` 속성으로 제어
- `app/layout.tsx` 의 인라인 스크립트가 첫 렌더 전 `data-theme` 설정 (플래시 방지)
- `components/ThemeProvider.tsx` — 상태 관리 + localStorage 저장
- `app/globals.css` — `[data-theme="dark"]` 선택자 + `@media` no-JS 폴백

서비스 UI 컴포넌트(Navigation 등)는 ThemeProvider를 통해 light/dark DS를 교체합니다. CSS var 기반 요소(body, 레이아웃 등)는 `var(--color-*)` 참조로 자동 전환됩니다.

---

## BrandToken 구조

```ts
interface BrandToken {
  slug: string;
  name: string;
  theme: 'light' | 'dark';        // ← isDark 결정
  colors: Array<{
    name: string;
    value: string;                 // hex
    role: string;                  // resolveTheme이 역할 매칭에 사용
    variable?: string;
  }>;
  platforms: {
    mobile: { typography, spacing, shapes, layout };
    web:    { typography, spacing, shapes, layout };
  };
  guidelines: { dos: string[]; donts: string[] };
}
```

**CTA 텍스트 색상 오버라이드:** `{ role: 'CTA 버튼 텍스트', value: '#ffffff' }` 형태로 추가하면 버튼 텍스트가 알고리즘 대신 이 값을 사용합니다.

---

## 자주 발생하는 실수

### 1. 파일을 읽지 않고 가정해서 편집
Edit 전 반드시 Read로 파일 내용 확인. 특히 import 목록은 전체 파일에서 확인해야 합니다.

### 2. import 추가 없이 새 함수 사용
`contrastOn`, `ensureContrast` 등을 `ds.tsx`에서 쓰려면 `resolveTheme`에서 import해야 합니다. TypeScript 빌드 에러로 배포가 실패합니다.

### 3. palette 직접 참조
```ts
// ❌ palette ref는 Foundation 토큰이 아님
neutral[900].hex

// ✅ 시멘틱 토큰 참조
lightTokens['--color-fill-normal']
```

### 4. HSL 함수 사용 시도
이 프로젝트는 OKLCH 기반입니다. `hexToHSL`, `hslToHex` 등은 없습니다. `oklch.ts` 함수만 사용하세요.

### 5. dark mode를 새 BrandToken color에서 해결하려는 시도
다크모드는 `theme: 'dark'` + `'wireframe'` 모드 조합으로 처리합니다. 브랜드 token의 colors 배열에 다크 hex를 추가하지 마세요.

---

## 주요 타입

```ts
// lib/tokens/resolveTheme.ts
interface ResolvedTheme {
  primary, onPrimary, primaryTint: string;   // 브랜드 컬러
  bg, surface, surfaceAlt: string;           // 배경
  textMain, textSub, textMuted: string;      // 텍스트
  border: string;                            // 테두리
  accent, success, danger, warning, info: string;
  disabled, textDisabled: string;
  // ... typography, spacing, radius, motion
}

// lib/tokens/semanticTokens.ts
type TokenMap = Record<string, string>;
export const lightTokens: TokenMap;
export const darkTokens: TokenMap;

// lib/tokens/roleTokens.ts
export const lightRoleTokens: TokenMap;
export const darkRoleTokens: TokenMap;
export const lightVariantTokens: TokenMap;
export const darkVariantTokens: TokenMap;
```

---

## 개발 환경

- Next.js 14 App Router (서버/클라이언트 컴포넌트 혼용)
- TypeScript strict 모드 — 빌드 에러 = 배포 실패
- Tailwind CSS (유틸리티), 인라인 스타일 (DS 컴포넌트)
- Supabase (인증 + DB)
- 배포: Vercel

브랜치: `claude/service-review-flow-4jy8n4` → 작업 후 push.
