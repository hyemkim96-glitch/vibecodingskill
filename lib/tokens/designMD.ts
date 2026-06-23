import { BrandToken } from '@/types/token';
import { neutral } from './palette';

/**
 * Design MD service token.
 *
 * Used as the base theme for Foundation / Components / Patterns pages.
 * Colors reference the canonical neutral palette (palette.ts Tier 1)
 * so any palette update propagates here automatically.
 *
 * Neutral-first design: primary = near-black, no brand hue.
 * Full token cascade: Palette → Semantic → Role → Variant.
 */
export const designMDToken: BrandToken = {
  slug: 'design-md',
  name: 'Design MD',
  nameKo: '디자인 MD',
  tagline: 'AI 빌더를 위한 브랜드 토큰 엔진',
  category: '개발자 도구',
  country: 'KR',
  serviceTypes: ['디자인 도구', '개발자 도구'],
  theme: 'light',
  description:
    '브랜드 색상을 입력하면 OKLCH 기반 4계층 토큰(Palette → Semantic → Role → Variant)을 자동 생성하는 DS 엔진. 컴포넌트 미리보기와 Foundation 문서를 실시간으로 업데이트한다.',
  colors: [
    // neutral[900] — near-black, Primary CTA
    { name: '기본',         value: neutral[900].hex, variable: '--color-primary',    role: 'Primary' },
    // neutral[0] — pure white backgrounds
    { name: '기본 배경',   value: neutral[0].hex,   variable: '--color-bg',          role: '기본 배경' },
    { name: '카드 배경',   value: neutral[0].hex,   variable: '--color-surface',     role: '카드 배경' },
    // neutral[50] — off-white for secondary surfaces
    { name: '보조 배경',   value: neutral[50].hex,  variable: '--color-surface-alt', role: '보조 배경' },
    // neutral[950] — darkest for primary body text
    { name: '본문 텍스트', value: neutral[950].hex, variable: '--color-text',        role: '본문 텍스트' },
    // neutral[600] — medium gray for labels and secondary text
    { name: '보조 텍스트', value: neutral[600].hex, variable: '--color-text-sub',    role: '보조 텍스트' },
    // neutral[400] — light gray for hints, placeholders
    { name: '힌트 텍스트', value: neutral[400].hex, variable: '--color-text-muted',  role: '비활성 텍스트' },
    // neutral[200] — subtle dividers and borders
    { name: '구분선',       value: neutral[200].hex, variable: '--color-border',     role: '구분선' },
  ],
  platforms: {
    mobile: {
      spacing: {
        baseUnit: '4px',
        density: 'regular',
        scale: [
          { name: 'xxs', value: '2px',  token: '--spacing-xxs' },
          { name: 'xs',  value: '4px',  token: '--spacing-xs'  },
          { name: 'sm',  value: '8px',  token: '--spacing-sm'  },
          { name: 'md',  value: '12px', token: '--spacing-md'  },
          { name: 'lg',  value: '16px', token: '--spacing-lg'  },
          { name: 'xl',  value: '24px', token: '--spacing-xl'  },
        ],
      },
      shapes: [
        { element: 'button', value: '10px'   },
        { element: 'card',   value: '10px'   },
        { element: 'input',  value: '10px'   },
        { element: 'chip',   value: '9999px' },
        { element: 'badge',  value: '4px'    },
      ],
      layout: { maxWidth: '390px', sectionGap: '24px', touchTarget: '44px' },
      typography: {
        family: "'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        substitute: 'system-ui',
        weights: [400, 600, 700],
        sizes: [
          { role: 'display',   size: '36px', lineHeight: '1.25', letterSpacing: '-0.04em'  },
          { role: 'Heading 1', size: '26px', lineHeight: '1.35', letterSpacing: '-0.025em' },
          { role: 'Heading 2', size: '20px', lineHeight: '1.40', letterSpacing: '-0.015em' },
          { role: 'Body 1',    size: '16px', lineHeight: '1.65', letterSpacing: '-0.01em'  },
          { role: 'Body 2',    size: '14px', lineHeight: '1.60', letterSpacing: '-0.005em' },
          { role: 'caption',   size: '12px', lineHeight: '1.50', letterSpacing: '0em'      },
        ],
      },
    },
    web: {
      spacing: {
        baseUnit: '4px',
        density: 'regular',
        scale: [
          { name: 'xxs', value: '2px',  token: '--spacing-xxs' },
          { name: 'xs',  value: '4px',  token: '--spacing-xs'  },
          { name: 'sm',  value: '8px',  token: '--spacing-sm'  },
          { name: 'md',  value: '12px', token: '--spacing-md'  },
          { name: 'lg',  value: '16px', token: '--spacing-lg'  },
          { name: 'xl',  value: '24px', token: '--spacing-xl'  },
        ],
      },
      shapes: [
        { element: 'button', value: '10px'   },
        { element: 'card',   value: '10px'   },
        { element: 'input',  value: '10px'   },
        { element: 'chip',   value: '9999px' },
        { element: 'badge',  value: '4px'    },
      ],
      layout: { maxWidth: '1280px', sectionGap: '32px', columns: '12' },
      typography: {
        family: "'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        substitute: 'system-ui',
        weights: [400, 600, 700],
        sizes: [
          { role: 'display',   size: '36px', lineHeight: '1.25', letterSpacing: '-0.04em'  },
          { role: 'Heading 1', size: '26px', lineHeight: '1.35', letterSpacing: '-0.025em' },
          { role: 'Heading 2', size: '20px', lineHeight: '1.40', letterSpacing: '-0.015em' },
          { role: 'Body 1',    size: '16px', lineHeight: '1.65', letterSpacing: '-0.01em'  },
          { role: 'Body 2',    size: '14px', lineHeight: '1.60', letterSpacing: '-0.005em' },
          { role: 'caption',   size: '12px', lineHeight: '1.50', letterSpacing: '0em'      },
        ],
      },
    },
  },
  deep: {
    interaction: {
      duration: '150ms (micro), 200ms (standard)',
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      pressScale: 'scale(0.97)',
      hoverScale: '1.0',
      notes:
        '에디터·뷰어 UI이므로 모션은 최소화. 탭 전환과 패널 열림만 200ms 사용. 토큰 변경 시 색상 전환은 즉시(0ms).',
    },
    voice: {
      tone: '명확하고 기술적. 디자이너·개발자 대상. 한국어/영어 혼용 허용.',
      examples: [
        '"토큰이 생성됐어요"',
        '"팔레트가 업데이트됐어요"',
        '"WCAG AA 대비를 충족하지 않아요"',
      ],
      avoid: ['감성적 표현', '비전문적 어휘', '추상적 설명'],
    },
    iconStyle:
      'Lucide 기반, 1.5px stroke, 16×16 / 20×20px 기준. 선형(outline) 아이콘만 사용. 채움 아이콘 금지.',
  },
  guidelines: {
    dos: [
      '팔레트 → 시멘틱 → Role → Variant 4계층 순서 엄수 — 계층을 건너뛰는 색상 참조 금지',
      'Neutral 팔레트 중심 — 브랜드 컬러는 BrandUIPreview 영역에만, 서비스 UI 크롬은 모노크롬',
      '토큰 이름 노출 — 색상 값(hex)이 아닌 토큰 이름(--color-fill-normal)을 항상 함께 표기',
      'caption(12px)을 타이포 최솟값으로 — 그 이하 폰트 크기 사용 불가',
      '4px 여백 그리드 — xxs(2)·xs(4)·sm(8)·md(12)·lg(16)·xl(24) 스케일만 허용',
      'OKLCH 제약 준수 — fill C 0.140–0.198, text L 0.390–0.498, WCAG AA ≥ 4.5:1',
    ],
    donts: [
      '하드코딩 색상 금지 — 컴포넌트·페이지 어디서든 hex 직접 작성 불가',
      '팔레트에 의미 부여 금지 — 팔레트는 hue 이름만(red, green), 역할은 semantic 계층에서',
      '임의 폰트 크기 금지 — DS 타입 스케일(display/h1/h2/body/bodySm/caption) 외 크기 금지',
      'HSL 사용 금지 — OKLCH 기반 oklch.ts 함수만 사용(hexToOklch, oklchToHex 등)',
    ],
  },
  updatedAt: '2026-06',
};
